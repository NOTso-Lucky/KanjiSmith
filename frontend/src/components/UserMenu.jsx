import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initial = user?.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="relative" ref={ref}>

      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition hover:opacity-80"
        style={{
          background: "var(--primary)",
          color: "var(--primary-foreground, #fff)",
        }}
        aria-label="User menu"
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-2xl border shadow-lg z-50 overflow-hidden"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* User info */}
          <div
            className="px-4 py-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground, #fff)",
                }}
              >
                {initial}
              </div>
              <div className="min-w-0">
                <p
                  className="truncate text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {user?.username}
                </p>
                <p
                  className="truncate text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { navigate("/settings"); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-surface-hover"
              style={{ color: "var(--foreground)" }}
            >
              <Settings size={15} style={{ color: "var(--muted-foreground)" }} />
              Settings
            </button>

            <button
              onClick={() => { navigate("/profile"); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-surface-hover"
              style={{ color: "var(--foreground)" }}
            >
              <User size={15} style={{ color: "var(--muted-foreground)" }} />
              Profile
            </button>
          </div>

          {/* Logout */}
          <div
            className="border-t py-1"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-surface-hover"
              style={{ color: "var(--primary)" }}
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}