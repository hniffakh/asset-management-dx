import { useEffect, useMemo, useState } from "react";
import { Pencil, RotateCcw, Search, X, Layers, Flag } from "lucide-react";
import { getOpoqApi, updateOpoqApi, deleteOpoqApi } from "../api/opoqApi";

const EMPTY_FORM = {
  current_stock: 0,
  order_point: 0,
  order_qty: 0,
  force_urgent: false,
  remarks: "",
};

const RANK = { buy: 0, ok: 1, unset: 2 };
const LABEL = { buy: "Segera Beli", ok: "Aman", unset: "Belum Diatur" };

const errMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

const isTrue = (v) => v === true || v === 1 || v === "1" || v === "true";

const getInfo = (r) => {
  const left = Number(r.current_stock) || 0;
  const op = Number(r.order_point) || 0;
  const oq = Number(r.order_qty) || 0;
  const forced = isTrue(r.force_urgent);

  let level;
  if (op === 0 && oq === 0 && !forced) level = "unset";
  else if (forced || left <= op) level = "buy";
  else level = "ok";

  return { left, op, oq, forced, level, shortage: Math.max(0, op - left) };
};

export default function OpoqPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getOpoqApi();
      const body = res && res.success !== undefined ? res : res?.data;
      if (body?.success) setRows(Array.isArray(body.data) ? body.data : []);
      else setError(body?.message || "Gagal mengambil data OPOQ");
    } catch (err) {
      setError(errMessage(err, "Gagal mengambil data OPOQ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(() => {
    const infos = rows.map(getInfo);
    const count = (lv) => infos.filter((s) => s.level === lv).length;
    return {
      all: rows.length,
      buy: count("buy"),
      ok: count("ok"),
      unset: count("unset"),
      totalToOrder: infos
        .filter((s) => s.level === "buy")
        .reduce((a, s) => a + s.oq, 0),
    };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (!(r.device_name || "").toLowerCase().includes(q)) return false;
        return filter === "all" || getInfo(r).level === filter;
      })
      .sort((a, b) => {
        const ia = getInfo(a);
        const ib = getInfo(b);
        if (RANK[ia.level] !== RANK[ib.level]) return RANK[ia.level] - RANK[ib.level];
        if (ia.left !== ib.left) return ia.left - ib.left;
        return (a.device_name || "").localeCompare(b.device_name || "");
      });
  }, [rows, search, filter]);

  const handleEdit = (r) => {
    setError("");
    setEditing(r);
    setForm({
      current_stock: Number(r.current_stock) || 0,
      order_point: Number(r.order_point) || 0,
      order_qty: Number(r.order_qty) || 0,
      force_urgent: isTrue(r.force_urgent),
      remarks: r.remarks || "",
    });
    setShowModal(true);
  };

  const handleClose = () => {
    if (saving) return;
    setShowModal(false);
    setEditing(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) return;

    const stock = Number(form.current_stock);
    const op = Number(form.order_point);
    const oq = Number(form.order_qty);

    if ([stock, op, oq].some((n) => !Number.isInteger(n) || n < 0)) {
      setError("Stok, Order Point, dan Order Quantity harus angka bulat 0 atau lebih");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await updateOpoqApi(editing.device_id, {
        current_stock: stock,
        order_point: op,
        order_qty: oq,
        force_urgent: 0,
        remarks: form.remarks.trim() || null,
      });
      setShowModal(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(errMessage(err, "Gagal menyimpan data OPOQ"));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (r) => {
    if (
      !window.confirm(
        `Reset pengaturan OPOQ untuk "${r.device_name}"?\nStatus device akan kembali menjadi "Belum Diatur".`
      )
    )
      return;

    setError("");
    try {
      await deleteOpoqApi(r.device_id);
      await load();
    } catch (err) {
      setError(errMessage(err, "Gagal mereset data OPOQ"));
    }
  };

  const setNum = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const preview = getInfo(form);
  const statusClass = (lv) => `opoq-status opoq-status-${lv === "ok" ? "safe" : lv}`;

  return (
    <div className="page-wrapper opoq-page">
      <div className="page-container">
        {error && !showModal && <div className="alert alert-error opoq-alert">{error}</div>}

        <div className="opoq-stats">
          <div className="card opoq-stat">
            <span className="opoq-stat-label">Device Segera Dibeli</span>
            <span className={"opoq-stat-value" + (summary.buy > 0 ? " opoq-stat-danger" : "")}>
              {summary.buy}
            </span>
          </div>
          <div className="card opoq-stat">
            <span className="opoq-stat-label">Total Unit yang Harus Dibeli</span>
            <span className="opoq-stat-value">{summary.totalToOrder}</span>
          </div>
          <div className="card opoq-stat">
            <span className="opoq-stat-label">Device Aman</span>
            <span className="opoq-stat-value opoq-stat-safe">{summary.ok}</span>
          </div>
          <div className="card opoq-stat">
            <span className="opoq-stat-label">Belum Diatur</span>
            <span className="opoq-stat-value opoq-stat-unset">{summary.unset}</span>
          </div>
        </div>

        <section className="card opoq-card">
          <div className="card-header opoq-card-header">
            <div>
              <h2 className="card-title">OPOQ Management</h2>
              <p className="card-description">
                Atur stok, Order Point, dan Order Quantity setiap device untuk
                mengetahui device mana yang harus segera dibeli.
              </p>
            </div>
            <div className="opoq-total">
              <Layers size={16} />
              <span>{filtered.length} Devices</span>
            </div>
          </div>

          <div className="opoq-toolbar">
            <div className="opoq-search">
              <Search size={18} className="opoq-search-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Cari nama device..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="opoq-toolbar-actions">
              <select
                className="form-control opoq-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Semua ({summary.all})</option>
                <option value="buy">Segera Beli ({summary.buy})</option>
                <option value="ok">Aman ({summary.ok})</option>
                <option value="unset">Belum Diatur ({summary.unset})</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper opoq-table-wrapper">
            <table className="table opoq-table">
              <thead>
                <tr>
                  <th className="opoq-id-column">ID</th>
                  <th>Nama Device</th>
                  <th>Stok Saat Ini</th>
                  <th>Order Point</th>
                  <th>Order Quantity</th>
                  <th>Status</th>
                  <th className="opoq-action-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="opoq-table-message">Loading OPOQ...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="opoq-table-message">
                      <div className="empty-state">
                        <Layers size={32} />
                        <h3>Tidak ada data OPOQ</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const s = getInfo(r);
                    const unset = s.level === "unset";
                    const dash = <span className="opoq-muted">-</span>;

                    return (
                      <tr key={r.device_id} className={s.level === "buy" ? "opoq-row-urgent" : ""}>
                        <td><span className="opoq-id">{r.device_id}</span></td>
                        <td>
                          <span className="opoq-name">{r.device_name}</span>
                          {r.remarks && <div className="opoq-sub">{r.remarks}</div>}
                        </td>
                        <td>
                          {unset ? dash : (
                            <span className={`opoq-stock ${s.level === "buy" ? "opoq-stock-low" : "opoq-stock-ok"}`}>
                              {s.left}
                            </span>
                          )}
                        </td>
                        <td>{unset ? dash : s.op}</td>
                        <td>{unset ? dash : s.oq}</td>
                                                <td>
                          <div className="opoq-status-wrap">
                            <span className={statusClass(s.level)}>{LABEL[s.level]}</span>
                            {s.forced && (
                              <span className="opoq-flag" title="Ditandai Segera Beli secara manual">
                                <Flag size={12} />
                                Manual
                              </span>
                            )}
                          </div>
                          {s.level === "buy" && (
                            <div className="opoq-sub opoq-sub-danger">
                              {s.left <= s.op
                                ? s.shortage > 0
                                  ? `Kurang ${s.shortage} unit`
                                  : "Stok di batas minimum"
                                : "Ditandai manual"}
                              {s.oq > 0 ? ` · beli ${s.oq} unit` : ""}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn-icon opoq-action-edit"
                              onClick={() => handleEdit(r)}
                              title="Atur OPOQ"
                              aria-label="Atur OPOQ"
                            >
                              <Pencil size={16} />
                            </button>
                            {!unset && (
                              <button
                                type="button"
                                className="btn-icon opoq-action-delete"
                                onClick={() => handleReset(r)}
                                title="Reset OPOQ"
                                aria-label="Reset OPOQ"
                              >
                                <RotateCcw size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="opoq-table-footer">
            <span>Showing {filtered.length} of {rows.length} devices</span>
          </div>
        </section>
      </div>

      {showModal && editing && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal opoq-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Atur OPOQ</h2>
                <p className="opoq-modal-description">
                  Device: <strong>{editing.device_name}</strong>
                </p>
              </div>
              <button type="button" className="btn-icon" onClick={handleClose} disabled={saving} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error opoq-modal-alert">{error}</div>}

                <div className="form-group">
                  <label htmlFor="current_stock">Stok Saat Ini</label>
                  <input id="current_stock" type="number" min={0} step={1} className="form-control"
                    value={form.current_stock} onChange={setNum("current_stock")} required />
                </div>

                <div className="form-group">
                  <label htmlFor="order_point">Order Point (OP)</label>
                  <input id="order_point" type="number" min={0} step={1} className="form-control"
                    value={form.order_point} onChange={setNum("order_point")} required />
                  <span className="form-hint">
                    Batas minimum stok. Jika stok kurang dari atau sama dengan Order Point, status menjadi Segera Beli.
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="order_qty">Order Quantity (OQ)</label>
                  <input id="order_qty" type="number" min={0} step={1} className="form-control"
                    value={form.order_qty} onChange={setNum("order_qty")} required />
                  <span className="form-hint">Jumlah unit yang dibeli saat stok mencapai Order Point.</span>
                </div>

              

                <div className="form-group">
                  <label htmlFor="remarks">Catatan (opsional)</label>
                  <textarea id="remarks" className="form-control" rows={2} maxLength={500}
                    value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    placeholder="Contoh: 2 unit rusak, menunggu approval" />
                </div>

                <div className="opoq-preview">
                  <span>Status setelah disimpan:</span>
                  <span className={statusClass(preview.level)}>{LABEL[preview.level]}</span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}