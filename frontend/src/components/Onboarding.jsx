import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Onboarding({ onSelesai }) {
  const [form, setForm] = useState({ nama: "", gender: "laki-laki", usia: "", tinggi_cm: "", berat_kg: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nama || !form.usia || !form.tinggi_cm || !form.berat_kg) {
      setError("Semua field wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/anak`, {
        nama: form.nama,
        gender: form.gender,
        usia: Number(form.usia),
        tinggi_cm: Number(form.tinggi_cm),
        berat_kg: Number(form.berat_kg),
      });
      onSelesai(res.data.id, res.data.target_kalori_dasar);
    } catch (err) {
      setError("Gagal simpan data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="section" style={{ paddingTop: "3rem" }}>
        <div className="wordmark" style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>
          RUN<span>FUEL</span>
        </div>
        <p className="subtext">Bahan bakar yang pas buat pelari kecil kamu — nggak kurang, nggak berlebihan.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nama Anak</label>
            <input type="text" value={form.nama} onChange={(e) => handleChange("nama", e.target.value)} />
          </div>

          <div className="field">
            <label>Jenis Kelamin</label>
            <div className="toggle-group">
              <button type="button" className={`toggle-btn ${form.gender === "laki-laki" ? "active" : ""}`} onClick={() => handleChange("gender", "laki-laki")}>Laki-laki</button>
              <button type="button" className={`toggle-btn ${form.gender === "perempuan" ? "active" : ""}`} onClick={() => handleChange("gender", "perempuan")}>Perempuan</button>
            </div>
          </div>

          <div className="field">
            <label>Usia (tahun)</label>
            <input type="number" value={form.usia} onChange={(e) => handleChange("usia", e.target.value)} placeholder="11" />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Tinggi (cm)</label>
              <input type="number" value={form.tinggi_cm} onChange={(e) => handleChange("tinggi_cm", e.target.value)} placeholder="138" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Berat (kg)</label>
              <input type="number" value={form.berat_kg} onChange={(e) => handleChange("berat_kg", e.target.value)} placeholder="32" />
            </div>
          </div>

          {error && <p className="message error">{error}</p>}

          <button type="submit" className="btn btn-fuel" disabled={loading}>
            {loading ? "Menyimpan..." : "Mulai"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;