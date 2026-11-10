import { useState } from "react";
import { useData } from "../../context/DataContext";
import "./Libros.css";

const vacio = { titulo: "", autor: "", genero: "" };

export default function Libros() {
  const { usuario, libros, agregarLibro, editarLibro, eliminarLibro } = useData();
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);

  const esCliente = usuario?.rol === "cliente";
  const esAdmin = usuario?.rol === "admin";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(vacio);
  };

  // CREATE y UPDATE comparten el mismo formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editandoId) {
      editarLibro(editandoId, form);
    } else {
      agregarLibro(form);
    }
    cancelarEdicion();
  };

  // Carga el libro en el formulario para modificarlo
  const handleEditar = (libro) => {
    setForm({
      titulo: libro.titulo,
      autor: libro.autor,
      genero: libro.genero || "",
    });
    setEditandoId(libro.id);
  };

  // DELETE
  const handleEliminar = (id) => {
    if (!window.confirm("¿Eliminar este libro?")) return;
    eliminarLibro(id);
    if (editandoId === id) cancelarEdicion();
  };

  // READ con filtro de búsqueda
  const texto = busqueda.toLowerCase();
  const resultados = libros.filter(
    (l) =>
      (l.titulo || "").toLowerCase().includes(texto) ||
      (l.autor || "").toLowerCase().includes(texto) ||
      (l.genero || "").toLowerCase().includes(texto)
  );

  return (
    <div className="pagina libros">
      <h2>{esCliente ? "Catálogo de libros" : "Gestión de libros"}</h2>

      {!esCliente && (
        <>
          <h3>{editandoId ? "Editar libro" : "Agregar libro"}</h3>
          <form className="form-libro" onSubmit={handleSubmit}>
            <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
            <input name="autor" placeholder="Autor" value={form.autor} onChange={handleChange} required />
            <input name="genero" placeholder="Género" value={form.genero} onChange={handleChange} />
            <button type="submit">{editandoId ? "Actualizar" : "Agregar"}</button>
            {editandoId && (
              <button type="button" onClick={cancelarEdicion}>Cancelar</button>
            )}
          </form>
        </>
      )}

      <input
        className="buscador"
        type="search"
        placeholder="Buscar por título, autor o género..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <ul className="lista">
        {resultados.length === 0 && <li>No se encontraron libros.</li>}
        {resultados.map((l) => (
          <li key={l.id}>
            <span>
              <strong>{l.titulo}</strong> — {l.autor}
              {l.genero && ` (${l.genero})`}
            </span>
            {!esCliente && (
              <span className="libros-acciones">
                <button onClick={() => handleEditar(l)}>Editar</button>
                {esAdmin && (
                  <button className="btn-peligro" onClick={() => handleEliminar(l.id)}>
                    Eliminar
                  </button>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
