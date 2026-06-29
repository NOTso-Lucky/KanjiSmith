import { Link } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold">
            字
          </div>

          <span className="font-semibold text-lg">
            KanjiSmith
          </span>
        </Link>

        <div className="flex items-center gap-3">

          

          <ThemeSelector />

        </div>
      </div>
    </header>
  );
}

export default Navbar;