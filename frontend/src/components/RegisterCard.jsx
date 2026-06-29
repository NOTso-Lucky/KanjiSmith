import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";


function RegisterCard() {
    const navigate=useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.username || !form.email || !form.password) {
    alert("Please fill all fields.");
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await register({
      username: form.username,
      email: form.email,
      password: form.password,
    });

    console.log(response);

    alert(response.message);

    navigate("/login");
  } 
  catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Start your Japanese learning journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div>
          <label className="mb-2 block text-sm font-medium">Username</label>

          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted-foreground)]" />

            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 outline-none transition focus:border-[var(--primary)]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted-foreground)]" />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 outline-none transition focus:border-[var(--primary)]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted-foreground)]" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-12 outline-none transition focus:border-[var(--primary)]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-[var(--muted-foreground)]" />
              ) : (
                <Eye className="h-5 w-5 text-[var(--muted-foreground)]" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted-foreground)]" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-12 outline-none transition focus:border-[var(--primary)]"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-[var(--muted-foreground)]" />
              ) : (
                <Eye className="h-5 w-5 text-[var(--muted-foreground)]" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--primary)] py-3 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[var(--primary)] hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default RegisterCard;