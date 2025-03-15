
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Tasks from "./pages/Tasks";
import Habits from "./pages/Habits";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();
// Using the provided Google Client ID
const GOOGLE_CLIENT_ID = "698539506718-vr72s784t7i9mc7lmrmoqonp9un19h5d.apps.googleusercontent.com";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/habits" element={<Habits />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
