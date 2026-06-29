import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Welcome, {user.username} 👋
      </h1>

      <p className="mt-2 text-gray-500">
        {user.email}
      </p>

      <button
        onClick={logout}
        className="mt-6 rounded-lg bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;