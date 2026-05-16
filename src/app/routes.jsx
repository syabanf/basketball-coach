import { Route, Routes, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { BoardPage } from '../features/board/BoardPage.jsx';
import { DashboardPage } from '../features/dashboard/DashboardPage.jsx';
import { PlaysPage } from '../features/plays/PlaysPage.jsx';
import { PlayersPage } from '../features/players/PlayersPage.jsx';
import { TeamPage } from '../features/team/TeamPage.jsx';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage.jsx';
import { SchedulePage } from '../features/schedule/SchedulePage.jsx';
import { LibraryPage } from '../features/library/LibraryPage.jsx';
import { SettingsPage } from '../features/settings/SettingsPage.jsx';
import { MorePage } from '../features/settings/MorePage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/board" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/board"     element={<BoardPage />} />
        <Route path="/plays"     element={<PlaysPage />} />
        <Route path="/players"   element={<PlayersPage />} />
        <Route path="/team"      element={<TeamPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/schedule"  element={<SchedulePage />} />
        <Route path="/library"   element={<LibraryPage />} />
        <Route path="/settings"  element={<SettingsPage />} />
        <Route path="/more"      element={<MorePage />} />
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Route>
    </Routes>
  );
}
