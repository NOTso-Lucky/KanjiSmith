import WelcomeHeader from "../components/dashboard/WelcomeHeader";
import SearchHero from "../components/dashboard/SearchHero";
import StatsGrid from "../components/dashboard/StatsGrid";
import TodayStudyCard from "../components/dashboard/TodayStudyCard";
import RecentFlashcards from "../components/dashboard/RecentFlashcards";
import MyDecks from "../components/dashboard/MyDecks";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";
import { useAuth } from "../contexts/AuthContext";
export default function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="space-y-8 lg:space-y-10">
        <WelcomeHeader user={user} />
        <SearchHero />
        <StatsGrid />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TodayStudyCard />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        <RecentFlashcards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MyDecks />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </section>
  );
}
