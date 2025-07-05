import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Loading, PageSkeleton } from "@/components/ui/loading";
import { useTranslation } from "@/components/i18n/translations";
import { ChatWidget } from "@/components/chat/ChatWidget";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Lawyers = lazy(() => import("./pages/Lawyers"));
const LegalGuides = lazy(() => import("./pages/LegalGuides"));
const Templates = lazy(() => import("./pages/Templates"));
const Consultations = lazy(() => import("./pages/Consultations"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component for routes
const RouteLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading type="dots" text={t('common.loading')} size="lg" />
    </div>
  );
};

const App = () => {
  console.log('App component is rendering...')
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/lawyers" element={<Lawyers />} />
                <Route path="/legal-guides" element={<LegalGuides />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/consultations" element={<Consultations />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <ChatWidget />
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App;