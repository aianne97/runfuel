# RunFuel

Aplikasi pelacak kebutuhan kalori untuk anak yang aktif berlatih lari. Membantu orang tua dan pelatih memastikan asupan makan anak sesuai kebutuhan energi — tidak kurang, tidak berlebihan — dengan mempertimbangkan aktivitas latihan harian.

## Masalah yang Diselesaikan

Anak yang rutin latihan lari punya kebutuhan kalori berbeda dari anak pada umumnya, tapi orang tua sering tidak punya acuan jelas untuk menghitungnya. RunFuel menerjemahkan data fisik anak dan aktivitas larinya menjadi target kalori harian dan mingguan yang mudah dipahami.

## Fitur

- Onboarding data anak (gender, usia, tinggi, berat badan)
- Perhitungan target kalori dasar mengacu AKG (PMK 28/2019)
- Input makanan dengan kalkulasi kalori otomatis
- Input sesi lari (jarak & pace) dengan perhitungan kalori terbakar (rumus MET)
- Target kalori harian yang otomatis menyesuaikan berdasarkan aktivitas lari
- Dashboard progres mingguan dengan grafik 7 hari

## Tech Stack

- **Backend:** Flask, SQLAlchemy, SQLite
- **Frontend:** React (Vite), Axios
- **Styling:** CSS custom (design tokens)

## Cara Menjalankan

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install flask flask-sqlalchemy flask-cors
python app.py
```
Server jalan di `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Buka `http://localhost:5173` (atau port yang ditampilkan di terminal)
## Screenshoot
**Onboarding**
<img width="1915" height="1023" alt="Cuplikan layar 2026-09-13 153626" src="https://github.com/user-attachments/assets/1a0bc22b-d83c-42cc-bfe5-c6fc4fa5e8c7" />

**Dashboard**
<img width="1895" height="967" alt="Cuplikan layar 2026-09-13 153800" src="https://github.com/user-attachments/assets/51b85fda-7053-4d31-9a5f-6de6516878c7" />

**Input Makanan Dan Input Lari**
<img width="846" height="825" alt="Cuplikan layar 2026-09-13 170424" src="https://github.com/user-attachments/assets/5fa122b1-36c3-46b0-a100-266adcaa7b56" />


## Logika Utama

Target kalori harian anak bukan angka tetap — dia bertambah sesuai kalori yang terbakar dari latihan lari hari itu:
