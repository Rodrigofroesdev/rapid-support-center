
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'client' | null;

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  token?: string;
  tipo?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const mockUsers = [
  {
    id: '1',
    nome: 'Admin Teste',
    email: 'admin@teste.com',
    senha: '123456',
    role: 'admin',
    tipo: 'TI'
  },
  {
    id: '2',
    nome: 'Cliente UBS',
    email: 'ubs@teste.com',
    senha: '123456',
    role: 'client',
    tipo: 'UBS'
  },
  {
    id: '3',
    nome: 'Cliente LAB',
    email: 'lab@teste.com',
    senha: '123456',
    role: 'client',
    tipo: 'LAB'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('helpdesk_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('helpdesk_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === password
      );
      
      if (!foundUser) {
        throw new Error('Email ou senha inválidos');
      }

      const { senha, ...userWithoutPassword } = foundUser;
      const authenticatedUser = {
        ...userWithoutPassword,
        token: `mock-token-${Date.now()}`,
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('helpdesk_user', JSON.stringify(authenticatedUser));
      
      toast.success(`Bem-vindo, ${authenticatedUser.nome}!`);
      
      // Redirect based on role
      if (authenticatedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/cliente/chamados');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('helpdesk_user');
    navigate('/login');
    toast.info('Você saiu do sistema');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
