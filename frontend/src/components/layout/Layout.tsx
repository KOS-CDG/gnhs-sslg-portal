import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '@/components/ui/ToastContainer';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-body">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
