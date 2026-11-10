import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "../Login/Login.css";

const vacio = { nombre: "", telefono: "", correo: "", clave: "" };

export default function Registro() {
  const { registrarCliente } = useData();
  const navigate = useNavigate();
  const [form, setForm] = useState(vacio);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (registrarCliente(form)) {
      navigate("/libros");
    } else {
      setError("Ya existe una cuenta con ese correo");
    }
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} required />
        <input name="clave" type="password" placeholder="Contraseña" value={form.clave} onChange={handleChange} required />
        <button type="submit">Registrarme</button>
        {error && <p className="login-error">{error}</p>}
        <small>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></small>
      </form>
    </div>
  );
}