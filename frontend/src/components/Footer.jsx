import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="flex flex-col items-center gap-4">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              字
            </div>

            <span className="text-lg font-semibold text-foreground">
              KanjiSmith
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Master Japanese one flashcard at a time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">

            <Link
              to="/docs"
              className="text-muted-foreground hover:text-primary transition"
            >
              Docs
            </Link>

            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-primary transition"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-muted-foreground hover:text-primary transition"
            >
              Terms
            </Link>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              GitHub
            </a>

          </div>

          <p className="text-xs text-muted-foreground text-center">
            © 2026 KanjiSmith. Built with ❤️ for Japanese learners.
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;