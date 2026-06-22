# fix_indot5.py — jalankan dari folder backend/
import json, os, torch
from transformers import AutoTokenizer, T5ForConditionalGeneration

MODEL_PATH = "./model"
cfg_path = os.path.join(MODEL_PATH, "config.json")

# 1) Patch config: matikan tie
cfg = json.load(open(cfg_path, encoding="utf-8"))
print("Sebelum: tie_word_embeddings =", cfg.get("tie_word_embeddings"))
cfg["tie_word_embeddings"] = False
json.dump(cfg, open(cfg_path, "w", encoding="utf-8"), indent=2)
print("Sesudah: tie_word_embeddings =", cfg["tie_word_embeddings"])

# 2) Verifikasi reload dari disk (persis seperti backend)
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