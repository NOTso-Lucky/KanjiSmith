import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Review from "./pages/Review";
import NotFound from "./pages/NotFound";
import Decks from "./pages/Decks";
import DeckDetail from "./pages/DeckDetail";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
      path="/dashboard"
      element={
      <ProtectedRoute>
      <Dashboard />
      </ProtectedRoute>
      }
      />

    <Route
    path="/search"
    element={
    <ProtectedRoute>
      <Search />
    </ProtectedRoute>
    }
    />

    <Route
    path="/review"
    element={
    <ProtectedRoute>
      <Review />
    </ProtectedRoute>
    }
    />
    <Route
    path="/decks"
    element={
    <ProtectedRoute>
      <Decks />
    </ProtectedRoute>
    }
    />
    <Route
    path="/decks/:deckId"
    element={
      <ProtectedRoute>
        <DeckDetail />
      </ProtectedRoute>
    }
  />
    <Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
    <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;