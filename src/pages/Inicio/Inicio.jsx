import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Inicio.css";

export default function Inicio() {
  const { usuario, libros } = useData();

  return (
    <div className="pagina inicio">
      <h1>📚 Biblioteca</h1>
      <p>Bienvenido al sistema de consulta de libros.</p>
      <p className="contador">
        Libros registrados: <strong>{libros.length}</strong>
      </p>

      {usuario ? (
        <Link className="btn-link" to="/libros">Buscar libros</Link>
      ) : (
        <Link className="btn-link" to="/login">Iniciar sesión</Link>
      )}
    </div>
  );
}