import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function InputMakanan({ anakId, onTersimpan }) {
  const [daftarMakanan, setDaftarMakanan] = useState([]);
  const [makananId, setMakananId] = useState("");
  const [jumlahPorsi, setJumlahPorsi] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/makanan`)
      .then((res) => {
        setDaftarMakanan(res.data);
        if (res.data.length > 0) setMakananId(res.data[0].id);
      })
      .catch((err) => setPesan("Gagal ambil daftar makanan: " + err.message));
  }, []);

  const makananTerpilih = daftarMakanan.find((m) => m.id === Number(makananId));
  const estimasiKalori = makananTerpilih ? makananTerpilih.kalori_per_porsi * jumlahPorsi : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");
    try {
      await axios.post(`${API_URL}/log-makan`, {
        anak_id: anakId,
        makanan_id: Number(makananId),
        jumlah_porsi: Number(jumlahPorsi),
      });
      setPesan(`Tersimpan: ${makananTerpilih.nama} x${jumlahPorsi} = ${estimasiKalori} kkal`);
      onTersimpan();
    } catch (err) {
      setPesan("Gagal simpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-accent-fuel">
      <h2 className="headline" style={{ fontSize: "1.1rem" }}>Input Makanan</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Pilih Makanan</label>
          <select value={makananId} onChange={(e) => setMakananId(e.target.value)}>
            {daftarMakanan.map((m) => (
              <option key={m.id} value={m.id}>{m.nama} ({m.kalori_per_porsi} kkal/porsi)</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Jumlah Porsi</label>
          <input type="number" min="0.5" step="0.5" value={jumlahPorsi} onChange={(e) => setJumlahPorsi(e.target.value)} />
        </div>
        <p className="subtext" style={{ marginBottom: "0.75rem" }}>
          Estimasi: <strong style={{ color: "var(--text)" }}>{estimasiKalori} kkal</strong>
        </p>
        {pesan && <p className={`message ${pesan.startsWith("Gagal") ? "error" : "success"}`}>{pesan}</p>}
        <button type="submit" className="btn btn-fuel" disabled={loading || !makananId}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}

export default InputMakanan;