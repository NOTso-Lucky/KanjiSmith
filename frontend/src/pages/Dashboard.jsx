import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import TodayStudyCard from "../components/dashboard/TodayStudyCard";
import RecentFlashcards from "../components/dashboard/RecentFlashcards";
import MyDecks from "../components/dashboard/MyDecks";
import RecentActivity from "../components/dashboard/RecentActivity";
import { useAuth } from "../contexts/AuthContext";
import { getSummary, getDueCount } from "../services/dashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();

  const [summary, setSummary] = useState(null);
  const [dueCount, setDueCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [summaryData, dueData] = await Promise.all([
          getSummary(),
          getDueCount(),
        ]);
        setSummary(summaryData);
        setDueCount(dueData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [location.key]);

  return (
    <MainLayout>
      <div className="space-y-8 lg:space-y-10">
        <WelcomeHeader user={user} />

        <StatsGrid summary={summary} dueCount={dueCount} loading={loading} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TodayStudyCard summary={summary} loading={loading} />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>

        <RecentFlashcards />

        <MyDecks />
      </div>
    </MainLayout>
  );
}