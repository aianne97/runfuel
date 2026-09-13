from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class Anak(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)  # 'laki-laki' / 'perempuan'
    usia = db.Column(db.Integer, nullable=False)
    tinggi_cm = db.Column(db.Float, nullable=False)
    berat_kg = db.Column(db.Float, nullable=False)

class Makanan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    kalori_per_porsi = db.Column(db.Float, nullable=False)

class LogMakan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    anak_id = db.Column(db.Integer, db.ForeignKey('anak.id'), nullable=False)
    makanan_id = db.Column(db.Integer, db.ForeignKey('makanan.id'), nullable=False)
    jumlah_porsi = db.Column(db.Float, default=1.0)
    tanggal = db.Column(db.Date, default=date.today)
    makanan = db.relationship('Makanan')

class LogLari(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    anak_id = db.Column(db.Integer, db.ForeignKey('anak.id'), nullable=False)
    jarak_km = db.Column(db.Float, nullable=False)
    pace_menit_per_km = db.Column(db.Float, nullable=False)
    kalori_terbakar = db.Column(db.Float, nullable=False)
    tanggal = db.Column(db.Date, default=date.today)