import Chatbot from "../components/Chatbot";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  perfil,
  listarCursos,
  agregarAlCarrito,
  misCursosComoInstructor,
  logout,
} from "../services/api";
import "./perfil.css";


function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosInstructor, setCursosInstructor] = useState([]);
  const [filtroNivel, setFiltroNivel] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [agregando, setAgregando] = useState({});
  const [mensajes, setMensajes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const perfilData = await perfil();
      setUsuario(perfilData);

      const esInstructor =
        perfilData.rol === "Instructor" || perfilData.rol === "Admin";

      if (esInstructor) {
        const dataInstructor = await misCursosComoInstructor();
        setCursosInstructor(dataInstructor.cursos || []);
      } else {
        const dataCursos = await listarCursos();
        setCursos(dataCursos.cursos || []);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarAlCarrito = async (cursoId) => {
    setAgregando((prev) => ({ ...prev, [cursoId]: true }));
    setMensajes((prev) => ({ ...prev, [cursoId]: null }));
    try {
      await agregarAlCarrito(cursoId);
      setMensajes((prev) => ({
        ...prev,
        [cursoId]: { tipo: "exito", texto: "✓ Agregado a tu suscripción" },
      }));
    } catch (error) {
      const msg = error.response?.data?.message || "Error al agregar";
      setMensajes((prev) => ({
        ...prev,
        [cursoId]: { tipo: "error", texto: msg },
      }));
    } finally {
      setAgregando((prev) => ({ ...prev, [cursoId]: false }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cursosFiltrados =
    filtroNivel === "Todos"
      ? cursos
      : cursos.filter((c) => c.nivel === filtroNivel);

  const badgeColor = (nivel) => {
    const colores = {
      Basico: "badge-verde",
      Intermedio: "badge-amarillo",
      Avanzado: "badge-rojo",
    };
    return colores[nivel] || "badge-gris";
  };

  const esInstructor =
    usuario?.rol === "Instructor" || usuario?.rol === "Admin";

  const totalInscritos = cursosInstructor.reduce(
    (acc, c) => acc + (c.total_inscritos || 0),
    0
  );
  const ingresosTotales = cursosInstructor.reduce(
    (acc, c) => acc + (c.ingresos_totales || 0),
    0
  );

  if (cargando) {
    return (
      <div className="perfil-loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="perfil-wrapper">
      {/* ===================== NAVBAR ===================== */}
      <nav className="perfil-navbar">
        <div className="navbar-logo">
          <span className="logo-icon">EC</span>
          <span className="logo-text">Escuela Café</span>
          <Chatbot />
        </div>

        <div className="navbar-links">
          <Link to="/perfil" className="activo">
            Inicio
          </Link>

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

        <div className="navbar-right">
          {esInstructor && (
            <Link to="/panel-instructor" className="btn-instructor">
              Instructor
            </Link>
          )}
          <button className="btn-cerrar-sesion" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <div className="perfil-hero">
        <h1>
          {esInstructor
            ? `Panel del instructor, ${usuario?.nombre?.split(" ")[0]}`
            : `Hola, ${usuario?.nombre?.split(" ")[0]}`}
        </h1>
        <p>
          {esInstructor
            ? "Gestiona tus cursos, revisa estudiantes y define horarios."
            : "¿Qué te gustaría aprender hoy? Elige un curso y comienza tu próximo gran proyecto."}
        </p>

        {!esInstructor && (
          <div className="nivel-filtros">
            {["Todos", "Basico", "Intermedio", "Avanzado"].map((n) => (
              <button
                key={n}
                className={`filtro-btn ${filtroNivel === n ? "activo" : ""}`}
                onClick={() => setFiltroNivel(n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===================== CONTENIDO ===================== */}
      <div className="perfil-content">
      <Link to="/editar-perfil" className="btn-editar-perfil">
  Editar perfil
</Link>
        {esInstructor ? (
          /* ========== VISTA INSTRUCTOR ========== */
          <>
            {/* Métricas */}
            <div className="metricas-grid">
              <div className="metrica-card">
                <div className="metrica-valor">{cursosInstructor.length}</div>
                <div className="metrica-label">Mis cursos</div>
                <div className="metrica-desc">Cursos que dictas</div>
              </div>
              <div className="metrica-card">
                <div className="metrica-valor">{totalInscritos}</div>
                <div className="metrica-label">Estudiantes</div>
                <div className="metrica-desc">Total inscritos</div>
              </div>
              <div className="metrica-card metrica-ingresos">
                <div className="metrica-valor">
                  ${ingresosTotales.toLocaleString("es-CO")}
                </div>
                <div className="metrica-label">Ingresos</div>
                <div className="metrica-desc">Por tus cursos</div>
              </div>
            </div>

            {/* Mis cursos que dicta */}
            <div className="cursos-seccion">
              <div className="cursos-titulo-row">
                <h2>Mis cursos (los que dictas)</h2>
                <Link to="/crear-curso" className="btn-primario">
                  + Crear curso
                </Link>
              </div>

              {cursosInstructor.length === 0 ? (
                <div className="sin-cursos">
                  Aún no has creado ningún curso.
                  <br />
                  <Link to="/crear-curso">Crear tu primer curso →</Link>
                </div>
              ) : (
                <div className="cursos-grid">
                  {cursosInstructor.map((curso) => (
                    <div key={curso._id} className="curso-card instructor-card">
                      <div className="curso-card-header">
                        <span
                          className={`badge badge-${curso.nivel?.toLowerCase()}`}
                        >
                          {curso.nivel}
                        </span>
                        <span
                          className={`estado-badge estado-${curso.estado?.toLowerCase()}`}
                        >
                          {curso.estado}
                        </span>
                      </div>

                      <h3 className="curso-titulo">{curso.titulo}</h3>
                      <p className="curso-desc">
                        {curso.descripcion?.slice(0, 90)}...
                      </p>

                      {curso.horario?.dias?.length > 0 && (
                        <div className="horario-mini">
                          📅 {curso.horario.dias.join(", ")} ·{" "}
                          {curso.horario.hora_inicio} - {curso.horario.hora_fin}
                        </div>
                      )}

                      <div className="curso-stats">
                        <div>
                          <strong>{curso.total_inscritos || 0}</strong>
                          <span>Inscritos</span>
                        </div>
                        <div>
                          <strong>
                            $
                            {(curso.ingresos_totales || 0).toLocaleString(
                              "es-CO"
                            )}
                          </strong>
                          <span>Ingresos</span>
                        </div>
                        <div>
                          <strong>{curso.cupos_disponibles}</strong>
                          <span>Cupos</span>
                        </div>
                      </div>

                      <Link
                        to="/panel-instructor"
                        className="btn-ver-estudiantes"
                        style={{
                          display: "block",
                          textAlign: "center",
                          textDecoration: "none",
                        }}
                      >
                        Ver estudiantes, notas y horario
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* ========== VISTA ESTUDIANTE ========== */
          <>
            {/* Info del perfil */}
            <div className="perfil-info-card">
              <div className="perfil-avatar">
                {(usuario?.nombre || "U")[0].toUpperCase()}
              </div>
              <div className="perfil-datos">
                <h2>{usuario?.nombre}</h2>
                <p>{usuario?.email}</p>
                <span className="perfil-rol">{usuario?.rol}</span>
              </div>
            </div>

            {/* Cursos disponibles */}
            <div className="cursos-seccion">
              <div className="cursos-titulo-row">
                <h2>Cursos disponibles</h2>
                <span className="cursos-count">
                  {cursosFiltrados.length} cursos
                </span>
              </div>

              {cursosFiltrados.length === 0 ? (
                <div className="sin-cursos">
                  No hay cursos para este nivel.
                </div>
              ) : (
                <div className="cursos-grid">
                  {cursosFiltrados.map((curso) => (
                    <div key={curso._id} className="curso-card">
                      <div className="curso-card-header">
                        <span className={`badge ${badgeColor(curso.nivel)}`}>
                          {curso.nivel?.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="curso-nombre">{curso.titulo}</h3>
                      <p className="curso-desc">
                        {curso.descripcion?.slice(0, 90)}...
                      </p>
                      <div className="curso-meta">
                        <span>{curso.duracion_horas}h</span>
                        <span>{curso.cupos_disponibles} cupos</span>
                        <span>Por {curso.instructor}</span>
                      </div>
                      <div className="curso-footer">
                        <span className="curso-precio">
                          ${(curso.precio || 0).toLocaleString("es-CO")}
                        </span>
                        <button
                          className="btn-agregar"
                          onClick={() => handleAgregarAlCarrito(curso._id)}
                          disabled={agregando[curso._id]}
                        >
                          {agregando[curso._id]
                            ? "Agregando..."
                            : "Agregar a suscripción"}
                        </button>
                      </div>
                      {mensajes[curso._id] && (
                        <div
                          className={`msg-curso ${mensajes[curso._id].tipo}`}
                        >
                          {mensajes[curso._id].texto}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Acciones rápidas */}
            <div className="acciones-rapidas">
              <h2>Acciones rápidas</h2>
              <div className="acciones-grid">
                <Link to="/carrito" className="accion-card">
                  <span className="accion-num">01</span>
                  <div>
                    <strong>Mi suscripción</strong>
                    <p>Cursos que estás por adquirir</p>
                  </div>
                </Link>
                <Link to="/mis-cursos" className="accion-card">
                  <span className="accion-num">02</span>
                  <div>
                    <strong>Mis cursos</strong>
                    <p>Continúa donde lo dejaste</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="perfil-footer">
        © 2026 Escuela Café — SENA ADSO
      </footer>
    </div>
  );
}

export default Perfil;