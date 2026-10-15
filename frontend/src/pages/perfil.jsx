import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  perfil,
  logout,
  listarCursos,
  agregarAlCarrito,
  misCursosComoInstructor,
  estudiantesDelCurso,
} from "../services/api";
import "./Perfil.css";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosInstructor, setCursosInstructor] = useState([]);
  const [estudiantes, setEstudiantes] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [agregando, setAgregando] = useState(null);
  const [chatAbierto, setChatAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataUsuario = await perfil();
        setUsuario(dataUsuario);

        const esInstructor =
          dataUsuario.rol === "Instructor" || dataUsuario.rol === "Admin";

        if (esInstructor) {
          try {
            const dataInstructor = await misCursosComoInstructor();
            setCursosInstructor(dataInstructor.cursos || []);
          } catch (e) {
            console.warn("No se pudieron cargar cursos del instructor:", e.message);
          }
        } else {
          try {
            const dataCursos = await listarCursos();
            setCursos(dataCursos.cursos || []);
          } catch (e) {
            console.warn("No se pudieron cargar cursos:", e.message);
          }
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        navigate("/login");
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAgregarCarrito = async (cursoId) => {
    setAgregando(cursoId);
    setMensaje(null);
    try {
      await agregarAlCarrito(cursoId);
      setMensaje({
        tipo: "exito",
        texto: "Curso agregado a tu suscripción correctamente.",
      });
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      const mensajeError =
        error.response?.data?.message || "Error al agregar el curso";
      setMensaje({ tipo: "error", texto: mensajeError });
      setTimeout(() => setMensaje(null), 3000);
    } finally {
      setAgregando(null);
    }
  };

  const handleVerEstudiantes = async (cursoId) => {
    try {
      const data = await estudiantesDelCurso(cursoId);
      setEstudiantes(data.estudiantes);
      setCursoSeleccionado(data.curso);
    } catch (error) {
      alert("Error al cargar estudiantes");
    }
  };

  const cerrarEstudiantes = () => {
    setEstudiantes(null);
    setCursoSeleccionado(null);
  };

  if (cargando) {
    return (
      <div className="perfil-loading">
        <div className="spinner"></div>
        <p>Cargando tu espacio...</p>
      </div>
    );
  }

  if (!usuario) return null;

  const primerNombre = usuario.nombre.split(" ")[0];
  const esInstructor = usuario.rol === "Instructor" || usuario.rol === "Admin";

  const totalCursos = cursosInstructor.length;
  const totalEstudiantes = cursosInstructor.reduce(
    (acc, c) => acc + (c.total_inscritos || 0),
    0
  );
  const ingresosTotales = cursosInstructor.reduce(
    (acc, c) => acc + (c.ingresos_totales || 0),
    0
  );

  return (
    <div className="perfil-container">
      {/* ===== NAVBAR ===== */}
      <nav className="perfil-navbar">
        <div className="navbar-logo">
          <span className="logo-icon">EC</span>
          <span className="logo-text">Escuela Café</span>
        </div>
        <div className="navbar-links">
          <Link to="/perfil" className="activo">Inicio</Link>
          {esInstructor ? (
            <Link to="/crear-curso" className="link-instructor">
              Crear curso
            </Link>
          ) : (
            <>
              <Link to="/carrito">Suscripción</Link>
              <Link to="/mis-cursos">Mis cursos</Link>
            </>
          )}
        </div>
        <div className="navbar-user">
          <span className="navbar-rol">{usuario.rol}</span>
          <button onClick={handleLogout} className="navbar-logout">
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="perfil-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {esInstructor
              ? `Panel del instructor, ${primerNombre}`
              : `Hola, ${primerNombre}`}
          </h1>
          <p className="hero-subtitle">
            {esInstructor
              ? "Gestiona tus cursos, revisa tus estudiantes y crea nuevas clases."
              : "¿Qué te gustaría aprender hoy? Elige un curso y comienza tu próximo gran proyecto."}
          </p>

          {!esInstructor && (
            <div className="hero-filtros">
              <button className="filtro-btn activo">Todos</button>
              <button className="filtro-btn">Básico</button>
              <button className="filtro-btn">Intermedio</button>
              <button className="filtro-btn">Avanzado</button>
            </div>
          )}
        </div>
      </section>

      {mensaje && (
        <div className={`perfil-mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      {/* ============================================================ */}
      {/* ===== VISTA DEL INSTRUCTOR ===== */}
      {/* ============================================================ */}
      {esInstructor ? (
        <>
          {/* Métricas */}
          <section className="perfil-seccion">
            <div className="metricas-grid">
              <div className="metrica-card">
                <div className="metrica-label">Cursos activos</div>
                <div className="metrica-valor">{totalCursos}</div>
                <div className="metrica-desc">Cursos que has creado</div>
              </div>
              <div className="metrica-card">
                <div className="metrica-label">Estudiantes</div>
                <div className="metrica-valor">{totalEstudiantes}</div>
                <div className="metrica-desc">Personas inscritas en total</div>
              </div>
              <div className="metrica-card">
                <div className="metrica-label">Ingresos</div>
                <div className="metrica-valor">
                  ${ingresosTotales.toLocaleString("es-CO")}
                </div>
                <div className="metrica-desc">Ingresos por tus cursos</div>
              </div>
            </div>
          </section>

          {/* Botón crear curso */}
          <section className="perfil-seccion" style={{ paddingTop: 0 }}>
            <div className="panel-instructor">
              <div>
                <h3>¿Listo para enseñar algo nuevo?</h3>
                <p>Crea un curso y empieza a compartir tu conocimiento.</p>
              </div>
              <Link to="/crear-curso" className="btn-instructor">
                Crear nuevo curso
              </Link>
            </div>
          </section>

          {/* Mis cursos */}
          <section className="perfil-seccion">
            <div className="seccion-header">
              <h2>Mis cursos</h2>
            </div>

            {cursosInstructor.length === 0 ? (
              <div className="sin-cursos">
                <div className="sin-cursos-icon">--</div>
                <p>No has creado ningún curso todavía.</p>
                <span>Haz clic en "Crear nuevo curso" para empezar.</span>
              </div>
            ) : (
              <div className="cursos-grid">
                {cursosInstructor.map((curso) => (
                  <div key={curso._id} className="curso-card instructor-card">
                    <div className="curso-card-header">
                      <span className={`curso-nivel nivel-${curso.nivel?.toLowerCase()}`}>
                        {curso.nivel}
                      </span>
                      <span className={`curso-estado estado-${curso.estado?.toLowerCase()}`}>
                        {curso.estado}
                      </span>
                    </div>
                    <h3 className="curso-titulo">{curso.titulo}</h3>
                    <p className="curso-descripcion">
                      {curso.descripcion?.substring(0, 100)}...
                    </p>

                    <div className="curso-stats">
                      <div className="stat">
                        <span className="stat-valor">{curso.total_inscritos || 0}</span>
                        <span className="stat-label">Inscritos</span>
                      </div>
                      <div className="stat">
                        <span className="stat-valor">
                          ${(curso.ingresos_totales || 0).toLocaleString("es-CO")}
                        </span>
                        <span className="stat-label">Ingresos</span>
                      </div>
                      <div className="stat">
                        <span className="stat-valor">{curso.cupos_disponibles}</span>
                        <span className="stat-label">Cupos libres</span>
                      </div>
                    </div>

                    <div className="curso-footer instructor-footer">
                      <button
                        className="btn-ver-estudiantes"
                        onClick={() => handleVerEstudiantes(curso._id)}
                      >
                        Ver estudiantes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        /* ============================================================ */
        /* ===== VISTA DEL ESTUDIANTE ===== */
        /* ============================================================ */
        <>
          <section className="perfil-seccion">
            <div className="seccion-header">
              <h2>Cursos disponibles</h2>
              <Link to="/cursos" className="ver-todos">Ver todos</Link>
            </div>

            {cursos.length === 0 ? (
              <div className="sin-cursos">
                <div className="sin-cursos-icon">--</div>
                <p>Aún no hay cursos publicados.</p>
                <span>Vuelve pronto para descubrir nuevas clases.</span>
              </div>
            ) : (
              <div className="cursos-grid">
                {cursos.map((curso) => (
                  <div key={curso._id} className="curso-card">
                    <div className="curso-card-header">
                      <span className={`curso-nivel nivel-${curso.nivel?.toLowerCase()}`}>
                        {curso.nivel}
                      </span>
                    </div>
                    <h3 className="curso-titulo">{curso.titulo}</h3>
                    <p className="curso-descripcion">
                      {curso.descripcion?.substring(0, 100)}...
                    </p>
                    <div className="curso-meta">
                      <span>{curso.duracion_horas}h</span>
                      <span>{curso.cupos_disponibles} cupos</span>
                      <span>Por {curso.instructor}</span>
                    </div>
                    <div className="curso-footer">
                      <span className="curso-precio">
                        ${curso.precio?.toLocaleString("es-CO")}
                      </span>
                      <button
                        className="curso-btn"
                        onClick={() => handleAgregarCarrito(curso._id)}
                        disabled={agregando === curso._id}
                      >
                        {agregando === curso._id ? "Agregando..." : "Agregar a suscripción"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="perfil-seccion">
            <h2>Acciones rápidas</h2>
            <div className="acciones-grid">
              <Link to="/carrito" className="accion-card">
                <div className="accion-icon">01</div>
                <div>
                  <h3>Mi suscripción</h3>
                  <p>Cursos que estás por adquirir</p>
                </div>
              </Link>

              <Link to="/mis-cursos" className="accion-card">
                <div className="accion-icon">02</div>
                <div>
                  <h3>Mis cursos</h3>
                  <p>Continúa donde lo dejaste</p>
                </div>
              </Link>

              <Link to="/perfil" className="accion-card">
                <div className="accion-icon">03</div>
                <div>
                  <h3>Mi perfil</h3>
                  <p>Administra tu cuenta</p>
                </div>
              </Link>
            </div>
          </section>
        </>
      )}

      <footer className="perfil-footer">
        <p>© 2026 Escuela Café — SENA ADSO</p>
      </footer>

      {/* ===== MODAL DE ESTUDIANTES (solo instructor) ===== */}
      {estudiantes !== null && cursoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarEstudiantes}>
          <div className="modal-estudiantes" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{cursoSeleccionado.titulo}</h2>
                <p>{estudiantes.length} estudiante(s) inscrito(s)</p>
              </div>
              <button className="modal-close" onClick={cerrarEstudiantes}>×</button>
            </div>

            <div className="modal-body">
              {estudiantes.length === 0 ? (
                <div className="modal-vacio">
                  <p>Aún no hay estudiantes inscritos en este curso.</p>
                </div>
              ) : (
                <table className="tabla-estudiantes">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Fecha</th>
                      <th>Pagó</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantes.map((est) => (
                      <tr key={est._id}>
                        <td>{est.nombre}</td>
                        <td>{est.email}</td>
                        <td>
                          {new Date(est.fecha_inscripcion).toLocaleDateString("es-CO")}
                        </td>
                        <td>${est.precio_pagado?.toLocaleString("es-CO")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== CHAT FLOTANTE ===== */}
      {!chatAbierto ? (
        <button
          className="chat-bubble"
          onClick={() => setChatAbierto(true)}
          aria-label="Abrir chat"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="chat-bubble-dot"></span>
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">EC</div>
              <div>
                <h4>Asistente Escuela Café</h4>
                <span className="chat-status">En línea</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setChatAbierto(false)}>×</button>
          </div>
          <div className="chat-body">
            <div className="chat-message bot">
              <p>Hola, {primerNombre}. ¿En qué puedo ayudarte hoy?</p>
            </div>
          </div>
          <div className="chat-input-area">
            <input type="text" placeholder="Escribe un mensaje..." className="chat-input" />
            <button className="chat-send" aria-label="Enviar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;