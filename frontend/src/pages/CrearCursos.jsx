import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearCurso } from "../services/api";
import "./CrearCursos.css";

function CrearCursos() {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    nivel: "Basico",
    precio: "",
    duracion_horas: "",
    cupos_max: 20,
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");
    setCargando(true);
    try {
      const data = await crearCurso({
        ...form,
        precio: parseFloat(form.precio),
        duracion_horas: parseInt(form.duracion_horas),
        cupos_max: parseInt(form.cupos_max),
      });
      setExito("Curso creado correctamente. Cambia su estado a 'Publicado' para que aparezca en el catálogo.");
      setForm({
        titulo: "",
        descripcion: "",
        nivel: "Basico",
        precio: "",
        duracion_horas: "",
        cupos_max: 20,
      });
      setTimeout(() => navigate("/perfil"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el curso");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="crear-container">
      <nav className="crear-navbar">
        <Link to="/perfil" className="navbar-logo">
          <span className="logo-icon">EC</span>
          <span className="logo-text">Escuela Café</span>
        </Link>
        <div className="navbar-links">
          <Link to="/perfil">Inicio</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/mis-cursos">Mis cursos</Link>
          <Link to="/crear-curso" className="activo">Crear curso</Link>
        </div>
      </nav>

      <div className="crear-content">
        <div className="crear-header">
          <h1>Crear nuevo curso</h1>
          <p>Completa los datos para publicar un curso en la plataforma.</p>
        </div>

        {error && <div className="crear-mensaje error">{error}</div>}
        {exito && <div className="crear-mensaje exito">{exito}</div>}

        <form onSubmit={handleSubmit} className="crear-form">
          <div className="form-row">
            <div className="form-group full">
              <label>Título del curso *</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ej: Emprendimiento Digital"
                required
              />
            </div>
          </div>

          <div className="form-group full">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe de qué trata el curso..."
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nivel *</label>
              <select name="nivel" value={form.nivel} onChange={handleChange} required>
                <option value="Basico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            <div className="form-group">
              <label>Precio (COP) *</label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="50000"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duración (horas)</label>
              <input
                type="number"
                name="duracion_horas"
                value={form.duracion_horas}
                onChange={handleChange}
                placeholder="20"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Cupos máximos</label>
              <input
                type="number"
                name="cupos_max"
                value={form.cupos_max}
                onChange={handleChange}
                placeholder="20"
                min="1"
              />
            </div>
          </div>

          <div className="crear-actions">
            <Link to="/perfil" className="btn-cancelar">
              Cancelar
            </Link>
            <button type="submit" className="btn-crear" disabled={cargando}>
              {cargando ? "Creando..." : "Crear curso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearCursos;