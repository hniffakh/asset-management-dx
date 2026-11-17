
import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";

import {
  getSpecs,
  createSpec,
  updateSpec,
  deleteSpec,
} from "../api/specApi.js";

// ============================================
// SPEC PAGE
// ============================================

export default function SpecPage() {
  // STATE
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);

  const [form, setForm] = useState({
    spec_name: "",
    lifetime_start: "",
    lifetime_end: "",
    active_flag: 1,
  });

  const [saving, setSaving] = useState(false);

  // ============================================
  // FETCH SPECS
  // ============================================

  const fetchSpecs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSpecs();

      if (response.success) {
        setSpecs(response.data);
      } else {
        setError(
          response.message ||
          "Gagal mengambil data spesifikasi"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal mengambil data spesifikasi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecs();
  }, []);

  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) return "-";

    const dateValue = String(date).slice(0, 10);
    const [year, month, day] = dateValue.split("-");

    if (!year || !month || !day) return "-";

    return `${day}/${month}/${year}`;
  };

  // ============================================
  // SEARCH & FILTER
  // ============================================

  const filteredSpecs = useMemo(() => {
    return specs.filter((spec) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        String(spec.spec_id || "")
          .toLowerCase()
          .includes(keyword) ||

        String(spec.spec_name || "")
          .toLowerCase()
          .includes(keyword) ||

        String(spec.lifetime_start || "")
          .toLowerCase()
          .includes(keyword) ||

        String(spec.lifetime_end || "")
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        String(spec.active_flag) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [specs, search, statusFilter]);

  // ============================================
  // OPEN ADD MODAL
  // ============================================

  const handleAdd = () => {
    setEditingSpec(null);

    setForm({
      spec_name: "",
      lifetime_start: "",
      lifetime_end: "",
      active_flag: 1,
    });

    setError("");
    setShowModal(true);
  };

  // ============================================
  // OPEN EDIT MODAL
  // ============================================

  const handleEdit = (spec) => {
    setEditingSpec(spec);

    setForm({
      spec_name: spec.spec_name || "",
      lifetime_start: String(
        spec.lifetime_start || ""
      ).slice(0, 10),
      lifetime_end: String(
        spec.lifetime_end || ""
      ).slice(0, 10),
      active_flag: Number(spec.active_flag),
    });

    setError("");
    setShowModal(true);
  };

  // ============================================
  // HANDLE FORM INPUT
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "active_flag"
          ? Number(value)
          : value,
    }));
  };

  // ============================================
  // SAVE SPEC
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const specName = form.spec_name.trim();
    const lifetimeStart = form.lifetime_start;
    const lifetimeEnd = form.lifetime_end;

    if (!specName) {
      setError("Nama spesifikasi wajib diisi");
      return;
    }

    if (!lifetimeStart || !lifetimeEnd) {
      setError("Lifetime start dan end wajib diisi");
      return;
    }

    if (lifetimeEnd < lifetimeStart) {
      setError(
        "Lifetime end tidak boleh lebih awal dari lifetime start"
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        spec_name: specName,
        lifetime_start: lifetimeStart,
        lifetime_end: lifetimeEnd,
        active_flag: Number(form.active_flag),
      };

      if (editingSpec) {
        await updateSpec(
          editingSpec.spec_id,
          payload
        );
      } else {
        await createSpec(payload);
      }

      setShowModal(false);
      setEditingSpec(null);

      await fetchSpecs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan spesifikasi"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // DELETE / DEACTIVATE SPEC
  // ============================================

  const handleDelete = async (spec) => {
    const confirmed = window.confirm(
      `Nonaktifkan spesifikasi "${spec.spec_name}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteSpec(spec.spec_id);

      await fetchSpecs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal menonaktifkan spesifikasi"
      );
    }
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingSpec(null);
    setError("");
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page-wrapper spec-page">
      <div className="page-container">

        {/* ERROR */}
        {error && !showModal && (
          <div className="alert alert-error spec-alert">
            {error}
          </div>
        )}

        {/* SPEC CARD */}
        <div className="card spec-table-card">

          {/* CARD HEADER */}
          <div className="card-header">
            <div>
              <h3 className="card-title">
                Specification List
              </h3>

              <p className="card-description">
                Manage device specifications and lifetime settings.
              </p>
            </div>

            <div className="spec-total">
              <SlidersHorizontal size={16} />
              <span>
                {filteredSpecs.length} Specifications
              </span>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="spec-toolbar">

            {/* SEARCH */}
            <div className="spec-search">
              <Search
                size={18}
                className="spec-search-icon"
              />

              <input
                type="text"
                className="form-control"
                placeholder="Search specification..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ACTIONS */}
            <div className="spec-toolbar-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdd}
              >
                <Plus size={18} />
                Add Spec
              </button>

              <select
                className="form-control spec-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="spec-id-column">
                    ID
                  </th>

                  <th>Spec Name</th>
                  <th>Lifetime Start</th>
                  <th>Lifetime End</th>
                  <th>Status</th>

                  <th className="spec-action-column">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="spec-table-message"
                    >
                      <div className="empty-state">
                        <p>Loading specifications...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredSpecs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="spec-table-message"
                    >
                      <div className="empty-state">
                        <SlidersHorizontal size={32} />

                        <p>
                          No specification data found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSpecs.map((spec) => {
                    const isActive =
                      Number(spec.active_flag) === 1;

                    return (
                      <tr key={spec.spec_id}>

                        {/* ID */}
                        <td>
                          <span className="spec-id">
                            {spec.spec_id}
                          </span>
                        </td>

                        {/* SPEC NAME */}
                        <td>
                          <span className="spec-name">
                            {spec.spec_name}
                          </span>
                        </td>

                        {/* LIFETIME START */}
                        <td>
                          <span className="spec-lifetime">
                            {formatDate(spec.lifetime_start)}
                          </span>
                        </td>

                        {/* LIFETIME END */}
                        <td>
                          <span className="spec-lifetime">
                            {formatDate(spec.lifetime_end)}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`spec-status-badge ${
                              isActive
                                ? "spec-status-active"
                                : "spec-status-inactive"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="btn-icon spec-action-edit"
                              onClick={() => handleEdit(spec)}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className="btn-icon spec-action-delete"
                              onClick={() => handleDelete(spec)}
                              title="Deactivate"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="spec-table-footer">
            <span>
              Showing {filteredSpecs.length} of {specs.length} specifications
            </span>
          </div>
        </div>

        {/* ADD / EDIT MODAL */}
        {showModal && (
          <div
            className="modal-overlay"
            onClick={handleCloseModal}
          >
            <div
              className="modal spec-modal"
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">
                    {editingSpec
                      ? "Edit Spec"
                      : "Add Spec"}
                  </h2>

                  <p className="spec-modal-description">
                    {editingSpec
                      ? "Update the specification information."
                      : "Add a new device specification to the system."}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-icon"
                  onClick={handleCloseModal}
                  disabled={saving}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* MODAL FORM */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">

                  {/* ERROR */}
                  {error && (
                    <div className="alert alert-error spec-modal-alert">
                      {error}
                    </div>
                  )}

                  {/* SPEC NAME */}
                  <div className="form-group">
                    <label htmlFor="spec_name">
                      Spec Name
                    </label>

                    <input
                      id="spec_name"
                      name="spec_name"
                      type="text"
                      className="form-control"
                      value={form.spec_name}
                      onChange={handleChange}
                      placeholder="Enter spec name"
                      maxLength={100}
                      required
                    />
                  </div>

                  {/* LIFETIME START */}
                  <div className="form-group">
                    <label htmlFor="lifetime_start">
                      Lifetime Start
                    </label>

                    <input
                      id="lifetime_start"
                      name="lifetime_start"
                      type="date"
                      className="form-control"
                      value={form.lifetime_start}
                      onChange={handleChange}
                      max={form.lifetime_end || undefined}
                      required
                    />
                  </div>

                  {/* LIFETIME END */}
                  <div className="form-group">
                    <label htmlFor="lifetime_end">
                      Lifetime End
                    </label>

                    <input
                      id="lifetime_end"
                      name="lifetime_end"
                      type="date"
                      className="form-control"
                      value={form.lifetime_end}
                      onChange={handleChange}
                      min={form.lifetime_start || undefined}
                      required
                    />
                  </div>

                  {/* STATUS */}
                  <div className="form-group">
                    <label htmlFor="active_flag">
                      Status
                    </label>

                    <select
                      id="active_flag"
                      name="active_flag"
                      className="form-control"
                      value={form.active_flag}
                      onChange={handleChange}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingSpec
                        ? "Update"
                        : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
