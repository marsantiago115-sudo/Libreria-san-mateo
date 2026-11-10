import { NavLink, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Navbar.css";

export default function Navbar() {
  const { usuario, logout } = useData();
  const navigate = useNavigate();

  const esPersonal = usuario?.rol === "admin" || usuario?.rol === "bibliotecario";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">📚 Biblioteca</NavLink>

      <div className="navbar-links">
        <NavLink to="/">Inicio</NavLink>
        {usuario && <NavLink to="/libros">Libros</NavLink>}
        {esPersonal && <NavLink to="/clientes">Clientes</NavLink>}
        {usuario?.rol === "admin" && <NavLink to="/bibliotecarios">Bibliotecarios</NavLink>}
      </div>

      <div className="navbar-usuario">
        {usuario ? (
          <>
            <span>
              {usuario.nombre} <small className="navbar-rol">({usuario.rol})</small>
            </span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Iniciar sesión</NavLink>
            <NavLink to="/registro">Registrarse</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}