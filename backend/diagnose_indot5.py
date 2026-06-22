# diagnose_indot5.py — jalankan dari folder backend/
import os, json
import torch
from transformers import AutoTokenizer, T5ForConditionalGeneration
from safetensors.torch import load_file

MODEL_PATH = "./model"

print("=== config.json ===")
cfg = json.load(open(os.path.join(MODEL_PATH, "config.json")))
for k in ["_name_or_path", "model_type", "tie_word_embeddings", "vocab_size", "d_model"]:
    print(f"  {k}: {cfg.get(k)}")

print("\n=== safetensors ===")
sd = load_file(os.path.join(MODEL_PATH, "model.safetensors"))
print("  jumlah tensor:", len(sd))
print("  ada lm_head.weight?:", "lm_head.weight" in sd)

print("\n=== uji inferensi (load dari disk, persis seperti backend) ===")
tok = AutoTokenizer.from_pretrained(MODEL_PATH)
model = T5ForConditionalGeneration.from_pretrained(MODEL_PATH)
model.eval()

def correct(text):
    inp = tok("perbaiki: " + text, return_tensors="pt", truncation=True, max_length=128)
    with torch.no_grad():
        out = model.generate(**inp, max_length=128, num_beams=4,
                             no_repeat_ngram_size=3, repetition_penalty=1.2)
    return tok.decode(out[0], skip_special_tokens=True)

for t in ["hei kamu samasiapa kesekolah", "kamu kesini dengan siapa", "gw udh slesai ngerjain tugas nya"]:
    print("IN :", t)
    print("OUT:", correct(t))
    print("-" * 40)