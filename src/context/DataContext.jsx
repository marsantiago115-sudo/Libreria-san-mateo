import { createContext, useContext, useState } from "react";

const DataContext = createContext(null);

const USUARIOS_INICIALES = [
  { id: 1, correo: "admin@biblioteca.com", clave: "1234", nombre: "Administrador", rol: "admin" },
  { id: 2, correo: "biblio@biblioteca.com", clave: "1234", nombre: "Bibliotecario", rol: "bibliotecario" },
];

const LIBROS_INICIALES = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", genero: "Novela" },
  { id: 2, titulo: "El amor en los tiempos del cólera", autor: "Gabriel García Márquez", genero: "Novela" },
  { id: 3, titulo: "Rayuela", autor: "Julio Cortázar", genero: "Novela" },
];

const CLIENTES_INICIALES = [
  { id: 1, nombre: "Juan Pérez", telefono: "3001234567", correo: "juan@correo.com", clave: "1234" },
];

export function DataProvider({ children }) {
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIALES);
  const [usuario, setUsuario] = useState(null);
  const [libros, setLibros] = useState(LIBROS_INICIALES);
  const [clientes, setClientes] = useState(CLIENTES_INICIALES);

  // Revisa que el correo no lo use ya otro usuario o cliente
  const correoEnUso = (correo, { usuarioId, clienteId } = {}) =>
    usuarios.some((u) => u.correo === correo && u.id !== usuarioId) ||
    clientes.some((c) => c.correo && c.correo === correo && c.id !== clienteId);

  // Sesión (admin, bibliotecario y cliente)
  const login = (correo, clave) => {
    const cuentas = [
      ...usuarios,
      ...clientes.map((c) => ({ ...c, rol: "cliente" })),
    ];
    const u = cuentas.find((x) => x.correo && x.correo === correo && x.clave === clave);
    if (!u) return false;
    const { clave: _omitida, ...sinClave } = u;
    setUsuario(sinClave);
    return true;
  };

  const logout = () => setUsuario(null);

  // Bibliotecarios (solo los usa el admin)
  const bibliotecarios = usuarios.filter((u) => u.rol === "bibliotecario");

  const agregarBibliotecario = (datos) => {
    if (correoEnUso(datos.correo)) return false;
    setUsuarios((prev) => [...prev, { ...datos, id: Date.now(), rol: "bibliotecario" }]);
    return true;
  };

  const editarBibliotecario = (id, datos) => {
    if (correoEnUso(datos.correo, { usuarioId: id })) return false;
    const cambios = { ...datos };
    if (!cambios.clave) delete cambios.clave;
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, ...cambios } : u)));
    return true;
  };

  const eliminarBibliotecario = (id) =>
    setUsuarios((prev) => prev.filter((u) => u.id !== id));

  // Libros
  const agregarLibro = (libro) =>
    setLibros((prev) => [...prev, { ...libro, id: Date.now() }]);

  const eliminarLibro = (id) =>
    setLibros((prev) => prev.filter((l) => l.id !== id));

  // Clientes (devuelven false si el correo ya existe)
  const agregarCliente = (cliente) => {
    if (correoEnUso(cliente.correo)) return false;
    setClientes((prev) => [...prev, { ...cliente, id: Date.now() }]);
    return true;
  };

  const editarCliente = (id, datos) => {
    if (correoEnUso(datos.correo, { clienteId: id })) return false;
    const cambios = { ...datos };
    if (!cambios.clave) delete cambios.clave; // si la deja vacía, conserva la anterior
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...cambios } : c)));
    return true;
  };

  const eliminarCliente = (id) =>
    setClientes((prev) => prev.filter((c) => c.id !== id));

  // Autoregistro: crea el cliente e inicia sesión de una vez
  const registrarCliente = (datos) => {
    if (correoEnUso(datos.correo)) return false;
    const id = Date.now();
    setClientes((prev) => [...prev, { ...datos, id }]);
    const { clave: _omitida, ...sinClave } = datos;
    setUsuario({ ...sinClave, id, rol: "cliente" });
    return true;
  };

  const value = {
    usuario,
    login,
    logout,
    bibliotecarios,
    agregarBibliotecario,
    editarBibliotecario,
    eliminarBibliotecario,
    libros,
    agregarLibro,
    eliminarLibro,
    clientes,
    agregarCliente,
    editarCliente,
    eliminarCliente,
    registrarCliente,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}