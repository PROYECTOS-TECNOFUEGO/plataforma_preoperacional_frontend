// src/App.tsx

import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

/* Componente principal, encapsula el sistema de rutas dentro de un Router la estructura de navegación se define en <AppRoutes />. */
function App() {
  return (
    <Router>
      {/* Se gestionan todas las rutas de la aplicación desde este componente */}
      <AppRoutes />
    </Router>
  );
}

export default App;
