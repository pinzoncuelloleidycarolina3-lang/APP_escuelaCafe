import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { perfil, actualizarPerfil, logout } from "../services/api";
import Chatbot from "../components/Chatbot";
import "./EditarPerfil.css";

function EditarPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password_actual: "",
    password_nuevo: "",
    password_confirmar: "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await perfil();
        setUsuario(data);
        setForm((prev) => ({
          ...prev,
          nombre: data.nombre || "",
          email: data.email || "",
        }));
      } catch (error) {
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    // Validaciones
    if (form.password_nuevo && form.password_nuevo.length < 8) {
      setMensaje({
        tipo: "error",
        texto: "La nueva contraseña debe tener mínimo 8 caracteres.",
      });
      return;
    }

    if (form.password_nuevo && !form.password_actual) {
      setMensaje({
        tipo: "error",
        texto: "Debes ingresar tu contraseña actual para cambiarla.",
      });
      return;
    }

    if (form.password_nuevo !== form.password_confirmar) {
      setMensaje({
        tipo: "error",
        texto: "Las contraseñas nuevas no coinciden.",
      });
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        nombre: form.nombre,
        email: form.email,
      };

      if (form.password_nuevo) {
        payload.password_actual = form.password_actual;
        payload.password_nuevo = form.password_nuevo;
      }

      await actualizarPerfil(payload);

      // Recargar perfil actualizado
      const usuarioActualizado = await perfil();
      setUsuario(usuarioActualizado);
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      setMensaje({
        tipo: "exito",
        texto: "Perfil actualizado correctamente.",
      });

      // Limpiar campos de contraseña
      setForm((prev) => ({
        ...prev,
        password_actual: "",
        password_nuevo: "",
        password_confirmar: "",
      }));

      setTimeout(() => setMensaje(null), 4000);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto:
          error.response?.data?.message || "Error al actualizar el perfil.",
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (cargando) {
    return (
      <div className="editar-loading">
        <div className="spinner"></div>
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  if (!usuario) return null;

  const esInstructor =
    usuario.rol === "Instructor" || usuario.rol === "Admin";
  const inicial = usuario.nombre?.charAt(0).toUpperCase() || "U";

  return (
    <div className="editar-wrapper">
      {/* NAVBAR */}
      <nav className="editar-navbar">
        <div className="navbar-logo">
          <span className="logo-icon">EC</span>
          <span className="logo-text">Escuela Café</span>
        </div>

        <div className="navbar-links">
          <Link to="/perfil">Inicio</Link>
          {esInstructor ? (
            <>
              <Link to="/crear-curso">Crear curso</Link>
              <Link to="/panel-instructor">Panel instructor</Link>
            </>
          ) : (
            <>
              <Link to="/carrito">Suscripción</Link>
              <Link to="/mis-cursos">Mis cursos</Link>
            </>
          )}
        </div>

        <button className="btn-cerrar" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </nav>

      {/* CONTENIDO */}
      <div className="editar-content">
        <div className="editar-card">
          {/* HEADER CON AVATAR */}
          <div className="editar-header">
            <div className="editar-avatar">{inicial}</div>
            <div>
              <h1>Editar perfil</h1>
              <p>Actualiza tu información personal o cambia tu contraseña</p>
            </div>
          </div>

          {/* MENSAJES */}
          {mensaje && (
            <div className={`editar-mensaje ${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}

          {/* FORMULARIO */}
          <form className="editar-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_actual">Contraseña actual</label>
              <input
                id="password_actual"
                type="password"
                name="password_actual"
                value={form.password_actual}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña actual"
                autoComplete="current-password"
              />
              <small>Solo si deseas cambiar la contraseña</small>
            </div>

            <div className="form-group">
              <label htmlFor="password_nuevo">Nueva contraseña</label>
              <input
                id="password_nuevo"
                type="password"
                name="password_nuevo"
                value={form.password_nuevo}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmar">
                Confirmar nueva contraseña
              </label>
              <input
                id="password_confirmar"
                type="password"
                name="password_confirmar"
                value={form.password_confirmar}
                onChange={handleChange}
                placeholder="Repite la nueva contraseña"
                autoComplete="new-password"
              />
            </div>

            <div className="editar-acciones">
              <Link to="/perfil" className="btn-cancelar">
                Cancelar
              </Link>
              <button
                type="submit"
                className="btn-guardar"
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CHATBOT */}
      <Chatbot />
    </div>
  );
}

export default EditarPerfil;