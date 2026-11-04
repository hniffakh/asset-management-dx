
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi.js";

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    backgroundColor: "#f3f4f6",
  },
  sidebar: {
    width: "250px",
    minWidth: "250px",
    backgroundColor: "#1f2937",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    padding: "30px",
    overflowX: "auto",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "5px",
    fontSize: "14px",
  },
  primaryButton: {
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tableCell: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#111827",
    fontSize: "14px",
    },
};

export default function CategoryPage() {
  const navigate = useNavigate();

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

  // ============================================
  // FETCH CATEGORIES
  // ============================================
  const fetchCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCategories();

      if (response.success) {
        setCategories(response.data);
      } else {
        setError(response.message || "Gagal mengambil data kategori");
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

  // ============================================
  // SEARCH & FILTER
  // ============================================
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.category_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        String(category.active_flag) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  // ============================================
  // OPEN ADD MODAL
  // ============================================
  const handleAdd = () => {
    setEditingCategory(null);

    setForm({
      category_name: "",
      active_flag: 1,
    });

    setShowModal(true);
  };

  // ============================================
  // OPEN EDIT MODAL
  // ============================================
  const handleEdit = (category) => {
    setEditingCategory(category);

    setForm({
      category_name: category.category_name,
      active_flag: category.active_flag,
    });

    setShowModal(true);
  };

  // ============================================
  // SAVE CATEGORY
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryName = form.category_name.trim();

    if (!categoryName) {
      alert("Nama kategori wajib diisi");
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

  // ============================================
  // DELETE CATEGORY
  // ============================================
  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Nonaktifkan kategori "${category.category_name}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteCategory(category.category_id);

      await fetchCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal menonaktifkan kategori"
      );
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isLoggedIn");

    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.page}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "20px",
            borderBottom: "1px solid #374151",
            paddingBottom: "10px",
          }}
        >
          DX AMS
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </div>

          <div
            style={{
              padding: "10px",
              backgroundColor: "#374151",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Master Data
          </div>

          <div
            style={{
              marginLeft: "15px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              fontSize: "14px",
              color: "#9ca3af",
            }}
          >
            <div
              style={{
                padding: "8px",
                backgroundColor: "#374151",
                color: "white",
                borderRadius: "5px",
              }}
            >
              Category
            </div>

            {["Device", "Spec", "Harga", "Opoq", "Location"].map(
              (menu) => (
                <div
                  key={menu}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  {menu}
                </div>
              )
            )}
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.content}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#111827",
                margin: 0,
              }}
            >
              Master Category
            </h1>

            <p style={{ color: "#6b7280" }}>
              Manage device categories
            </p>
          </div>

          <button
            onClick={handleAdd}
            style={styles.primaryButton}
          >
            + Add Category
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* TABLE */}
        <div style={styles.card}>
          {/* SEARCH & FILTER */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                ...styles.input,
                flex: 1,
                minWidth: "200px",
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={styles.input}
            >
              <option value="all">All Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          {/* CATEGORY TABLE */}
            <div style={{ overflowX: "auto" }}>
            <table
                style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                }}
            >
                <thead>
                <tr
                    style={{
                    backgroundColor: "#f3f4f6",
                    color: "#111827",
                    }}
                >
                    <th style={styles.tableCell}>ID</th>
                    <th style={styles.tableCell}>Category Name</th>
                    <th style={styles.tableCell}>Status</th>
                    <th style={styles.tableCell}>Action</th>
                </tr>
                </thead>

                <tbody>
                {loading ? (
                    <tr>
                    <td
                        colSpan={4}
                        style={{
                        ...styles.tableCell,
                        textAlign: "center",
                        color: "#111827",
                        }}
                    >
                        Loading categories...
                    </td>
                    </tr>
                ) : filteredCategories.length === 0 ? (
                    <tr>
                    <td
                        colSpan={4}
                        style={{
                        ...styles.tableCell,
                        textAlign: "center",
                        color: "#111827",
                        }}
                    >
                        No category data found
                    </td>
                    </tr>
                ) : (
                    filteredCategories.map((category) => (
                    <tr key={category.category_id}>
                        {/* ID */}
                        <td style={styles.tableCell}>
                        {category.category_id}
                        </td>

                        {/* CATEGORY NAME */}
                        <td style={styles.tableCell}>
                        {category.category_name}
                        </td>

                        {/* STATUS */}
                        <td style={styles.tableCell}>
                        <span
                            style={{
                            padding: "5px 10px",
                            borderRadius: "5px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color:
                                category.active_flag === 1
                                ? "#166534"
                                : "#991b1b",
                            backgroundColor:
                                category.active_flag === 1
                                ? "#dcfce7"
                                : "#fee2e2",
                            }}
                        >
                            {category.active_flag === 1
                            ? "Active"
                            : "Inactive"}
                        </span>
                        </td>

                        {/* ACTION */}
                        <td style={styles.tableCell}>
                        <div
                            style={{
                            display: "flex",
                            gap: "8px",
                            }}
                        >
                            <button
                            onClick={() => handleEdit(category)}
                            style={{
                                padding: "6px 10px",
                                backgroundColor: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            >
                            Edit
                            </button>

                            <button
                            onClick={() => handleDelete(category)}
                            disabled={category.active_flag === 0}
                            style={{
                                padding: "6px 10px",
                                backgroundColor:
                                category.active_flag === 0
                                    ? "#9ca3af"
                                    : "#dc2626",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor:
                                category.active_flag === 0
                                    ? "not-allowed"
                                    : "pointer",
                            }}
                            >
                            Delete
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>

          <div
            style={{
              marginTop: "15px",
              color: "#6b7280",
              fontSize: "13px",
            }}
          >
            Total: {filteredCategories.length} categories
          </div>
        </div>

        {/* ADD / EDIT MODAL */}
        {showModal && (
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "white",
                width: "100%",
                maxWidth: "450px",
                padding: "25px",
                borderRadius: "10px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: "#111827",
                }}
              >
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "18px",
                  }}
                >
                  <label htmlFor="category_name">
                    Category Name
                  </label>

                  <input
                    id="category_name"
                    type="text"
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
                    style={{
                      ...styles.input,
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "25px",
                  }}
                >
                  <label htmlFor="active_flag">
                    Status
                  </label>

                  <select
                    id="active_flag"
                    value={form.active_flag}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        active_flag: Number(e.target.value),
                      })
                    }
                    style={{
                      ...styles.input,
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#e5e7eb",
                      color: "#374151",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    style={styles.primaryButton}
                  >
                    {saving
                      ? "Saving..."
                      : editingCategory
                      ? "Update"
                      : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
