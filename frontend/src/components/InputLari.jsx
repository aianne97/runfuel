import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function InputLari({ anakId, onTersimpan }) {
  const [jarakKm, setJarakKm] = useState("");
  const [pace, setPace] = useState("");
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");
    if (!jarakKm || !pace) {
      setPesan("Isi jarak dan pace dulu.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/log-lari`, {
        anak_id: anakId,
        jarak_km: Number(jarakKm),
        pace_menit_per_km: Number(pace),
      });
      setPesan(`Tersimpan: ${jarakKm} km, pace ${pace} min/km → ${res.data.kalori_terbakar} kkal terbakar`);
      onTersimpan();
    } catch (err) {
      setPesan("Gagal simpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-accent-run">
      <h2 className="headline" style={{ fontSize: "1.1rem" }}>Input Sesi Lari</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Jarak (km)</label>
          <input type="number" step="0.1" value={jarakKm} onChange={(e) => setJarakKm(e.target.value)} placeholder="5" />
        </div>
        <div className="field">
          <label>Pace (menit/km)</label>
          <input type="number" step="0.1" value={pace} onChange={(e) => setPace(e.target.value)} placeholder="7" />
        </div>
        {pesan && (
          <p className={`message ${pesan.startsWith("Gagal") || pesan.startsWith("Isi") ? "error" : "success"}`}>{pesan}</p>
        )}
        <button type="submit" className="btn btn-run" disabled={loading}>
          {loading ? "Menghitung..." : "Simpan Sesi Lari"}
        </button>
      </form>
    </div>
  );
}

export default InputLari;