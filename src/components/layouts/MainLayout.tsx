
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

export function MainLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isMobile = useIsMobile();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg text-primary">Carregando...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col md:ml-64">
        <main className="flex-1 p-4 sm:p-6 max-w-[1200px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
      
      <Toaster position="top-right" closeButton />
    </div>
  );
}

export function AdminLayout() {
  const { user } = useAuth();
  
  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/cliente/chamados" />;
  }
  
  return <MainLayout />;
}

export function ClientLayout() {
  const { user } = useAuth();
  
  // Redirect if not client
  if (user?.role !== 'client') {
    return <Navigate to="/admin/dashboard" />;
  }
  
  return <MainLayout />;
}
