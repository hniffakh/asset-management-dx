
import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
  Factory,
} from "lucide-react";

import {
  getLines,
  createLine,
  updateLine,
  deleteLine,
} from "../api/lineApi.js";

// ============================================
// LINE PAGE
// ============================================

export default function LinePage() {
  // STATE
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingLine, setEditingLine] = useState(null);

  const [form, setForm] = useState({
    line_code: "",
    company_code: "",
    plant_code: "",
    bu_code: "",
    product_code: "",
    area_code: "",
    line_name: "",
    line_category: "",
    flag: "A",
  });

  const [saving, setSaving] = useState(false);

  // ============================================
  // FETCH LINES
  // ============================================

  const fetchLines = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getLines();

      if (response.success) {
        setLines(response.data || []);
      } else {
        setError(
          response.message ||
          "Failed to retrieve line data"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to retrieve line data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  // ============================================
  // SEARCH
  // ============================================

  const filteredLines = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return lines.filter((line) => {
      return (
        String(line.line_code || "")
          .trim()
          .toLowerCase()
          .includes(keyword) ||

        String(line.company_code || "")
          .trim()
          .toLowerCase()
          .includes(keyword) ||

        String(line.plant_code || "")
          .trim()
          .toLowerCase()
          .includes(keyword) ||

        String(line.bu_code || "")
          .trim()
          .toLowerCase()
          .includes(keyword) ||

        String(line.product_code || "")
          .trim()
          .toLowerCase()
          .includes(keyword) ||

        String(line.area_code || "")
          .trim()
          .toLowerCase()
          .includes(keyword) ||

        String(line.line_name || "")
          .trim()
          .toLowerCase()
          .includes(keyword) ||

        String(line.line_category || "")
          .trim()
          .toLowerCase()
          .includes(keyword) ||

        String(line.flag || "")
          .trim()
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [lines, search]);

  // ============================================
  // OPEN ADD MODAL
  // ============================================

  const handleAdd = () => {
    setEditingLine(null);

    setForm({
      line_code: "",
      company_code: "",
      plant_code: "",
      bu_code: "",
      product_code: "",
      area_code: "",
      line_name: "",
      line_category: "",
      flag: "A",
    });

    setError("");
    setShowModal(true);
  };

  // ============================================
  // OPEN EDIT MODAL
  // ============================================

  const handleEdit = (line) => {
    setEditingLine(line);

    setForm({
      line_code: String(line.line_code || "").trim(),
      company_code: String(line.company_code || "").trim(),
      plant_code: String(line.plant_code || "").trim(),
      bu_code: String(line.bu_code || "").trim(),
      product_code: String(line.product_code || "").trim(),
      area_code: String(line.area_code || "").trim(),
      line_name: String(line.line_name || "").trim(),
      line_category: String(line.line_category || "").trim(),
      flag: String(line.flag || "A").trim().toUpperCase(),
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
      [name]: name === "flag" ? value.toUpperCase() : value,
    }));
  };

  // ============================================
  // SAVE LINE
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      line_code: form.line_code.trim(),
      company_code: form.company_code.trim(),
      plant_code: form.plant_code.trim(),
      bu_code: form.bu_code.trim(),
      product_code: form.product_code.trim(),
      area_code: form.area_code.trim(),
      line_name: form.line_name.trim(),
      line_category: form.line_category.trim(),
      flag: form.flag.trim().toUpperCase(),
    };

    if (
      !payload.line_code ||
      !payload.company_code ||
      !payload.plant_code ||
      !payload.bu_code ||
      !payload.product_code ||
      !payload.area_code ||
      !payload.line_name ||
      !payload.line_category ||
      !payload.flag
    ) {
      setError("All fields are required");
      return;
    }

    if (!["A", "N"].includes(payload.flag)) {
      setError("Flag must be A (Active) or N (Nonactive)");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingLine) {
        const updatePayload = {
          new_line_code: payload.line_code,
          company_code: payload.company_code,
          plant_code: payload.plant_code,
          bu_code: payload.bu_code,
          product_code: payload.product_code,
          area_code: payload.area_code,
          line_name: payload.line_name,
          line_category: payload.line_category,
          flag: payload.flag,
        };

        console.log("UPDATE PAYLOAD:", updatePayload);

        await updateLine(
          String(editingLine.line_code).trim(),
          updatePayload
        );
      } else {
        await createLine(payload);
      }

      setShowModal(false);
      setEditingLine(null);

      await fetchLines();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to save line"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // DELETE LINE
  // ============================================

  const handleDelete = async (line) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete line "${String(line.line_name || "").trim()}" (${String(line.line_code || "").trim()})?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteLine(String(line.line_code).trim());

      await fetchLines();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete line"
      );
    }
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingLine(null);
    setError("");
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page-wrapper line-page">
      <div className="page-container">

        {/* ERROR */}
        {error && (
          <div className="alert alert-error line-alert">
            {error}
          </div>
        )}

        {/* LINE CARD */}
        <div className="card line-table-card">

          {/* CARD HEADER */}
          <div className="card-header">
            <div>
              <h3 className="card-title">
                Line List
              </h3>

              <p className="card-description">
                Manage production lines and their organizational information.
              </p>
            </div>

            <div className="line-total">
              <Factory size={16} />
              <span>
                {filteredLines.length} Lines
              </span>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="line-toolbar">

            {/* SEARCH */}
            <div className="line-search">
              <Search
                size={18}
                className="line-search-icon"
              />

              <input
                type="text"
                className="form-control"
                placeholder="Search line..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ACTIONS */}
            <div className="line-toolbar-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdd}
              >
                <Plus size={18} />
                Add Line
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Line Code</th>
                  <th>Line Name</th>
                  <th>Company Code</th>
                  <th>Plant Code</th>
                  <th>BU Code</th>
                  <th>Product Code</th>
                  <th>Area Code</th>
                  <th>Line Category</th>
                  <th>Status</th>
                  <th className="line-action-column">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="line-table-message"
                    >
                      <div className="empty-state">
                        <p>Loading lines...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredLines.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="line-table-message"
                    >
                      <div className="empty-state">
                        <Factory size={32} />

                        <p>
                          No line data found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLines.map((line) => (
                    <tr key={line.line_code}>

                      {/* LINE CODE */}
                      <td>
                        <span className="line-code">
                          {String(line.line_code || "").trim()}
                        </span>
                      </td>

                      {/* LINE NAME */}
                      <td>
                        <span className="line-name">
                          {String(line.line_name || "").trim()}
                        </span>
                      </td>

                      {/* COMPANY CODE */}
                      <td>
                        {String(line.company_code || "").trim()}
                      </td>

                      {/* PLANT CODE */}
                      <td>
                        {String(line.plant_code || "").trim()}
                      </td>

                      {/* BU CODE */}
                      <td>
                        {String(line.bu_code || "").trim()}
                      </td>

                      {/* PRODUCT CODE */}
                      <td>
                        {String(line.product_code || "").trim()}
                      </td>

                      {/* AREA CODE */}
                      <td>
                        {String(line.area_code || "").trim()}
                      </td>

                      {/* LINE CATEGORY */}
                      <td>
                        {String(line.line_category || "").trim()}
                      </td>

                      {/* FLAG */}
                      <td>
                        <span
                          className={
                            String(line.flag || "").trim().toUpperCase() === "A"
                              ? "status-badge status-active"
                              : "status-badge status-inactive"
                          }
                        >
                          {String(line.flag || "").trim().toUpperCase() === "A"
                            ? "Active"
                            : "Nonactive"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn-icon line-action-edit"
                            onClick={() => handleEdit(line)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="btn-icon line-action-delete"
                            onClick={() => handleDelete(line)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="line-table-footer">
            <span>
              Showing {filteredLines.length} of {lines.length} lines
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
              className="modal line-modal"
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">
                    {editingLine ? "Edit Line" : "Add Line"}
                  </h2>

                  <p className="line-modal-description">
                    {editingLine
                      ? "Update the production line information."
                      : "Add a new production line to the system."}
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

              {/* MODAL BODY */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body">

                  {/* LINE CODE */}
                  <div className="form-group">
                    <label htmlFor="line_code">
                      Line Code
                    </label>

                    <input
                      id="line_code"
                      name="line_code"
                      type="text"
                      className="form-control"
                      value={form.line_code}
                      onChange={handleChange}
                      placeholder="Enter line code"
                      maxLength={10}
                      required
                    />
                  </div>

                  {/* LINE NAME */}
                  <div className="form-group">
                    <label htmlFor="line_name">
                      Line Name
                    </label>

                    <input
                      id="line_name"
                      name="line_name"
                      type="text"
                      className="form-control"
                      value={form.line_name}
                      onChange={handleChange}
                      placeholder="Enter line name"
                      maxLength={100}
                      required
                    />
                  </div>

                  {/* COMPANY CODE */}
                  <div className="form-group">
                    <label htmlFor="company_code">
                      Company Code
                    </label>

                    <input
                      id="company_code"
                      name="company_code"
                      type="text"
                      className="form-control"
                      value={form.company_code}
                      onChange={handleChange}
                      placeholder="Enter company code"
                      maxLength={11}
                      required
                    />
                  </div>

                  {/* PLANT CODE */}
                  <div className="form-group">
                    <label htmlFor="plant_code">
                      Plant Code
                    </label>

                    <input
                      id="plant_code"
                      name="plant_code"
                      type="text"
                      className="form-control"
                      value={form.plant_code}
                      onChange={handleChange}
                      placeholder="Enter plant code"
                      maxLength={5}
                      required
                    />
                  </div>

                  {/* BU CODE */}
                  <div className="form-group">
                    <label htmlFor="bu_code">
                      BU Code
                    </label>

                    <input
                      id="bu_code"
                      name="bu_code"
                      type="text"
                      className="form-control"
                      value={form.bu_code}
                      onChange={handleChange}
                      placeholder="Enter BU code"
                      maxLength={10}
                      required
                    />
                  </div>

                  {/* PRODUCT CODE */}
                  <div className="form-group">
                    <label htmlFor="product_code">
                      Product Code
                    </label>

                    <input
                      id="product_code"
                      name="product_code"
                      type="text"
                      className="form-control"
                      value={form.product_code}
                      onChange={handleChange}
                      placeholder="Enter product code"
                      maxLength={8}
                      required
                    />
                  </div>

                  {/* AREA CODE */}
                  <div className="form-group">
                    <label htmlFor="area_code">
                      Area Code
                    </label>

                    <input
                      id="area_code"
                      name="area_code"
                      type="text"
                      className="form-control"
                      value={form.area_code}
                      onChange={handleChange}
                      placeholder="Enter area code"
                      maxLength={50}
                      required
                    />
                  </div>

                  {/* LINE CATEGORY */}
                  <div className="form-group">
                    <label htmlFor="line_category">
                      Line Category
                    </label>

                    <input
                      id="line_category"
                      name="line_category"
                      type="text"
                      className="form-control"
                      value={form.line_category}
                      onChange={handleChange}
                      placeholder="Enter line category"
                      maxLength={50}
                      required
                    />
                  </div>

                  {/* FLAG */}
                  <div className="form-group">
                    <label htmlFor="flag">
                      Status
                    </label>

                    <select
                      id="flag"
                      name="flag"
                      className="form-control"
                      value={form.flag}
                      onChange={handleChange}
                      required
                    >
                      <option value="A">Active</option>
                      <option value="N">Nonactive</option>
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
                      : editingLine
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
