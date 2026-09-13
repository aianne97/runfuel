import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
const STATUS_COLOR = { kurang: "var(--status-kurang)", pas: "var(--status-pas)", lebih: "var(--status-lebih)" };
const STATUS_LABEL = { kurang: "Kurang", pas: "Pas", lebih: "Lebih" };

function Dashboard({ anakId, refreshKey }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/dashboard/harian`, { params: { anak_id: anakId } })
      .then((res) => setData(res.data))
      .catch((err) => setError("Gagal ambil dashboard: " + err.message));
  }, [anakId, refreshKey]);

  if (error) return <p className="message error">{error}</p>;
  if (!data) return <p className="subtext">Memuat dashboard...</p>;

  const persentase = Math.min(100, Math.round((data.total_masuk / data.target_disesuaikan) * 100));
  const warna = STATUS_COLOR[data.status];

  return (
    <div className="card card-accent-fuel">
      <h2 className="headline" style={{ fontSize: "1.2rem" }}>Hari Ini</h2>

      <div className="stat-row">
        <span>{data.total_masuk} kkal masuk</span>
        <span>dari {data.target_disesuaikan} kkal</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${persentase}%`, background: warna }} />
      </div>

      <div style={{ margin: "1rem 0" }}>
        <span className="status-pill" style={{ background: warna + "22", color: warna }}>Status: {STATUS_LABEL[data.status]}</span>
      </div>

      <div className="stat-row"><span>Target dasar (AKG)</span><span>{data.target_dasar} kkal</span></div>
      <div className="stat-row"><span>+ Terbakar olahraga</span><span>{data.kalori_terbakar_olahraga} kkal</span></div>
      <div className="stat-row total"><span>Target disesuaikan</span><span>{data.target_disesuaikan} kkal</span></div>
    </div>
  );
}

export default Dashboard;