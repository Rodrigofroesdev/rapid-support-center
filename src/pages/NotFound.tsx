
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const NotFound = () => {
  const { isAuthenticated, user } = useAuth();
  
  const homeLink = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/cliente/chamados';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Página não encontrada</h2>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to={homeLink()}>Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
