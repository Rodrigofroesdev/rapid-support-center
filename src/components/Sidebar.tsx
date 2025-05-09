
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FilePlus,
  FileSearch,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon: Icon, label, active, onClick }: SidebarLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    )}
    onClick={onClick}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/chamados', icon: FileSearch, label: 'Gerenciar Chamados' },
    { to: '/admin/usuarios', icon: Users, label: 'Gerenciar Usuários' },
  ];

  const clientLinks = [
    { to: '/cliente/novo-chamado', icon: FilePlus, label: 'Abrir Chamado' },
    { to: '/cliente/chamados', icon: FileSearch, label: 'Meus Chamados' },
  ];

  const links = user?.role === 'admin' ? adminLinks : clientLinks;

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col transition-transform duration-300 ease-in-out h-screen shadow-lg",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        "md:fixed md:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="flex flex-col p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-sidebar-foreground">HelpDesk</h2>
          </div>
          {user && (
            <div className="flex flex-col">
              <p className="text-sm text-sidebar-foreground font-medium truncate">{user.nome}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.tipo}</p>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {links.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                active={isActive(link.to)}
                onClick={closeMobileSidebar}
              />
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            onClick={logout}
          >
            <LogOut size={18} className="mr-2" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </>
  );
}
