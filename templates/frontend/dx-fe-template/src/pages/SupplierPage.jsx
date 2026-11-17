
import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  X,
  Truck,
} from "lucide-react";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../api/supplierApi.js";

// ============================================
// HELPER: FORMAT RUPIAH
// ============================================

const formatRupiah = (value) => {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  return new Intl.NumberFormat("id-ID").format(Number(value));
};

// ============================================
// HELPER: PARSE NUMERIC VALUE
// ============================================

const parsePrice = (value) => {
  return String(value).replace(/\D/g, "");
};

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
// SUPPLIER PAGE
// ============================================

export default function SupplierPage() {
  // STATE
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [form, setForm] = useState({
    supplier_by: "",
    supplier_date: "",
    price_supplier: "",
  });

  const [saving, setSaving] = useState(false);

  // ============================================
  // FETCH SUPPLIERS
  // ============================================

  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSuppliers();

      if (response.success) {
        setSuppliers(response.data);
      } else {
        setError(
          response.message ||
          "Gagal mengambil data supplier"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal mengambil data supplier"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ============================================
  // SEARCH SUPPLIERS
  // ============================================

  const filteredSuppliers = useMemo(() => {
    const keyword = search.toLowerCase();

    return suppliers.filter((supplier) => {
      return (
        String(supplier.supplier_id || "")
          .toLowerCase()
          .includes(keyword) ||

        String(supplier.supplier_by || "")
          .toLowerCase()
          .includes(keyword) ||

        String(supplier.supplier_date || "")
          .toLowerCase()
          .includes(keyword) ||

        String(supplier.price_supplier || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [suppliers, search]);

  // ============================================
  // OPEN ADD MODAL
  // ============================================

  const handleAdd = () => {
    setError("");
    setEditingSupplier(null);

    setForm({
      supplier_by: "",
      supplier_date: "",
      price_supplier: "",
    });

    setShowModal(true);
  };

  // ============================================
  // OPEN EDIT MODAL
  // ============================================

  const handleEdit = (supplier) => {
    setError("");
    setEditingSupplier(supplier);

        setForm({
      supplier_by: supplier.supplier_by || "",
      supplier_date: String(
        supplier.supplier_date || ""
      ).slice(0, 10),
      price_supplier:
        supplier.price_supplier !== null &&
          supplier.price_supplier !== undefined
          ? parsePrice(supplier.price_supplier)
          : "",
    });

    setShowModal(true);
  };

  // ============================================
  // HANDLE FORM INPUT
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price_supplier") {
      setForm((prev) => ({
        ...prev,
        price_supplier: parsePrice(value),
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================
  // SAVE SUPPLIER
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const price = Number(form.price_supplier);

    const payload = {
      supplier_by: form.supplier_by.trim(),
      supplier_date: form.supplier_date.trim(),
      price_supplier: price,
    };

    if (
      !payload.supplier_by ||
      !payload.supplier_date ||
      !form.price_supplier
    ) {
      setError("Semua field wajib diisi");
      return;
    }

    if (!Number.isSafeInteger(price) || price < 0) {
      setError("Harga supplier harus berupa angka yang valid");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingSupplier) {
        await updateSupplier(
          editingSupplier.supplier_id,
          payload
        );
      } else {
        await createSupplier(payload);
      }

      setShowModal(false);
      setEditingSupplier(null);

      await fetchSuppliers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan supplier"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // DELETE SUPPLIER
  // ============================================

  const handleDelete = async (supplier) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus supplier "${supplier.supplier_by}" secara permanen?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteSupplier(supplier.supplier_id);

      await fetchSuppliers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal menghapus supplier"
      );
    }
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingSupplier(null);
    setError("");
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="page-wrapper supplier-page">
      <div className="page-container">

        {/* ERROR */}
        {error && !showModal && (
          <div className="alert alert-error supplier-alert">
            {error}
          </div>
        )}

        {/* SUPPLIER TABLE CARD */}
        <section className="card">

          {/* CARD HEADER */}
          <div className="card-header">
            <div>
              <h2 className="card-title">
                Supplier List
              </h2>

              <p className="card-description">
                Manage asset suppliers.
              </p>
            </div>

            <div className="supplier-total">
              <Truck size={16} />
              <span>
                {filteredSuppliers.length} Suppliers
              </span>
            </div>
          </div>

          {/* SEARCH & ACTION */}
          <div className="supplier-toolbar">
            <div className="supplier-search">
              <Search
                size={18}
                className="supplier-search-icon"
              />

              <input
                type="text"
                className="form-control"
                placeholder="Search supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="supplier-toolbar-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdd}
              >
                <Plus size={18} />
                Add Supplier
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="supplier-id-column">
                    ID
                  </th>

                  <th>Supplier By</th>
                  <th>Supplier Date</th>
                  <th>Price Supplier</th>

                  <th className="supplier-action-column">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="supplier-table-message"
                    >
                      Loading suppliers...
                    </td>
                  </tr>
                ) : filteredSuppliers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="supplier-table-message"
                    >
                      <div className="empty-state">
                        <Truck size={32} />

                        <h3>
                          No supplier data found
                        </h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.supplier_id}>

                      {/* ID */}
                      <td>
                        <span className="supplier-id">
                          {supplier.supplier_id}
                        </span>
                      </td>

                      {/* SUPPLIER BY */}
                      <td>
                        <span className="supplier-name">
                          {supplier.supplier_by}
                        </span>
                      </td>

                      {/* SUPPLIER DATE */}
                      <td>
                          <span className="spec-lifetime">
                            {formatDate(supplier.supplier_date)}
                          </span>
                        </td>

                      {/* PRICE SUPPLIER */}
                      <td>
                        <span className="supplier-price">
                          {supplier.price_supplier !== null &&
                            supplier.price_supplier !== undefined
                            ? `Rp${formatRupiah(supplier.price_supplier)}`
                            : "-"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn-icon supplier-action-edit"
                            onClick={() =>
                              handleEdit(supplier)
                            }
                            title="Edit supplier"
                            aria-label="Edit supplier"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="btn-icon supplier-action-delete"
                            onClick={() =>
                              handleDelete(supplier)
                            }
                            title="Delete supplier"
                            aria-label="Delete supplier"
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
          <div className="supplier-table-footer">
            <span>
              Showing {filteredSuppliers.length} of{" "}
              {suppliers.length} suppliers
            </span>
          </div>
        </section>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="modal supplier-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {editingSupplier
                    ? "Edit Supplier"
                    : "Add Supplier"}
                </h2>

                <p className="supplier-modal-description">
                  {editingSupplier
                    ? "Update asset supplier information."
                    : "Add a new asset supplier."}
                </p>
              </div>

              <button
                type="button"
                className="btn-icon"
                onClick={handleCloseModal}
                disabled={saving}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                {error && (
                  <div className="alert alert-error supplier-modal-alert">
                    {error}
                  </div>
                )}

                {/* SUPPLIER BY */}
                <div className="form-group">
                  <label htmlFor="supplier_by">
                    Supplier By
                  </label>

                  <input
                    id="supplier_by"
                    name="supplier_by"
                    type="text"
                    className="form-control"
                    value={form.supplier_by}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                    maxLength={100}
                    required
                  />
                </div>

                {/* SUPPLIER DATE */}
                <div className="form-group">
                  <label htmlFor="supplier_date">
                    Supplier Date
                  </label>
                  
                  <input
                    id="supplier_date"
                    name="supplier_date"
                    type="date"
                    className="form-control"
                    value={form.supplier_date}
                    onChange={handleChange}
                    max={form.lifetime_end || undefined}
                    required
                  />
                </div>

                {/* PRICE SUPPLIER */}
                <div className="form-group">
                  <label htmlFor="price_supplier">
                    Price Supplier
                  </label>

                  <input
                    id="price_supplier"
                    name="price_supplier"
                    type="text"
                    className="form-control"
                    value={
                      form.price_supplier === ""
                        ? ""
                        : `Rp${formatRupiah(form.price_supplier)}`
                    }
                    onChange={handleChange}
                    placeholder="Rp0"
                    inputMode="numeric"
                    required
                  />
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
                    : editingSupplier
                      ? "Update Supplier"
                      : "Save Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}