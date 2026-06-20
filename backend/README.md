# Backend GEC Indonesia (FastAPI)

Kanal backend untuk aplikasi pendeteksi dan koreksi kesalahan ejaan serta tata bahasa (*Grammatical Error Correction*) menggunakan model **mT5** (`google/mt5-small`) berbasis PyTorch dan Hugging Face.

## Prasyarat
- Python 3.8 atau yang lebih baru.

## Langkah Instalasi & Pengaktifan

1. **Masuk ke folder backend:**
   ```bash
   cd backend
   ```

2. **Buat Virtual Environment (venv):**
   - **Windows (PowerShell/CMD):**
     ```bash
     python -m venv venv
     ```

3. **Aktifkan Virtual Environment:**
   - **Windows (PowerShell):**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD):**
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **Linux / macOS:**
     ```bash
     source venv/bin/activate
     ```

4. **Instal dependensi:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Konfigurasi Lingkungan (`.env`):**
   Ubah konfigurasi di file `.env` jika diperlukan:
   - `MODEL_PATH`: Lokasi folder model mT5 hasil fine-tuning Anda (atau ID repositori Hugging Face).
   - `USE_MOCK`: Set ke `True` untuk menggunakan mode pencocokan aturan sederhana (tanpa men-download model) jika sedang melakukan pengujian frontend cepat. Set ke `False` untuk memuat model asli.

6. **Jalankan FastAPI Server:**
   ```bash
   python main.py
   ```
   Server akan berjalan secara lokal di alamat: `http://127.0.0.1:8000`
   
   Dokumentasi API interaktif (Swagger UI) dapat diakses di: `http://127.0.0.1:8000/docs`

## Hubungkan ke Frontend Next.js

Untuk menghubungkan frontend dengan backend FastAPI ini, ubah berkas `.env.local` di folder utama proyek (root folder):

```env
MODEL_API_URL=http://127.0.0.1:8000
```
Jika variabel `MODEL_API_URL` terisi, frontend Next.js akan meneruskan semua permintaan koreksi ke FastAPI backend ini. Jika dikosongkan, Next.js akan menggunakan simulasi internalnya.
