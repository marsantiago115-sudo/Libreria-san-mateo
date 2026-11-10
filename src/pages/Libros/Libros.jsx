import { useState } from "react";
import { useData } from "../../context/DataContext";
import "./Libros.css";

const vacio = { titulo: "", autor: "", genero: "" };

export default function Libros() {
  const { usuario, libros, agregarLibro, eliminarLibro } = useData();
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState(vacio);

  const esCliente = usuario.rol === "cliente";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarLibro(form);
    setForm(vacio);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Eliminar este libro?")) eliminarLibro(id);
  };

  const texto = busqueda.toLowerCase();
  const resultados = libros.filter(
    (l) =>
      (l.titulo || "").toLowerCase().includes(texto) ||
      (l.autor || "").toLowerCase().includes(texto) ||
      (l.genero || "").toLowerCase().includes(texto)
  );

  return (
    <div className="pagina libros">
      <h2>{esCliente ? "Catálogo de libros" : "Buscar libros"}</h2>
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
            {usuario.rol === "admin" && (
              <button className="btn-peligro" onClick={() => handleEliminar(l.id)}>
                Eliminar
              </button>
            )}
          </li>
        ))}
      </ul>

      {!esCliente && (
        <>
          <h3>Agregar libro</h3>
          <form className="form-libro" onSubmit={handleSubmit}>
            <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
            <input name="autor" placeholder="Autor" value={form.autor} onChange={handleChange} required />
            <input name="genero" placeholder="Género" value={form.genero} onChange={handleChange} />
            <button type="submit">Agregar</button>
          </form>
        </>
      )}
    </div>
  );
}