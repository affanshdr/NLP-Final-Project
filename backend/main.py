import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gec-backend")

app = FastAPI(
    title="Indonesian Grammatical Error Correction API",
    description="Backend API for Indonesian GEC using fine-tuned mT5 model",
    version="1.0.0"
)

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API schemas
class CorrectionRequest(BaseModel):
    text: str = ""

class CorrectionResponse(BaseModel):
    original: str
    corrected: str
    confidence: float

# Model configurations
MODEL_PATH = os.getenv("MODEL_PATH", "google/mt5-small")
USE_MOCK = os.getenv("USE_MOCK", "False").lower() in ("true", "1", "yes")

# Global variables for model and tokenizer
model = None
tokenizer = None
model_loaded = False

if not USE_MOCK:
    try:
        import torch
        from transformers import T5ForConditionalGeneration, AutoTokenizer
        
        logger.info(f"Loading mT5 model and tokenizer from: {MODEL_PATH}...")
        
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        
        # Load model
        device = "cuda" if torch.cuda.is_available() else "cpu"
        model = T5ForConditionalGeneration.from_pretrained(MODEL_PATH).to(device)
        model.eval()
        
        model_loaded = True
        logger.info(f"Model successfully loaded on device: {device}")
    except Exception as e:
        logger.error(f"Failed to load model. Falling back to Mock mode. Error: {str(e)}")
        model_loaded = False

def run_mock_correction(text: str) -> tuple[str, float]:
    """
    Fallback/Mock correction rules for development without GPU or model file.
    """
    # Simple dictionary correction mapping
    rules = {
        r"\bgw\b": "saya",
        r"\bgue\b": "saya",
        r"\baku\b": "saya",
        r"\bdikampus\b": "di kampus",
        r"\bdirumah\b": "di rumah",
        r"\bdisini\b": "di sini",
        r"\bnungguin\b": "menunggu",
        r"\bgak\b": "tidak",
        r"\bnggak\b": "tidak",
        r"\bgimana\b": "bagaimana",
        r"\bkenapa\b": "mengapa",
        r"\budah\b": "sudah",
        r"\bgaada\b": "tidak ada",
        r"\btrus\b": "terus",
        r"\bbgt\b": "banget",
        r"\bsmua\b": "semua",
        r"\bdgn\b": "dengan",
        r"\byg\b": "yang",
    }
    
    import re
    corrected = text
    for pattern, replacement in rules.items():
        corrected = re.sub(pattern, replacement, corrected, flags=re.IGNORECASE)
    
    # Capitalize first letter of sentences
    def capitalize(match):
        return match.group(1) + match.group(2).upper()
    corrected = re.sub(r"(^\s*|[.!?]\s+)([a-z])", capitalize, corrected)
    
    # Simple dynamic confidence calculation based on differences
    if text == corrected:
        confidence = 0.99
    else:
        diff_len = abs(len(text) - len(corrected)) + 1
        confidence = max(0.60, min(0.95, 0.95 - (diff_len / max(len(text), 1))))
        
    return corrected, round(confidence, 2)

@app.post("/correct", response_model=CorrectionResponse)
async def correct_text(req: CorrectionRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Field 'text' cannot be empty.")
    
    # Use real model if loaded and not mocked
    if model_loaded and not USE_MOCK:
        try:
            import torch
            import torch.nn.functional as F
            
            # mT5 expects input text to be processed
            # Adjust input template if your fine-tuned model expects specific prompts/prefixes (e.g. "koreksi: <text>")
            prefix = "perbaiki: "
            input_text = prefix + text
            
            device = next(model.parameters()).device
            inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True, max_length=128).to(device)
            
            # Generate corrected sentence with score output
            with torch.no_grad():
                outputs = model.generate(
                    input_ids=inputs["input_ids"],
                    attention_mask=inputs["attention_mask"],
                    max_length=128,
                    num_beams=4,
                    early_stopping=True,
                    return_dict_in_generate=True,
                    output_scores=True
                )
                
            # Decode output
            generated_ids = outputs.sequences[0]
            # Remove special padding/eos tokens for correct translation output
            corrected_text = tokenizer.decode(generated_ids, skip_special_tokens=True)
            
            # Calculate confidence score based on token probabilities
            # outputs.scores has logits for each generated token (excluding the first prompt token / start token)
            # shape of each element in scores: (batch_size, vocab_size)
            if hasattr(outputs, "scores") and len(outputs.scores) > 0:
                probabilities = []
                # Match generated tokens starting from index 1 (since index 0 is typically pad/decoder_start_token)
                for i, score_tensor in enumerate(outputs.scores):
                    # Check if index is within bounds of generated sequence
                    if i + 1 < len(generated_ids):
                        next_token_id = generated_ids[i + 1]
                        # Apply Softmax to get probability distribution
                        probs = F.softmax(score_tensor[0], dim=-1)
                        token_prob = probs[next_token_id].item()
                        probabilities.append(token_prob)
                
                # Confidence is the average probability of generated tokens
                confidence = sum(probabilities) / len(probabilities) if probabilities else 0.90
            else:
                confidence = 0.90
                
            return CorrectionResponse(
                original=text,
                corrected=corrected_text,
                confidence=round(confidence, 2)
            )
            
        except Exception as e:
            logger.error(f"Inference error: {str(e)}. Falling back to rule-based mock.")
            corrected, confidence = run_mock_correction(text)
            return CorrectionResponse(original=text, corrected=corrected, confidence=confidence)
            
    else:
        # Run mock/rule-based correction
        corrected, confidence = run_mock_correction(text)
        return CorrectionResponse(
            original=text,
            corrected=corrected,
            confidence=confidence
        )

@app.get("/")
async def root():
    return {
        "message": "Indonesian GEC Backend is running!",
        "docs": "/docs",
        "status": "/status"
    }

@app.get("/status")
async def get_status():
    return {
        "model_loaded": model_loaded,
        "model_path": MODEL_PATH,
        "use_mock": USE_MOCK,
        "device": str(next(model.parameters()).device) if model_loaded else "N/A"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
