
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import { AdminLayout, ClientLayout, MainLayout } from "./components/layouts/MainLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import GerenciarChamados from "./pages/admin/GerenciarChamados";
import GerenciarUsuarios from "./pages/admin/GerenciarUsuarios";

// Client Pages
import NovoChamado from "./pages/client/NovoChamado";
import MeusChamados from "./pages/client/MeusChamados";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* Admin routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/chamados" element={<GerenciarChamados />} />
              <Route path="/admin/usuarios" element={<GerenciarUsuarios />} />
            </Route>

            {/* Client routes */}
            <Route element={<ClientLayout />}>
              <Route path="/cliente/novo-chamado" element={<NovoChamado />} />
              <Route path="/cliente/chamados" element={<MeusChamados />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
