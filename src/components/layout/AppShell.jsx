import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header, MobileHeader } from './Header.jsx';
import { MobileBottomNav } from './MobileBottomNav.jsx';
import { Toaster } from '../ui/Toaster.jsx';

export function AppShell() {
  return (
    <div className="min-h-screen flex bg-surface-alt">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header />
        <MobileHeader />
        <main className="flex-1 min-w-0 pb-24 lg:pb-10">
          <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-8 max-w-[1440px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
        <MobileBottomNav />
      </div>
      <Toaster />
    </div>
  );
}
