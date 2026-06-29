import { useAuth } from "../../contexts/AuthContext";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function WelcomeHeader() {
  const { user } = useAuth?.() ?? { user: null };
  const name = user?.username ?? "there";

  return (
    <header className="space-y-2">
      <h1
        className="text-3xl font-semibold tracking-tight sm:text-4xl"
        style={{ color: "var(--foreground)" }}
      >
        {getGreeting()}, {name} <span aria-hidden>👋</span>
      </h1>
      <p
        className="text-base sm:text-lg"
        style={{ color: "var(--muted-foreground)" }}
      >
        Ready to continue your Japanese journey?
      </p>
    </header>
  );
}
