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



## Logika Utama

Target kalori harian anak bukan angka tetap — dia bertambah sesuai kalori yang terbakar dari latihan lari hari itu:
