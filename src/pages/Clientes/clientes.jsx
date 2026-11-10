import { useState } from "react";
import { useData } from "../../context/DataContext";
import "./clientes.css";

const vacio = { nombre: "", telefono: "", correo: "", clave: "" };

export default function Clientes() {
  const { usuario, clientes, agregarCliente, editarCliente, eliminarCliente } = useData();
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
      ? editarCliente(editandoId, form)
      : agregarCliente(form);

    if (!ok) {
      setError("Ya existe una cuenta con ese correo");
      return;
    }
    cancelarEdicion();
  };

  const handleEditar = (c) => {
    setForm({ nombre: c.nombre, telefono: c.telefono, correo: c.correo, clave: "" });
    setEditandoId(c.id);
    setError("");
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    eliminarCliente(id);
    if (editandoId === id) cancelarEdicion();
  };

  return (
    <div className="pagina clientes">
      <h2>Clientes</h2>

      <form className="form-cliente" onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
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
        {error && <p className="cliente-error">{error}</p>}
      </form>

      <ul className="lista-clientes">
        {clientes.length === 0 && <li>No hay clientes registrados.</li>}
        {clientes.map((c) => (
          <li key={c.id}>
            <span>
              {c.nombre}
              {c.telefono && ` — ${c.telefono}`}
              {c.correo && ` — ${c.correo}`}
            </span>
            <span className="clientes-acciones">
              <button onClick={() => handleEditar(c)}>Editar</button>
              {usuario.rol === "admin" && (
                <button className="btn-peligro" onClick={() => handleEliminar(c.id)}>
                  Eliminar
                </button>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}