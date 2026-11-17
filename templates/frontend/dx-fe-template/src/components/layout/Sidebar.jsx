import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Database, Package, Settings, ChevronDown, PanelLeftClose, PanelLeftOpen, Tags, Monitor, FileText, Truck, MapPin, History, ArrowLeftRight, Layers, LogOut } from "lucide-react";
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

  // Hanya admin yang boleh melihat menu Master Data
  const isAdmin =
    (sessionStorage.getItem("role") || "").trim().toLowerCase() === "admin";

  
  // Settings: info akun + logout di dalam sidebar
  const username = sessionStorage.getItem("username") || "-";
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    if (!window.confirm("Yakin ingin keluar dari aplikasi?")) return;

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");

    navigate("/login", { replace: true });
  };

  const masterPaths = [
    "/category",
    "/device",
    "/spec",
    "/supplier",
    "/opoq",
    "/line",
  ];

  const peminjamanPaths = [
    "/replacement-request",
    "/asset-history",
  ];

  const isMasterPage = masterPaths.includes(location.pathname);
  const isPeminjamanPage = peminjamanPaths.includes(location.pathname);

  const [isMasterOpen, setIsMasterOpen] = useState(isMasterPage);
  const [isPeminjamanOpen, setIsPeminjamanOpen] =
    useState(isPeminjamanPage);

  // Automatically open submenu based on current route
  useEffect(() => {
    if (isMasterPage) {
      setIsMasterOpen(true);
    }

    if (isPeminjamanPage) {
      setIsPeminjamanOpen(true);
    }
  }, [location.pathname]);

  const navigateTo = (path) => {
    navigate(path);
  };

  const toggleSubmenu = (menu) => {
    if (isCollapsed) {
      setIsCollapsed(false);

      if (menu === "master") {
        setIsMasterOpen(true);
      }

      if (menu === "peminjaman") {
        setIsPeminjamanOpen(true);
      }

      return;
    }

    if (menu === "master") {
      setIsMasterOpen((prev) => !prev);
    }

    if (menu === "peminjaman") {
      setIsPeminjamanOpen((prev) => !prev);
    }
  };

  const menuButtonStyle = (active = false) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: isCollapsed ? "12px 0" : "11px 13px",
    justifyContent: isCollapsed ? "center" : "flex-start",
    border: "none",
    borderRadius: "8px",
    backgroundColor: active ? "#2563eb" : "transparent",
    color: active ? "#ffffff" : "#a1aebe",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: active ? "600" : "500",
    textAlign: "left",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  });

  const submenuButtonStyle = (active = false) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "9px 12px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: active
      ? "rgba(37, 99, 235, 0.18)"
      : "transparent",
    color: active ? "#60a5fa" : "#94a3b8",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: active ? "600" : "400",
    textAlign: "left",
    transition: "all 0.2s ease",
  });

  const iconSize = 18;

  const masterMenus = [
    { label: "Category", path: "/category", icon: Tags },
    { label: "Device", path: "/device", icon: Monitor },
    { label: "Spec", path: "/spec", icon: FileText },
    { label: "Supplier", path: "/supplier", icon: Truck },
    { label: "OPOQ", path: "/opoq", icon: Layers },
    { label: "Line", path: "/line", icon: MapPin },
  ];

  const peminjamanMenus = [
    {
      label: "Replacement Request",
      path: "/replacement-request",
      icon: ArrowLeftRight,
    },
    {
      label: "Asset History",
      path: "/asset-history",
      icon: History,
    },
  ];

  const renderSubmenu = (menus) => (
    <div
      style={{
        marginLeft: "15px",
        paddingLeft: "12px",
        borderLeft: "1px solid #334155",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginTop: "5px",
      }}
    >
      {menus.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigateTo(item.path)}
            style={submenuButtonStyle(active)}
            title={item.label}
          >
            <Icon size={15} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <aside
      style={{
        width: isCollapsed ? "76px" : "260px",
        minWidth: isCollapsed ? "76px" : "260px",
        height: "100vh",
        position: "sticky",
        top: 0,
        backgroundColor: "#17243a",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        transition: "width 0.25s ease, min-width 0.25s ease",
        overflowX: "hidden",
        overflowY: "auto",
        flexShrink: 0,
        padding: "18px 12px",
      }}
    >
      {/* BRAND */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          padding: isCollapsed ? "5px 0 22px" : "5px 8px 22px",
          borderBottom: "1px solid #334155",
          marginBottom: "25px",
          minHeight: "42px",
        }}
      >
        {!isCollapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "9px",
                backgroundColor: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={20} color="#ffffff" />
            </div>

            <div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                DX AMS
              </div>

              <div
                style={{
                  fontSize: "9px",
                  color: "#94a3b8",
                  letterSpacing: "1px",
                }}
              >
                ASSET MANAGEMENT
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "9px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Layers size={21} color="#ffffff" />
          </div>
        )}

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            title="Collapse sidebar"
            style={{
              border: "none",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              padding: "6px",
              borderRadius: "6px",
            }}
          >
            <PanelLeftClose size={19} />
          </button>
        )}
      </div>

      {/* EXPAND BUTTON */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          title="Expand sidebar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "transparent",
            color: "#94a3b8",
            cursor: "pointer",
            padding: "10px",
            marginBottom: "18px",
          }}
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      {/* NAVIGATION */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "7px",
          flex: 1,
        }}
      >
        {/* SECTION LABEL */}
        {!isCollapsed && (
          <div
            style={{
              color: "#64748b",
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "1.2px",
              padding: "0 10px 8px",
            }}
          >
            MAIN MENU
          </div>
        )}

        {/* DASHBOARD */}
        <button
          onClick={() => navigateTo("/dashboard")}
          title="Dashboard"
          style={menuButtonStyle(
            location.pathname === "/dashboard"
          )}
        >
          <LayoutDashboard size={iconSize} />
          {!isCollapsed && <span>Dashboard</span>}
        </button>

        {/* MASTER DATA (khusus admin) */}
        {isAdmin && (
        <div>
          <button
            onClick={() => toggleSubmenu("master")}
            title="Master Data"
            style={menuButtonStyle(isMasterPage)}
          >
            <Database size={iconSize} />

            {!isCollapsed && (
              <>
                <span style={{ flex: 1 }}>Master Data</span>

                <ChevronDown
                  size={16}
                  style={{
                    transform: isMasterOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </>
            )}
          </button>

            {!isCollapsed &&
            isMasterOpen &&
            renderSubmenu(masterMenus)}
           </div>
           )}

        {/* PEMINJAMAN ASET */}
        <div>
          <button
            onClick={() => toggleSubmenu("peminjaman")}
            title="Peminjaman Aset"
            style={menuButtonStyle(isPeminjamanPage)}
          >
            <Package size={iconSize} />

            {!isCollapsed && (
              <>
                <span style={{ flex: 1 }}>Peminjaman Aset</span>

                <ChevronDown
                  size={16}
                  style={{
                    transform: isPeminjamanOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </>
            )}
          </button>

          {!isCollapsed &&
            isPeminjamanOpen &&
            renderSubmenu(peminjamanMenus)}
        </div>
      </nav>

      {/* BOTTOM MENU */}
      <div
        style={{
          borderTop: "1px solid #334155",
          paddingTop: "15px",
          marginTop: "20px",
        }}
      >
                <button
          onClick={() => {
            if (isCollapsed) {
              setIsCollapsed(false);
              setIsSettingsOpen(true);
              return;
            }
            setIsSettingsOpen((prev) => !prev);
          }}
          title="Settings"
          style={menuButtonStyle(false)}
        >
          <Settings size={iconSize} />

          {!isCollapsed && (
            <>
              <span style={{ flex: 1 }}>Settings</span>

              <ChevronDown
                size={16}
                style={{
                  transform: isSettingsOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </>
          )}
        </button>

        {!isCollapsed && isSettingsOpen && (
          <div
            style={{
              marginLeft: "15px",
              paddingLeft: "12px",
              borderLeft: "1px solid #334155",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              marginTop: "5px",
            }}
          >
            

            <button
              onClick={handleLogout}
              title="Logout"
              style={{ ...submenuButtonStyle(false), color: "#f87171" }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        )}

        {!isCollapsed && (
          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              padding: "18px 10px 0",
              lineHeight: "1.6",
            }}
          >
            DX AMS
            <br />
            Asset Management System
          </div>
        )}
      </div>
    </aside>
  );
}