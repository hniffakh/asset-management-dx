import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Search, X, Tags} from "lucide-react";
import {getCategories, createCategory, updateCategory} from "../api/categoryApi.js";

// CATEGORY PAGE

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({
    category_name: "",
    active_flag: 1,
  });

  const [saving, setSaving] = useState(false);

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCategories();

      if (response.success) {
        setCategories(response.data);
      } else {
        setError(
          response.message || "Gagal mengambil data kategori"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal mengambil data kategori"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // SEARCH & FILTER
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const categoryName = (
        category.category_name || ""
      )
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        String(category.active_flag) === statusFilter;

      return categoryName && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  // OPEN ADD MODAL
  const handleAdd = () => {
    setError("");
    setEditingCategory(null);

    setForm({
      category_name: "",
      active_flag: 1,
    });

    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const handleEdit = (category) => {
    setError("");
    setEditingCategory(category);

    setForm({
      category_name: category.category_name || "",
      active_flag: Number(category.active_flag),
    });

    setShowModal(true);
  };

  // SAVE CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryName = form.category_name.trim();

    if (!categoryName) {
      setError("Nama kategori wajib diisi");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        category_name: categoryName,
        active_flag: Number(form.active_flag),
      };

      if (editingCategory) {
        await updateCategory(
          editingCategory.category_id,
          payload
        );
      } else {
        await createCategory(payload);
      }

      setShowModal(false);
      setEditingCategory(null);

      await fetchCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan kategori"
      );
    } finally {
      setSaving(false);
    }
  };

  // CLOSE MODAL
  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCategory(null);
    setError("");
  };

  // RENDER
  return (
    <div className="page-wrapper category-page">
      <div className="page-container">
        {/* ERROR */}
        {error && !showModal && (
          <div className="alert alert-error category-alert">
            {error}
          </div>
        )}

        {/* CATEGORY TABLE CARD */}
        <section className="card">
          {/* CARD HEADER */}
          <div className="card-header">
            <div>
              <h2 className="card-title">
                Category List
              </h2>

              <p className="card-description">
                Manage asset categories.
              </p>
            </div>

            <div className="category-total">
              <Tags size={16} />
              <span>
                {filteredCategories.length} Categories
              </span>
            </div>
          </div>

          {/* SEARCH & FILTER */}
          <div className="category-toolbar">
            <div className="category-search">
              <Search size={18} className="category-search-icon" />

              <input
                type="text"
                className="form-control"
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="category-toolbar-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdd}
              >
                <Plus size={18} />
                Add Category
              </button>

              <select
                className="form-control category-status-filter"
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
                  <th className="category-id-column">
                    ID
                  </th>

                  <th>Category Name</th>

                  <th>Status</th>

                  <th className="category-action-column">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="category-table-message"
                    >
                      Loading categories...
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="category-table-message"
                    >
                      <div className="empty-state">
                        <Tags size={32} />

                        <h3>
                          No category data found
                        </h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => {
                    const isActive =
                      Number(category.active_flag) === 1;

                    return (
                      <tr key={category.category_id}>
                        {/* ID */}
                        <td>
                          <span className="category-id">
                            {category.category_id}
                          </span>
                        </td>

                        {/* CATEGORY NAME */}
                        <td>
                          <span className="category-name">
                            {category.category_name}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`category-status-badge ${isActive
                                ? "category-status-active"
                                : "category-status-inactive"
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
                              className="btn-icon category-action-edit"
                              onClick={() =>
                                handleEdit(category)
                              }
                              title="Edit category"
                              aria-label="Edit category"
                            >
                              <Pencil size={16} />
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
          <div className="category-table-footer">
            <span>
              Showing {filteredCategories.length} of{" "}
              {categories.length} categories
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
            className="modal category-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="category-modal-description">
                  {editingCategory
                    ? "Update asset category information."
                    : "Add a new asset category."}
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
                  <div className="alert alert-error category-modal-alert">
                    {error}
                  </div>
                )}

                {/* CATEGORY NAME */}
                <div className="form-group">
                  <label htmlFor="category_name">
                    Category Name
                  </label>

                  <input
                    id="category_name"
                    type="text"
                    className="form-control"
                    value={form.category_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category_name: e.target.value,
                      })
                    }
                    placeholder="Enter category name"
                    maxLength={100}
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
                    className="form-control"
                    value={form.active_flag}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        active_flag: Number(
                          e.target.value
                        ),
                      })
                    }
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
                    : editingCategory
                      ? "Update Category"
                      : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
