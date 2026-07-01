import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import UserMenu from "./UserMenu";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold">
            字
          </div>
          <span className="font-semibold text-lg">KanjiSmith</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <button
                onClick={() => navigate("/search")}
                className="grid h-9 w-9 place-items-center rounded-full border transition hover:opacity-70"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                  color: "var(--foreground)",
                }}
                aria-label="Search"
              >
                <Search size={16} />
              </button>
              <UserMenu />
            </>
          )}
          <ThemeSelector />
        </div>

      </div>
    </header>
  );
}

export default Navbar;