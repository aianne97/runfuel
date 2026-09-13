import { useState, useEffect } from "react";
import axios from "axios";
import Onboarding from "./components/Onboarding";
import InputMakanan from "./components/InputMakanan";
import InputLari from "./components/InputLari";
import Dashboard from "./components/Dashboard";
import WeeklyProgress from "./components/WeeklyProgress";

const API_URL = "http://localhost:5000/api";

function App() {
  const [status, setStatus] = useState("checking...");
  const [anakId, setAnakId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    axios.get(`${API_URL}/ping`)
      .then((res) => setStatus(res.data.status))
      .catch((err) => setStatus("gagal konek: " + err.message));
  }, []);

  const handleOnboardingSelesai = (id) => setAnakId(id);
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  if (!anakId) {
    return <Onboarding onSelesai={handleOnboardingSelesai} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="wordmark">RUN<span>FUEL</span></div>
      </header>

      {status !== "ok" && (
        <p style={{ color: "#E63958", fontSize: "0.8rem", padding: "0 1.5rem" }}>Backend: {status}</p>
      )}

      <div className="section">
        <Dashboard anakId={anakId} refreshKey={refreshKey} />
        <WeeklyProgress anakId={anakId} refreshKey={refreshKey} />
        <InputMakanan anakId={anakId} onTersimpan={handleRefresh} />
        <InputLari anakId={anakId} onTersimpan={handleRefresh} />
      </div>
    </div>
  );
}

export default App;