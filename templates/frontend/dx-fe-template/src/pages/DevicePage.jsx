import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Search, X, Monitor } from "lucide-react";
import {
  getDevicesApi,
  createDeviceApi,
  updateDeviceApi,
} from "../api/deviceApi";

// DEVICE PAGE

const errMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function DevicePage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  const [form, setForm] = useState({
    device_name: "",
    active_flag: 1,
  });

  const [saving, setSaving] = useState(false);

  // FETCH DEVICES
  const fetchDevices = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getDevicesApi();
      // Mendukung deviceApi yang meng-unwrap maupun yang tidak
      const body = res && res.success !== undefined ? res : res?.data;

      if (body?.success) {
        setDevices(Array.isArray(body.data) ? body.data : []);
      } else {
        setError(body?.message || "Gagal mengambil data device");
      }
    } catch (err) {
      setError(errMessage(err, "Gagal mengambil data device"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // SEARCH & FILTER
  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesName = (device.device_name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        String(device.active_flag) === statusFilter;

      return matchesName && matchesStatus;
    });
  }, [devices, search, statusFilter]);

  // OPEN ADD MODAL
  const handleAdd = () => {
    setError("");
    setEditingDevice(null);
    setForm({ device_name: "", active_flag: 1 });
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const handleEdit = (device) => {
    setError("");
    setEditingDevice(device);
    setForm({
      device_name: device.device_name || "",
      active_flag: Number(device.active_flag),
    });
    setShowModal(true);
  };

  // SAVE DEVICE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const deviceName = form.device_name.trim();

    if (!deviceName) {
      setError("Nama device wajib diisi");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        device_name: deviceName,
        active_flag: Number(form.active_flag),
      };

      if (editingDevice) {
        await updateDeviceApi(editingDevice.device_id, payload);
      } else {
        await createDeviceApi(payload);
      }

      setShowModal(false);
      setEditingDevice(null);

      await fetchDevices();
    } catch (err) {
      setError(errMessage(err, "Gagal menyimpan device"));
    } finally {
      setSaving(false);
    }
  };

  

  // CLOSE MODAL
  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingDevice(null);
    setError("");
  };

  // RENDER
  return (
    <div className="page-wrapper category-page">
      <div className="page-container">
        {/* ERROR */}
        {error && !showModal && (
          <div className="alert alert-error category-alert">{error}</div>
        )}

        {/* DEVICE TABLE CARD */}
        <section className="card">
          {/* CARD HEADER */}
          <div className="card-header">
            <div>
              <h2 className="card-title">Device List</h2>
              <p className="card-description">Manage asset devices.</p>
            </div>

            <div className="category-total">
              <Monitor size={16} />
              <span>{filteredDevices.length} Devices</span>
            </div>
          </div>

          {/* SEARCH & FILTER */}
          <div className="category-toolbar">
            <div className="category-search">
              <Search size={18} className="category-search-icon" />

              <input
                type="text"
                className="form-control"
                placeholder="Search device..."
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
                Add Device
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
                  <th className="category-id-column">ID</th>
                  <th>Device Name</th>
                  <th>Status</th>
                  <th className="category-action-column">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="category-table-message">
                      Loading devices...
                    </td>
                  </tr>
                ) : filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="category-table-message">
                      <div className="empty-state">
                        <Monitor size={32} />
                        <h3>No device data found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((device) => {
                    const isActive = Number(device.active_flag) === 1;

                    return (
                      <tr key={device.device_id}>
                        {/* ID */}
                        <td>
                          <span className="category-id">
                            {device.device_id}
                          </span>
                        </td>

                        {/* DEVICE NAME */}
                        <td>
                          <span className="category-name">
                            {device.device_name}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`category-status-badge ${
                              isActive
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
                              onClick={() => handleEdit(device)}
                              title="Edit device"
                              aria-label="Edit device"
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
              Showing {filteredDevices.length} of {devices.length} devices
            </span>
          </div>
        </section>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal category-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {editingDevice ? "Edit Device" : "Add Device"}
                </h2>

                <p className="category-modal-description">
                  {editingDevice
                    ? "Update asset device information."
                    : "Add a new asset device."}
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

                {/* DEVICE NAME */}
                <div className="form-group">
                  <label htmlFor="device_name">Device Name</label>

                  <input
                    id="device_name"
                    type="text"
                    className="form-control"
                    value={form.device_name}
                    onChange={(e) =>
                      setForm({ ...form, device_name: e.target.value })
                    }
                    placeholder="Enter device name"
                    maxLength={100}
                    required
                  />
                </div>

                {/* STATUS */}
                <div className="form-group">
                  <label htmlFor="active_flag">Status</label>

                  <select
                    id="active_flag"
                    className="form-control"
                    value={form.active_flag}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        active_flag: Number(e.target.value),
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
                    : editingDevice
                      ? "Update Device"
                      : "Save Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}