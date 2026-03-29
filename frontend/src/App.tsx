import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';

// Pages
import Home          from '@/pages/Home';
import About         from '@/pages/About';
import Officers      from '@/pages/Officers';
import Announcements from '@/pages/Announcements';
import Events        from '@/pages/Events';
import SCS           from '@/pages/SCS';
import Services      from '@/pages/Services';
import Documents     from '@/pages/Documents';
import Organizations from '@/pages/Organizations';
import Evaluations   from '@/pages/Evaluations';
import History       from '@/pages/History';
import Contact       from '@/pages/Contact';
import Login         from '@/pages/Login';
import Dashboard     from '@/pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth route — no layout chrome */}
            <Route path="/login" element={<Login />} />

            {/* All other routes use the shared Layout */}
            <Route element={<Layout />}>
              {/* Public */}
              <Route path="/"             element={<Home />} />
              <Route path="/about"        element={<About />} />
              <Route path="/officers"     element={<Officers />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/events"       element={<Events />} />
              <Route path="/scs"          element={<SCS />} />
              <Route path="/services"     element={<Services />} />
              <Route path="/documents"    element={<Documents />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/history"      element={<History />} />
              <Route path="/contact"      element={<Contact />} />

              {/* Student+ */}
              <Route
                path="/evaluations"
                element={
                  <ProtectedRoute requiredRole="student">
                    <Evaluations />
                  </ProtectedRoute>
                }
              />

              {/* Officer+ */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="officer">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                  <h1 className="font-heading font-bold text-4xl text-gray-900">404</h1>
                  <p className="text-gray-500">Page not found.</p>
                  <a href="/" className="text-primary-500 hover:underline">← Back to Home</a>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
