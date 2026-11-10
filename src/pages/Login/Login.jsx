import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Login.css";

export default function Login() {
  const { login } = useData();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(correo, clave)) {
      navigate("/libros");
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {error && <p className="login-error">{error}</p>}
        <small>
          Admin: admin@biblioteca.com / 1234
          <br />
          Bibliotecario: biblio@biblioteca.com / 1234
          <br />
          Cliente: juan@correo.com / 1234
        </small>
        <small>¿Eres nuevo? <Link to="/registro">Crea tu cuenta</Link></small>
      </form>
    </div>
  );
}