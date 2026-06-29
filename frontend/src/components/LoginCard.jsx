import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

export default function LoginCard() {
  const navigate=useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const response = await login({
      email,
      password,
    });

    console.log(response);

    localStorage.setItem("token", response.access_token);

    navigate("/dashboard");
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="w-full max-w-[470px] rounded-2xl border border-border bg-surface p-7 shadow-[var(--shadow-card)] sm:p-8">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
          字
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Continue your Japanese learning journey.
        </p>
      </div>

      <form
        className="mt-7 space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email address
          </label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition hover:border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition hover:border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <div className="relative flex h-4 w-4 items-center justify-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-border bg-background transition checked:border-primary checked:bg-primary"
              />

              <Check className="pointer-events-none absolute h-3 w-3 text-primary-foreground opacity-0 transition peer-checked:opacity-100" />
            </div>

            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary-hover transition"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary-hover transition active:scale-[0.99]"
        >
          Sign In
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>

        <span className="relative flex justify-center text-xs">
          <span className="bg-surface px-2 text-muted-foreground">
            or
          </span>
        </span>
      </div>

      <Link
        to="/register"
        className="flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)] hover:bg-surface-hover hover:border-border/80 transition active:scale-[0.99]"
      >
        Create Account
      </Link>
    </div>
  );
}