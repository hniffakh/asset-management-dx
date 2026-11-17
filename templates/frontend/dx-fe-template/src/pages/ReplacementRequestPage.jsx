import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X, Check, Ban, ArrowLeftRight } from "lucide-react";
import {
  getReplacementOptions,
  getReplacements,
  createReplacement,
  approveReplacement,
  rejectReplacement,
  cancelReplacement,
} from "../api/replacementApi.js";

const STATUS = {
  PENDING: { label: "Pending", cls: "rr-status-pending" },
  APPROVED: { label: "Disetujui", cls: "rr-status-approved" },
  REJECTED: { label: "Ditolak", cls: "rr-status-rejected" },
  CANCELLED: { label: "Dibatalkan", cls: "rr-status-cancelled" },
};

const EMPTY_FORM = { device_id: "", line_code: "", old_asset_info: "", quantity: 1, reason: "" };

const errMessage = (err, fallback) => err.response?.data?.message || err.message || fallback;

export default function ReplacementRequestPage() {
  const role = (sessionStorage.getItem("role") || "").trim().toLowerCase();
  const username = (sessionStorage.getItem("username") || "").trim();
  const isAdmin = role === "admin";

  const [rows, setRows] = useState([]);
  const [options, setOptions] = useState({ devices: [], lines: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [review, setReview] = useState(null); // { row, action: "approve" | "reject" }
  const [reviewNote, setReviewNote] = useState("");
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getReplacements();
      if (res.success) setRows(res.data || []);
      else setError(res.message || "Gagal mengambil data pengajuan");
    } catch (err) {
      setError(errMessage(err, "Gagal mengambil data pengajuan"));
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const res = await getReplacementOptions();
      if (res.success) setOptions(res.data);
    } catch (err) {
      setError(errMessage(err, "Gagal mengambil daftar device dan line"));
    }
  };

  useEffect(() => {
    load();
    loadOptions();
  }, []);

  const summary = useMemo(() => {
    const count = (s) => rows.filter((r) => r.status === s).length;
    return {
      all: rows.length,
      PENDING: count("PENDING"),
      APPROVED: count("APPROVED"),
      REJECTED: count("REJECTED"),
      CANCELLED: count("CANCELLED"),
    };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.device_name, r.line_name, r.line_code, r.reason, r.requested_by, r.old_asset_info]
        .some((v) => String(v || "").toLowerCase().includes(q));
    });
  }, [rows, search, statusFilter]);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModalError("");
    setShowCreate(true);
  };

  const closeModals = () => {
    if (saving) return;
    setShowCreate(false);
    setReview(null);
    setReviewNote("");
    setModalError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const qty = Number(form.quantity);

    if (!form.device_id) return setModalError("Device wajib dipilih");
    if (!Number.isInteger(qty) || qty < 1) return setModalError("Jumlah minimal 1");
    if (form.reason.trim().length < 5) return setModalError("Alasan minimal 5 karakter");

    setSaving(true);
    setModalError("");
    try {
      await createReplacement({
        device_id: Number(form.device_id),
        line_code: form.line_code || null,
        old_asset_info: form.old_asset_info.trim() || null,
        quantity: qty,
        reason: form.reason.trim(),
      });
      setShowCreate(false);
      flash("Pengajuan berhasil dikirim dan menunggu persetujuan admin.");
      await load();
    } catch (err) {
      setModalError(errMessage(err, "Gagal mengirim pengajuan"));
    } finally {
      setSaving(false);
    }
  };

  const openReview = (row, action) => {
    setReview({ row, action });
    setReviewNote("");
    setModalError("");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    const { row, action } = review;
    const note = reviewNote.trim();

    if (action === "reject" && note.length < 3) {
      return setModalError("Alasan penolakan wajib diisi (minimal 3 karakter)");
    }

    setSaving(true);
    setModalError("");
    try {
      if (action === "approve") {
        await approveReplacement(row.request_id, { review_note: note || null });
      } else {
        await rejectReplacement(row.request_id, { review_note: note });
      }
      setReview(null);
      flash(action === "approve" ? "Pengajuan disetujui. Stok di OPOQ sudah dikurangi." : "Pengajuan ditolak.");
      await load();
    } catch (err) {
      setModalError(errMessage(err, "Gagal memproses pengajuan"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (row) => {
    if (!window.confirm(`Batalkan pengajuan ${row.device_name} (${row.quantity} unit)?`)) return;
    setError("");
    try {
      await cancelReplacement(row.request_id);
      flash("Pengajuan dibatalkan.");
      await load();
    } catch (err) {
      setError(errMessage(err, "Gagal membatalkan pengajuan"));
    }
  };

  const colCount = isAdmin ? 9 : 8;

  // Info stok untuk modal persetujuan
  const reviewRow = review?.row;
  const stockNow = Number(reviewRow?.current_stock) || 0;
  const stockAfter = stockNow - (Number(reviewRow?.quantity) || 0);
  const stockProblem =
    review?.action === "approve" &&
    (!Number(reviewRow?.has_opoq)
      ? "Stok device ini belum diatur di halaman OPOQ."
      : stockAfter < 0
        ? `Stok tidak cukup (tersedia ${stockNow}, diminta ${reviewRow.quantity}).`
        : "");

  return (
    <div className="page-wrapper rr-page">
      <div className="page-container">
        {error && <div className="alert alert-error rr-alert">{error}</div>}
        {notice && <div className="alert alert-success rr-alert">{notice}</div>}

        {/* RINGKASAN */}
        <div className="rr-stats">
          <div className="card rr-stat">
            <span className="rr-stat-label">Menunggu Persetujuan</span>
            <span className="rr-stat-value rr-text-pending">{summary.PENDING}</span>
          </div>
          <div className="card rr-stat">
            <span className="rr-stat-label">Disetujui</span>
            <span className="rr-stat-value rr-text-approved">{summary.APPROVED}</span>
          </div>
          <div className="card rr-stat">
            <span className="rr-stat-label">Ditolak</span>
            <span className="rr-stat-value rr-text-rejected">{summary.REJECTED}</span>
          </div>
          <div className="card rr-stat">
            <span className="rr-stat-label">Dibatalkan</span>
            <span className="rr-stat-value rr-text-cancelled">{summary.CANCELLED}</span>
          </div>
        </div>

        <section className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Replacement Request</h2>
              <p className="card-description">
                {isAdmin
                  ? "Tinjau dan setujui pengajuan penggantian device dari user."
                  : "Ajukan penggantian device dan pantau status pengajuan Anda."}
              </p>
            </div>
            <div className="rr-total">
              <span className={`rr-role-badge ${isAdmin ? "rr-role-admin" : ""}`}>
                {isAdmin ? "Admin" : "User"}
              </span>
              <ArrowLeftRight size={16} />
              <span>{filtered.length} Pengajuan</span>
            </div>
          </div>

          <div className="rr-toolbar">
            <div className="rr-search">
              <Search size={18} className="rr-search-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Cari device, line, alasan, pemohon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="rr-toolbar-actions">
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <Plus size={18} />
                Ajukan Penggantian
              </button>
              <select
                className="form-control rr-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua ({summary.all})</option>
                <option value="PENDING">Pending ({summary.PENDING})</option>
                <option value="APPROVED">Disetujui ({summary.APPROVED})</option>
                <option value="REJECTED">Ditolak ({summary.REJECTED})</option>
                <option value="CANCELLED">Dibatalkan ({summary.CANCELLED})</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Device</th>
                  <th>Line</th>
                  <th>Jumlah</th>
                  <th>Alasan</th>
                  {isAdmin && <th>Pemohon</th>}
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={colCount} className="rr-table-message">Loading pengajuan...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} className="rr-table-message">
                      <div className="empty-state">
                        <ArrowLeftRight size={32} />
                        <h3>Belum ada pengajuan</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, index) => {
                    const st = STATUS[r.status] || STATUS.PENDING;
                    const isOwner = String(r.requested_by || "").trim() === username;
                    const isPending = r.status === "PENDING";

                    return (
                      <tr key={r.request_id}>
                        <td><span className="rr-no">{index + 1}</span></td>
                        <td>
                          {r.request_date}
                          <div className="rr-sub">#{r.request_id}</div>
                        </td>
                        <td>
                          <span className="rr-name">{r.device_name}</span>
                          {r.old_asset_info && <div className="rr-sub">Aset lama: {r.old_asset_info}</div>}
                        </td>
                        <td>{r.line_name || r.line_code || <span className="rr-muted">-</span>}</td>
                        <td>{r.quantity}</td>
                        <td className="rr-reason">{r.reason}</td>
                        {isAdmin && <td>{r.requested_by}</td>}
                        <td>
                          <span className={`rr-status ${st.cls}`}>{st.label}</span>
                          {r.reviewed_by && !isPending && (
                            <div className="rr-sub">
                              oleh {r.reviewed_by}, {r.review_date}
                            </div>
                          )}
                          {r.review_note && <div className="rr-sub">Catatan: {r.review_note}</div>}
                        </td>
                        <td>
                          {isPending && (isAdmin || isOwner) ? (
                            <div className="table-actions">
                              {isAdmin && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-icon rr-action-approve"
                                    onClick={() => openReview(r, "approve")}
                                    title="Setujui"
                                    aria-label="Setujui"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-icon rr-action-reject"
                                    onClick={() => openReview(r, "reject")}
                                    title="Tolak"
                                    aria-label="Tolak"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                              {isOwner && (
                                <button
                                  type="button"
                                  className="btn-icon rr-action-cancel"
                                  onClick={() => handleCancel(r)}
                                  title="Batalkan pengajuan"
                                  aria-label="Batalkan pengajuan"
                                >
                                  <Ban size={16} />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="rr-muted">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="rr-table-footer">
            <span>Showing {filtered.length} of {rows.length} pengajuan</span>
          </div>
        </section>
      </div>

      {/* MODAL: BUAT PENGAJUAN */}
      {showCreate && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal rr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Ajukan Penggantian Device</h2>
                <p className="rr-modal-description">Pengajuan akan ditinjau oleh admin.</p>
              </div>
              <button type="button" className="btn-icon" onClick={closeModals} disabled={saving} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="modal-body">
                {modalError && <div className="alert alert-error">{modalError}</div>}

                <div className="form-group">
                  <label htmlFor="rr_device">Device yang diganti</label>
                  <select
                    id="rr_device"
                    className="form-control"
                    value={form.device_id}
                    onChange={(e) => setForm({ ...form, device_id: e.target.value })}
                    required
                  >
                    <option value="">-- Pilih device --</option>
                    {options.devices.map((d) => (
                      <option key={d.device_id} value={d.device_id}>{d.device_name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rr_line">Line / Lokasi (opsional)</label>
                  <select
                    id="rr_line"
                    className="form-control"
                    value={form.line_code}
                    onChange={(e) => setForm({ ...form, line_code: e.target.value })}
                  >
                    <option value="">-- Pilih line --</option>
                    {options.lines.map((l) => (
                      <option key={l.line_code} value={l.line_code}>
                        {l.line_name} ({l.line_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rr_old">Info aset lama (opsional)</label>
                  <input
                    id="rr_old"
                    type="text"
                    className="form-control"
                    maxLength={100}
                    placeholder="Contoh: kode aset / serial number"
                    value={form.old_asset_info}
                    onChange={(e) => setForm({ ...form, old_asset_info: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rr_qty">Jumlah</label>
                  <input
                    id="rr_qty"
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    className="form-control"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rr_reason">Alasan penggantian</label>
                  <textarea
                    id="rr_reason"
                    className="form-control"
                    rows={3}
                    maxLength={500}
                    placeholder="Contoh: layar monitor bergaris dan tidak bisa dipakai"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Mengirim..." : "Kirim Pengajuan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SETUJUI / TOLAK (ADMIN) */}
      {review && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal rr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {review.action === "approve" ? "Setujui Pengajuan" : "Tolak Pengajuan"} #{reviewRow.request_id}
                </h2>
                <p className="rr-modal-description">
                  {review.action === "approve"
                    ? "Stok device di OPOQ akan dikurangi sesuai jumlah pengajuan."
                    : "Pemohon akan melihat alasan penolakan ini."}
                </p>
              </div>
              <button type="button" className="btn-icon" onClick={closeModals} disabled={saving} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReview}>
              <div className="modal-body">
                {modalError && <div className="alert alert-error">{modalError}</div>}

                <dl className="rr-detail">
                  <dt>Pemohon</dt>
                  <dd>{reviewRow.requested_by}</dd>
                  <dt>Device</dt>
                  <dd>{reviewRow.device_name}</dd>
                  <dt>Line</dt>
                  <dd>{reviewRow.line_name || reviewRow.line_code || "-"}</dd>
                  <dt>Jumlah</dt>
                  <dd>{reviewRow.quantity} unit</dd>
                  <dt>Alasan</dt>
                  <dd>{reviewRow.reason}</dd>
                  {review.action === "approve" && (
                    <>
                      <dt>Stok OPOQ</dt>
                      <dd>
                        {Number(reviewRow.has_opoq) ? `${stockNow} → ${Math.max(stockAfter, 0)}` : "-"}
                      </dd>
                    </>
                  )}
                </dl>

                {stockProblem && <div className="alert alert-warning">{stockProblem}</div>}

                <div className="form-group">
                  <label htmlFor="rr_note">
                    {review.action === "approve" ? "Catatan (opsional)" : "Alasan penolakan"}
                  </label>
                  <textarea
                    id="rr_note"
                    className="form-control"
                    rows={3}
                    maxLength={500}
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    required={review.action === "reject"}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals} disabled={saving}>
                  Cancel
                </button>
                {review.action === "approve" ? (
                  <button type="submit" className="btn btn-success" disabled={saving || Boolean(stockProblem)}>
                    {saving ? "Memproses..." : "Setujui"}
                  </button>
                ) : (
                  <button type="submit" className="btn btn-danger" disabled={saving}>
                    {saving ? "Memproses..." : "Tolak"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}