import { useEffect, useMemo, useState } from "react";
import { Search, History } from "lucide-react";
import { getAssetHistory } from "../api/replacementApi.js";

const ACTION = {
  REQUEST: { label: "Pengajuan", cls: "rr-status-pending" },
  APPROVE: { label: "Disetujui", cls: "rr-status-approved" },
  REJECT: { label: "Ditolak", cls: "rr-status-rejected" },
  CANCEL: { label: "Dibatalkan", cls: "rr-status-cancelled" },
};

const errMessage = (err, fallback) => err.response?.data?.message || err.message || fallback;

export default function AssetHistoryPage() {
  const isAdmin = (sessionStorage.getItem("role") || "").trim().toLowerCase() === "admin";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAssetHistory();
        if (res.success) setRows(res.data || []);
        else setError(res.message || "Gagal mengambil riwayat aset");
      } catch (err) {
        setError(errMessage(err, "Gagal mengambil riwayat aset"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (actionFilter !== "all" && r.action_type !== actionFilter) return false;
      if (!q) return true;
      return [r.device_name, r.description, r.action_by, r.requested_by]
        .some((v) => String(v || "").toLowerCase().includes(q));
    });
  }, [rows, search, actionFilter]);

  const count = (a) => rows.filter((r) => r.action_type === a).length;

  return (
    <div className="page-wrapper rr-page">
      <div className="page-container">
        {error && <div className="alert alert-error rr-alert">{error}</div>}

        <section className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Asset History</h2>
              <p className="card-description">
                {isAdmin
                  ? "Riwayat seluruh aktivitas penggantian device dan perubahan stok."
                  : "Riwayat aktivitas dari pengajuan penggantian device Anda."}
              </p>
            </div>
            <div className="rr-total">
              <History size={16} />
              <span>{filtered.length} Aktivitas</span>
            </div>
          </div>

          <div className="rr-toolbar">
            <div className="rr-search">
              <Search size={18} className="rr-search-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Cari device, keterangan, user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="rr-toolbar-actions">
              <select
                className="form-control rr-filter"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="all">Semua Aksi ({rows.length})</option>
                <option value="REQUEST">Pengajuan ({count("REQUEST")})</option>
                <option value="APPROVE">Disetujui ({count("APPROVE")})</option>
                <option value="REJECT">Ditolak ({count("REJECT")})</option>
                <option value="CANCEL">Dibatalkan ({count("CANCEL")})</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                  <th>Device</th>
                  <th>Keterangan</th>
                  <th>Jumlah</th>
                  <th>Stok OPOQ</th>
                  <th>Oleh</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="rr-table-message">Loading riwayat...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="rr-table-message">
                      <div className="empty-state">
                        <History size={32} />
                        <h3>Belum ada riwayat</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, index) => {
                    const act = ACTION[r.action_type] || { label: r.action_type, cls: "rr-status-cancelled" };
                    return (
                      <tr key={r.history_id}>
                        <td><span className="rr-no">{index + 1}</span></td>
                        <td>{r.action_date}</td>
                        <td><span className={`rr-status ${act.cls}`}>{act.label}</span></td>
                        <td><span className="rr-name">{r.device_name}</span></td>
                        <td className="rr-reason">{r.description}</td>
                        <td>{r.quantity ?? <span className="rr-muted">-</span>}</td>
                        <td>
                          {r.stock_before !== null && r.stock_before !== undefined
                            ? `${r.stock_before} → ${r.stock_after}`
                            : <span className="rr-muted">-</span>}
                        </td>
                        <td>{r.action_by}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="rr-table-footer">
            <span>Showing {filtered.length} of {rows.length} aktivitas</span>
          </div>
        </section>
      </div>
    </div>
  );
}