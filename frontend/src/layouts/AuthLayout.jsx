import Navbar from "../components/Navbar";

function AuthLayout({ children }) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;