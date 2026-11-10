import { useState } from "react";
import { useData } from "../../context/DataContext";
import "./Bibliotecarios.css";

const vacio = { nombre: "", correo: "", clave: "" };

export default function Bibliotecarios() {
  const {
    bibliotecarios,
    agregarBibliotecario,
    editarBibliotecario,
    eliminarBibliotecario,
  } = useData();
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(vacio);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = editandoId
      ? editarBibliotecario(editandoId, form)
      : agregarBibliotecario(form);

    if (!ok) {
      setError("Ya existe un usuario con ese correo");
      return;
    }
    cancelarEdicion();
  };

  const handleEditar = (b) => {
    setForm({ nombre: b.nombre, correo: b.correo, clave: "" });
    setEditandoId(b.id);
    setError("");
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Eliminar este bibliotecario?")) return;
    eliminarBibliotecario(id);
    if (editandoId === id) cancelarEdicion();
  };

  return (
    <div className="pagina bibliotecarios">
      <h2>Bibliotecarios</h2>

      <form className="form-bibliotecario" onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} required />
        <input
          name="clave"
          type="password"
          placeholder={editandoId ? "Nueva contraseña (opcional)" : "Contraseña"}
          value={form.clave}
          onChange={handleChange}
          required={!editandoId}
        />
        <button type="submit">{editandoId ? "Actualizar" : "Agregar"}</button>
        {editandoId && (
          <button type="button" onClick={cancelarEdicion}>Cancelar</button>
        )}
        {error && <p className="bibliotecario-error">{error}</p>}
      </form>

      <ul className="lista-bibliotecarios">
        {bibliotecarios.length === 0 && <li>No hay bibliotecarios registrados.</li>}
        {bibliotecarios.map((b) => (
          <li key={b.id}>
            <span>{b.nombre} — {b.correo}</span>
            <span className="bibliotecarios-acciones">
              <button onClick={() => handleEditar(b)}>Editar</button>
              <button className="btn-peligro" onClick={() => handleEliminar(b.id)}>
                Eliminar
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}