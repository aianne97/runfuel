import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
const STATUS_COLOR = { kurang: "var(--status-kurang)", pas: "var(--status-pas)", lebih: "var(--status-lebih)" };
const STATUS_LABEL = { kurang: "Kurang", pas: "Pas", lebih: "Lebih" };

function WeeklyProgress({ anakId, refreshKey }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/dashboard/mingguan`, { params: { anak_id: anakId } })
      .then((res) => setData(res.data))
      .catch((err) => setError("Gagal ambil target mingguan: " + err.message));
  }, [anakId, refreshKey]);

  if (error) return <p className="message error">{error}</p>;
  if (!data) return null;

  const warna = STATUS_COLOR[data.status];
  const maxHarian = Math.max(...data.breakdown_harian.map((h) => h.masuk), 1);

  return (
    <div className="card card-accent-run">
      <h2 className="headline" style={{ fontSize: "1.1rem" }}>Minggu Ini</h2>

      <div className="stat-row">
        <span>{data.total_masuk_minggu} kkal masuk</span>
        <span>dari {data.target_disesuaikan_minggu} kkal</span>
      </div>

      <div className="week-bars">
        {data.breakdown_harian.map((h) => (
          <div className="week-bar-col" key={h.tanggal}>
            <div className="week-bar" style={{ height: `${Math.max(4, (h.masuk / maxHarian) * 100)}%` }} />
            <span className="week-bar-label">{h.hari}</span>
          </div>
        ))}
      </div>

      <span className="status-pill" style={{ background: warna + "22", color: warna }}>
        Status Minggu: {STATUS_LABEL[data.status]}
      </span>
    </div>
  );
}

export default WeeklyProgress;