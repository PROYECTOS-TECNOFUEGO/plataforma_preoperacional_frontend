import { Routes, Route, Navigate } from "react-router-dom";

// Componentes generales
import Login from "../views/Login";
import NoAutorizado from "../views/NoAutorizado";
import Layout from "../components/Layout/Layout";
import Dashboard from "../views/Dashboard";
import Principal from "../views/Principal";
import Form from "../views/Form";
import Reportes from "../views/Reportes";
import Usuarios from "../views/Usuarios";
import Vehiculos from "../views/Vehiculos";

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/no-autorizado" element={<NoAutorizado />} />

    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="principal" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="principal" element={<Principal />} />
      <Route path="formulario" element={<Form />} /> {/* crear */}
      <Route path="ver/:id" element={<Form />} /> {/* ver */}
      <Route path="editar/:id" element={<Form />} /> {/* editar */}
      <Route path="reportes" element={<Reportes />} />
      <Route path="usuarios" element={<Usuarios />} />
      <Route path="vehiculos" element={<Vehiculos />} />
    </Route>

    <Route path="*" element={<Navigate to="/principal" replace />} />
  </Routes>
);
