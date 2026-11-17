import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRound, ChevronDown, ChevronRight, LogOut, ShieldCheck, Home} from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Logged-in user information
  const username =
    sessionStorage.getItem("username") || "User";

  const role =
    sessionStorage.getItem("role") || "System User";

  const initial = username.charAt(0).toUpperCase();

  // Breadcrumb configuration
  const breadcrumbMap = {
    "/dashboard": {
      parent: "Main Menu",
      title: "Dashboard",
    },

    "/category": {
      parent: "Master Data",
      title: "Category Management",
    },

    "/device": {
      parent: "Master Data",
      title: "Device Management",
    },

    "/spec": {
      parent: "Master Data",
      title: "Spec Management",
    },

    "/supplier": {
      parent: "Master Data",
      title: "Supplier Management",
    },

    "/opoq": {
      parent: "Master Data",
      title: "OPOQ Management",
    },

    "/line": {
      parent: "Master Data",
      title: "Line Management",
    },

    "/replacement-request": {
      parent: "Transaction",
      title: "Replacement Request",
    },

    "/asset-history": {
      parent: "Transaction",
      title: "Asset History",
    },
  };

  const currentPage =
    breadcrumbMap[location.pathname] || {
      parent: "DX AMS",
      title: "Page",
    };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");

    navigate("/login", { replace: true });
  };

  return (
    <header
      style={{
        height: "70px",
        minHeight: "70px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxSizing: "border-box",
      }}
    >
      {/* LEFT: BREADCRUMB */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "11px",
            color: "#94a3b8",
          }}
        >
          <Home size={13} />

          <span>{currentPage.parent}</span>

          <ChevronRight size={12} />

          <span
            style={{
              color: "#2563eb",
              fontWeight: "600",
            }}
          >
            {currentPage.title}
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: "700",
            color: "#17243a",
          }}
        >
          {currentPage.title}
        </h2>
      </div>

      {/* RIGHT: PROFILE */}
      <div
        ref={profileRef}
        style={{
          position: "relative",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => setShowProfile((prev) => !prev)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "11px",
            padding: "7px 11px",
            border: showProfile
              ? "1px solid #bfdbfe"
              : "1px solid transparent",
            borderRadius: "10px",
            backgroundColor: showProfile
              ? "#eff6ff"
              : "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {/* AVATAR */}
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              backgroundColor: "#dbeafe",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: "700",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>

          {/* USER INFO */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "3px",
            }}
          >
            <span
              style={{
                color: "#17243a",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {username}
            </span>

            <span
              style={{
                color: "#94a3b8",
                fontSize: "11px",
              }}
            >
              {role}
            </span>
          </div>

          <ChevronDown
            size={16}
            color="#64748b"
            style={{
              transform: showProfile
                ? "rotate(180deg)"
                : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>

        {/* PROFILE DROPDOWN */}
        {showProfile && (
          <div
            style={{
              position: "absolute",
              top: "55px",
              right: 0,
              width: "245px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
              padding: "8px",
              zIndex: 100,
            }}
          >
            {/* PROFILE DETAIL */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "13px 10px",
              }}
            >
              <div
                style={{
                  width: "43px",
                  height: "43px",
                  borderRadius: "50%",
                  backgroundColor: "#dbeafe",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "17px",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                {initial}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#17243a",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {username}
                </span>

                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  {role}
                </span>
              </div>
            </div>

            <div
              style={{
                height: "1px",
                backgroundColor: "#e5e7eb",
                margin: "4px 0 7px",
              }}
            />

            {/* ACCOUNT */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                color: "#64748b",
              }}
            >
              <UserRound size={17} />

              <div>
                <span
                  style={{
                    fontSize: "11px",
                    display: "block",
                  }}
                >
                  Account
                </span>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#17243a",
                    fontWeight: "600",
                  }}
                >
                  {username}
                </span>
              </div>
            </div>

            {/* ACCESS LEVEL */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                color: "#64748b",
              }}
            >
              <ShieldCheck size={17} />

              <div>
                <span
                  style={{
                    fontSize: "11px",
                    display: "block",
                  }}
                >
                  Access Level
                </span>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#17243a",
                    fontWeight: "600",
                  }}
                >
                  {role}
                </span>
              </div>
            </div>

            <div
              style={{
                height: "1px",
                backgroundColor: "#e5e7eb",
                margin: "7px 0",
              }}
            />

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 10px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "transparent",
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: "600",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
