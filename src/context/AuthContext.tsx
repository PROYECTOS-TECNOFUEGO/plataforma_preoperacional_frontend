// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Interfaz de usuario
interface Usuario {
  username: string;
  rol: "admin" | "supervisor" | "conductor";
}

interface AuthContextProps {
  usuario: Usuario | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  usuario: null,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Restaurar sesión si existe
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) setUsuario(JSON.parse(storedUser));
  }, []);

  // Login real con backend
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });
      const userData: Usuario = res.data;
      setUsuario(userData);
      localStorage.setItem("usuario", JSON.stringify(userData));
      return true;
    } catch (error) {
      return false;
    }
  };

  // Cerrar sesión
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
