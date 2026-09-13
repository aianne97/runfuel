from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import date, timedelta
from models import db, Anak, Makanan, LogMakan, LogLari

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///kalori_lari.db'
db.init_app(app)

CORS(app, origins=["http://localhost:5174"])

with app.app_context():
    db.create_all()
    if Makanan.query.count() == 0:
        seed = [
            ("Nasi putih (1 centong)", 175),
            ("Roti tawar (1 lembar)", 70),
            ("Telur rebus (1 butir)", 78),
            ("Ayam goreng (1 potong)", 260),
            ("Tempe goreng (1 potong)", 80),
            ("Tahu goreng (1 potong)", 60),
            ("Pisang (1 buah)", 105),
            ("Susu UHT (1 gelas)", 150),
            ("Mie instan (1 bungkus)", 380),
            ("Sayur bening (1 mangkuk)", 50),
        ]
        for nama, kal in seed:
            db.session.add(Makanan(nama=nama, kalori_per_porsi=kal))
        db.session.commit()


def hitung_target_kalori(gender, usia):
    # Baseline mengacu AKG PMK 28/2019, usia sekolah
    if usia <= 9:
        return 1800 if gender == 'laki-laki' else 1650
    elif usia <= 12:
        return 2000 if gender == 'laki-laki' else 1900
    else:
        return 2100 if gender == 'laki-laki' else 2000


def hitung_kalori_terbakar(berat_kg, jarak_km, pace_menit_per_km, met=9.5):
    durasi_jam = (jarak_km * pace_menit_per_km) / 60
    return round(met * berat_kg * durasi_jam, 1)

def get_awal_minggu(d):
    return d - timedelta(days=d.weekday())  # Senin


@app.route('/api/dashboard/mingguan', methods=['GET'])
def dashboard_mingguan():
    anak_id = request.args.get('anak_id', type=int)
    anak = Anak.query.get_or_404(anak_id)
    target_dasar = hitung_target_kalori(anak.gender, anak.usia)

    awal_minggu = get_awal_minggu(date.today())
    hari_list = [awal_minggu + timedelta(days=i) for i in range(7)]

    breakdown = []
    total_masuk_minggu = 0
    total_terbakar_minggu = 0

    for h in hari_list:
        logs_makan = LogMakan.query.filter_by(anak_id=anak_id, tanggal=h).all()
        masuk_hari = sum(l.makanan.kalori_per_porsi * l.jumlah_porsi for l in logs_makan)

        logs_lari = LogLari.query.filter_by(anak_id=anak_id, tanggal=h).all()
        terbakar_hari = sum(l.kalori_terbakar for l in logs_lari)
        total_masuk_minggu += masuk_hari
        total_terbakar_minggu += terbakar_hari

        breakdown.append({
            "tanggal": h.isoformat(),
            "hari": h.strftime("%a"),
            "masuk": masuk_hari,
            "terbakar": terbakar_hari,
        })

    target_dasar_minggu = target_dasar * 7
    target_disesuaikan_minggu = target_dasar_minggu + total_terbakar_minggu

    if total_masuk_minggu < target_disesuaikan_minggu * 0.9:
        status = "kurang"
    elif total_masuk_minggu > target_disesuaikan_minggu * 1.1:
        status = "lebih"
    else:
        status = "pas"

    return jsonify({
        "target_dasar_minggu": target_dasar_minggu,
        "kalori_terbakar_minggu": total_terbakar_minggu,
        "target_disesuaikan_minggu": target_disesuaikan_minggu,
        "total_masuk_minggu": total_masuk_minggu,
        "status": status,
        "breakdown_harian": breakdown,
    })


@app.route('/api/ping')
def ping():
    return jsonify({"status": "ok"})


@app.route('/api/anak', methods=['POST'])
def buat_anak():
    data = request.json
    anak = Anak(
        nama=data['nama'],
        gender=data['gender'],
        usia=data['usia'],
        tinggi_cm=data['tinggi_cm'],
        berat_kg=data['berat_kg']
    )
    db.session.add(anak)
    db.session.commit()
    return jsonify({
        "id": anak.id,
        "target_kalori_dasar": hitung_target_kalori(anak.gender, anak.usia)
    })


@app.route('/api/makanan', methods=['GET'])
def list_makanan():
    items = Makanan.query.all()
    return jsonify([{"id": m.id, "nama": m.nama, "kalori_per_porsi": m.kalori_per_porsi} for m in items])


@app.route('/api/log-makan', methods=['POST'])
def log_makan():
    data = request.json
    entry = LogMakan(
        anak_id=data['anak_id'],
        makanan_id=data['makanan_id'],
        jumlah_porsi=data.get('jumlah_porsi', 1.0)
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({"status": "tersimpan"})


@app.route('/api/log-lari', methods=['POST'])
def log_lari():
    data = request.json
    anak = Anak.query.get_or_404(data['anak_id'])
    kalori_terbakar = hitung_kalori_terbakar(
        anak.berat_kg, data['jarak_km'], data['pace_menit_per_km']
    )
    entry = LogLari(
        anak_id=anak.id,
        jarak_km=data['jarak_km'],
        pace_menit_per_km=data['pace_menit_per_km'],
        kalori_terbakar=kalori_terbakar
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({"kalori_terbakar": kalori_terbakar})


@app.route('/api/dashboard/harian', methods=['GET'])
def dashboard_harian():
    anak_id = request.args.get('anak_id', type=int)
    hari_ini = date.today()

    anak = Anak.query.get_or_404(anak_id)
    target_dasar = hitung_target_kalori(anak.gender, anak.usia)

    logs_makan = LogMakan.query.filter_by(anak_id=anak_id, tanggal=hari_ini).all()
    total_masuk = sum(l.makanan.kalori_per_porsi * l.jumlah_porsi for l in logs_makan)

    logs_lari = LogLari.query.filter_by(anak_id=anak_id, tanggal=hari_ini).all()
    total_terbakar = sum(l.kalori_terbakar for l in logs_lari)

    target_disesuaikan = target_dasar + total_terbakar

    if total_masuk < target_disesuaikan * 0.9:
        status = "kurang"
    elif total_masuk > target_disesuaikan * 1.1:
        status = "lebih"
    else:
        status = "pas"

    return jsonify({
        "target_dasar": target_dasar,
        "kalori_terbakar_olahraga": total_terbakar,
        "target_disesuaikan": target_disesuaikan,
        "total_masuk": total_masuk,
        "status": status
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)