import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { useData } from "./context/DataContext";
import Inicio from "./pages/Inicio/Inicio";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";
import Libros from "./pages/Libros/Libros";
import Clientes from "./pages/Clientes/clientes";
import Bibliotecarios from "./pages/Bibliotecarios/Bibliotecarios";
import "./App.css";

function RutaPrivada({ children, roles }) {
  const { usuario } = useData();
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/libros"
          element={
            <RutaPrivada roles={["admin", "bibliotecario", "cliente"]}>
              <Libros />
            </RutaPrivada>
          }
        />
        <Route
          path="/clientes"
          element={
            <RutaPrivada roles={["admin", "bibliotecario"]}>
              <Clientes />
            </RutaPrivada>
          }
        />
        <Route
          path="/bibliotecarios"
          element={
            <RutaPrivada roles={["admin"]}>
              <Bibliotecarios />
            </RutaPrivada>
          }
        />
      </Routes>
    </>
  );
}