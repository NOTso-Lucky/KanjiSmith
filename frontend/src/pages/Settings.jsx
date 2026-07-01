import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Loader2, Check, Eye, EyeOff } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import {
  getSettings,
  updateStudySettings,
  updateAccount,
  updatePassword,
} from "../services/settings";

function Section({ title, description, children }) {
  return (
    <div
      className="rounded-2xl border p-6 space-y-5"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
        <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function SaveButton({ loading, saved }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
      style={{
        background: "var(--primary)",
        color: "var(--primary-foreground, #fff)",
      }}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : saved ? (
        <Check size={15} />
      ) : (
        <Save size={15} />
      )}
      {loading ? "Saving..." : saved ? "Saved!" : "Save"}
    </button>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none pr-10"
        style={{
          background: "var(--background)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "var(--muted-foreground)" }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function Settings() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Study preferences
  const [dailyGoal, setDailyGoal] = useState("");
  const [newCardsPerDay, setNewCardsPerDay] = useState("");
  const [studySaving, setStudySaving] = useState(false);
  const [studySaved, setStudySaved] = useState(false);
  const [studyError, setStudyError] = useState(null);

  // Account
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);
  const [accountError, setAccountError] = useState(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const settings = await getSettings();
        setDailyGoal(settings.daily_goal);
        setNewCardsPerDay(settings.new_cards_per_day);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }

    if (user) {
      setUsername(user.username ?? "");
      setEmail(user.email ?? "");
    }

    load();
  }, [user]);

  async function handleStudySubmit(e) {
    e.preventDefault();
    setStudySaving(true);
    setStudyError(null);
    setStudySaved(false);

    try {
      await updateStudySettings(Number(dailyGoal), Number(newCardsPerDay));
      setStudySaved(true);
      setTimeout(() => setStudySaved(false), 2500);
    } catch (err) {
      setStudyError(err.message || "Couldn't save study settings");
    } finally {
      setStudySaving(false);
    }
  }

  async function handleAccountSubmit(e) {
    e.preventDefault();
    setAccountSaving(true);
    setAccountError(null);
    setAccountSaved(false);

    try {
      const updated = await updateAccount(username, email, accountPassword);
      setUser(updated);
      setAccountPassword("");
      setAccountSaved(true);
      setTimeout(() => setAccountSaved(false), 2500);
    } catch (err) {
      setAccountError(err.message || "Couldn't update account");
    } finally {
      setAccountSaving(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSaved(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }

    setPasswordSaving(true);

    try {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (err) {
      setPasswordError(err.message || "Couldn't update password");
    } finally {
      setPasswordSaving(false);
    }
  }

  const inputClass = "w-full rounded-xl border px-4 py-2.5 text-sm outline-none";
  const inputStyle = {
    background: "var(--background)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl space-y-6">

        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
            Settings
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Manage your study preferences and account details.
          </p>
        </div>

        {/* Study Preferences */}
        <Section
          title="Study Preferences"
          description="Control how many cards you see each day."
        >
          <form onSubmit={handleStudySubmit} className="space-y-4">
            <Field
              label="Daily Review Goal"
              hint="Number of reviews you want to complete each day."
            >
              <input
                type="number"
                min={1}
                max={500}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field
              label="New Cards Per Day"
              hint="Maximum number of brand-new cards introduced each day."
            >
              <input
                type="number"
                min={1}
                max={500}
                value={newCardsPerDay}
                onChange={(e) => setNewCardsPerDay(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            {studyError && (
              <p className="text-sm" style={{ color: "var(--primary)" }}>
                {studyError}
              </p>
            )}

            <SaveButton loading={studySaving} saved={studySaved} />
          </form>
        </Section>

        {/* Account */}
        <Section
          title="Account"
          description="Update your username or email. Your current password is required."
        >
          <form onSubmit={handleAccountSubmit} className="space-y-4">
            <Field label="Username">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Current Password" hint="Required to save account changes.">
              <PasswordInput
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                placeholder="Confirm your current password"
              />
            </Field>

            {accountError && (
              <p className="text-sm" style={{ color: "var(--primary)" }}>
                {accountError}
              </p>
            )}

            <SaveButton loading={accountSaving} saved={accountSaved} />
          </form>
        </Section>

        {/* Password */}
        <Section
          title="Change Password"
          description="Choose a strong password at least 8 characters long."
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Field label="Current Password">
              <PasswordInput
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </Field>

            <Field label="New Password">
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </Field>

            <Field label="Confirm New Password">
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </Field>

            {passwordError && (
              <p className="text-sm" style={{ color: "var(--primary)" }}>
                {passwordError}
              </p>
            )}

            <SaveButton loading={passwordSaving} saved={passwordSaved} />
          </form>
        </Section>

      </div>
    </MainLayout>
  );
}