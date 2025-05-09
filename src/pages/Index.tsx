
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/cliente/chamados");
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-lg text-primary">Redirecionando...</div>
    </div>
  );
};

export default Index;
