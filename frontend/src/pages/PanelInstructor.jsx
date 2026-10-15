import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  perfil,
  misCursosComoInstructor,
  estudiantesDelCurso,
  actualizarHorario,
  actualizarNota,
  logout,
} from "../services/api";
import "./PanelInstructor.css";
import Chatbot from "../components/Chatbot";

function PanelInstructor() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState("cursos"); // "cursos" | "estudiantes" | "horario"
  const [editandoNota, setEditandoNota] = useState(null);
  const [notaForm, setNotaForm] = useState({
    nota: "",
    progreso: "",
    observaciones: "",
  });
  const [horarioForm, setHorarioForm] = useState({
    dias: [],
    hora_inicio: "",
    hora_fin: "",
    modalidad: "Virtual",
    lugar: "",
  });
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [perfilData, dataInstructor] = await Promise.all([
        perfil(),
        misCursosComoInstructor(),
      ]);
      setUsuario(perfilData);
      setCursos(dataInstructor.cursos || []);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setCargando(false);
    }
  };

  const handleVerEstudiantes = async (curso) => {
    try {
      const data = await estudiantesDelCurso(curso._id);
      setEstudiantes(data.estudiantes || []);
      setCursoSeleccionado({ ...data.curso, ...curso });
      setVista("estudiantes");
    } catch (error) {
      alert(error.response?.data?.message || "Error al cargar estudiantes");
    }
  };

  const handleEditarHorario = (curso) => {
    setCursoSeleccionado(curso);
    setHorarioForm({
      dias: curso.horario?.dias || [],
      hora_inicio: curso.horario?.hora_inicio || "",
      hora_fin: curso.horario?.hora_fin || "",
      modalidad: curso.horario?.modalidad || "Virtual",
      lugar: curso.horario?.lugar || "",
    });
    setVista("horario");
  };

  const toggleDia = (dia) => {
    setHorarioForm((prev) => {
      const existe = prev.dias.includes(dia);
      return {
        ...prev,
        dias: existe
          ? prev.dias.filter((d) => d !== dia)
          : [...prev.dias, dia],
      };
    });
  };

  const guardarHorario = async () => {
    try {
      await actualizarHorario(cursoSeleccionado._id, horarioForm);
      setMensaje({ tipo: "exito", texto: "Horario guardado correctamente" });

      setCursos((prev) =>
        prev.map((c) =>
          c._id === cursoSeleccionado._id
            ? { ...c, horario: { ...horarioForm } }
            : c
        )
      );

      setTimeout(() => {
        setMensaje(null);
        setVista("cursos");
      }, 1500);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || "Error al guardar horario",
      });
    }
  };

  const abrirEditarNota = (est) => {
    setEditandoNota(est._id);
    setNotaForm({
      nota: est.nota ?? "",
      progreso: est.progreso ?? 0,
      observaciones: est.observaciones || "",
    });
  };

  const guardarNota = async (inscripcionId) => {
    try {
      await actualizarNota(cursoSeleccionado._id, inscripcionId, {
        nota: notaForm.nota === "" ? null : Number(notaForm.nota),
        progreso: Number(notaForm.progreso),
        observaciones: notaForm.observaciones,
      });

      setEstudiantes((prev) =>
        prev.map((e) =>
          e._id === inscripcionId
            ? {
                ...e,
                nota: notaForm.nota === "" ? null : Number(notaForm.nota),
                progreso: Number(notaForm.progreso),
                observaciones: notaForm.observaciones,
              }
            : e
        )
      );
      setEditandoNota(null);
      setMensaje({ tipo: "exito", texto: "Nota actualizada" });
      setTimeout(() => setMensaje(null), 2000);
    } catch (error) {
      alert(error.response?.data?.message || "Error al guardar nota");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalInscritos = cursos.reduce(
    (acc, c) => acc + (c.total_inscritos || 0),
    0
  );
  const ingresosTotales = cursos.reduce(
    (acc, c) => acc + (c.ingresos_totales || 0),
    0
  );

  if (cargando) {
    return (
      <div className="perfil-loading">
        <div className="spinner"></div>
        <p>Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className="perfil-wrapper">
      {/* NAVBAR */}
      <nav className="perfil-navbar">
        <div className="navbar-logo">
          <span className="logo-icon">EC</span>
          <span className="logo-text">Escuela Café</span>
          <Chatbot />
        </div>
        <div className="navbar-links">
          <Link to="/perfil">Inicio</Link>
          <Link to="/crear-curso">Crear curso</Link>
          <Link to="/panel-instructor" className="activo">
            Panel instructor
          </Link>
        </div>
        <div className="navbar-right">
          <span className="navbar-rol">{usuario?.rol}</span>
          <button className="btn-cerrar-sesion" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="perfil-hero">
        <h1>Panel del instructor, {usuario?.nombre?.split(" ")[0]}</h1>
        <p>Gestiona tus cursos, revisa tus estudiantes y define horarios.</p>
      </div>

      <div className="perfil-content">
        {mensaje && (
          <div className={`perfil-mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        {/* MÉTRICAS */}
        <div className="metricas-grid">
          <div className="metrica-card">
            <div className="metrica-valor">{cursos.length}</div>
            <div className="metrica-label">Cursos activos</div>
            <div className="metrica-desc">Cursos que has creado</div>
          </div>
          <div className="metrica-card">
            <div className="metrica-valor">{totalInscritos}</div>
            <div className="metrica-label">Estudiantes</div>
            <div className="metrica-desc">Personas inscritas en total</div>
          </div>
          <div className="metrica-card metrica-ingresos">
            <div className="metrica-valor">
              ${ingresosTotales.toLocaleString("es-CO")}
            </div>
            <div className="metrica-label">Ingresos</div>
            <div className="metrica-desc">Ingresos por tus cursos</div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs-instructor">
          <button
            className={vista === "cursos" ? "tab activo" : "tab"}
            onClick={() => setVista("cursos")}
          >
            Mis cursos
          </button>
          {cursoSeleccionado && vista !== "cursos" && (
            <button className="tab activo">
              {vista === "estudiantes"
                ? `Estudiantes — ${cursoSeleccionado.titulo}`
                : `Horario — ${cursoSeleccionado.titulo}`}
            </button>
          )}
        </div>

        {/* ========== VISTA CURSOS ========== */}
        {vista === "cursos" && (
          <div className="cursos-seccion">
            <div className="cursos-titulo-row">
              <h2>Mis cursos</h2>
              <Link to="/crear-curso" className="btn-primario">
                + Crear nuevo curso
              </Link>
            </div>

            {cursos.length === 0 ? (
              <div className="sin-cursos">Aún no has creado ningún curso.</div>
            ) : (
              <div className="cursos-grid">
                {cursos.map((curso) => (
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

                    <h3>{curso.titulo}</h3>
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

                    <div className="botones-curso">
                      <button
                        className="btn-ver-estudiantes"
                        onClick={() => handleVerEstudiantes(curso)}
                      >
                        Ver estudiantes
                      </button>
                      <button
                        className="btn-horario"
                        onClick={() => handleEditarHorario(curso)}
                      >
                        Horario
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========== VISTA ESTUDIANTES + NOTAS ========== */}
        {vista === "estudiantes" && cursoSeleccionado && (
          <div className="estudiantes-seccion">
            <button
              className="btn-volver"
              onClick={() => {
                setVista("cursos");
                setEstudiantes(null);
                setCursoSeleccionado(null);
              }}
            >
              ← Volver a mis cursos
            </button>

            <h2>Estudiantes — {cursoSeleccionado.titulo}</h2>

            {estudiantes?.length === 0 ? (
              <div className="sin-cursos">
                Aún no hay estudiantes inscritos en este curso.
              </div>
            ) : (
              <div className="tabla-container">
                <table className="tabla-estudiantes">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Progreso</th>
                      <th>Nota</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantes.map((est) => (
                      <tr key={est._id}>
                        <td>{est.nombre}</td>
                        <td>{est.email}</td>
                        <td>
                          {editandoNota === est._id ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={notaForm.progreso}
                              onChange={(e) =>
                                setNotaForm({
                                  ...notaForm,
                                  progreso: e.target.value,
                                })
                              }
                              className="input-nota"
                            />
                          ) : (
                            <div className="progreso-bar">
                              <div
                                className="progreso-fill"
                                style={{
                                  width: `${est.progreso || 0}%`,
                                }}
                              ></div>
                              <span>{est.progreso || 0}%</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {editandoNota === est._id ? (
                            <input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={notaForm.nota}
                              onChange={(e) =>
                                setNotaForm({
                                  ...notaForm,
                                  nota: e.target.value,
                                })
                              }
                              className="input-nota"
                              placeholder="0.0 - 5.0"
                            />
                          ) : est.nota != null ? (
                            <strong>{Number(est.nota).toFixed(1)}</strong>
                          ) : (
                            <span className="sin-nota">Sin nota</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge-estado ${est.estado?.toLowerCase()}`}
                          >
                            {est.estado}
                          </span>
                        </td>
                        <td>
                          {editandoNota === est._id ? (
                            <div className="acciones-nota">
                              <button
                                className="btn-guardar-nota"
                                onClick={() => guardarNota(est._id)}
                              >
                                Guardar
                              </button>
                              <button
                                className="btn-cancelar-nota"
                                onClick={() => setEditandoNota(null)}
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn-editar-nota"
                              onClick={() => abrirEditarNota(est)}
                            >
                              Editar nota
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========== VISTA HORARIO ========== */}
        {vista === "horario" && cursoSeleccionado && (
          <div className="estudiantes-seccion">
            <button className="btn-volver" onClick={() => setVista("cursos")}>
              ← Volver a mis cursos
            </button>

            <div className="horario-form">
              <h2>Horario — {cursoSeleccionado.titulo}</h2>

              <div className="form-group">
                <label>Días de clase</label>
                <div className="dias-grid">
                  {DIAS.map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      className={`dia-btn ${
                        horarioForm.dias.includes(dia) ? "activo" : ""
                      }`}
                      onClick={() => toggleDia(dia)}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hora inicio</label>
                  <input
                    type="time"
                    value={horarioForm.hora_inicio}
                    onChange={(e) =>
                      setHorarioForm({
                        ...horarioForm,
                        hora_inicio: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Hora fin</label>
                  <input
                    type="time"
                    value={horarioForm.hora_fin}
                    onChange={(e) =>
                      setHorarioForm({
                        ...horarioForm,
                        hora_fin: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Modalidad</label>
                  <select
                    value={horarioForm.modalidad}
                    onChange={(e) =>
                      setHorarioForm({
                        ...horarioForm,
                        modalidad: e.target.value,
                      })
                    }
                  >
                    <option value="Virtual">Virtual</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Híbrida">Híbrida</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Lugar / Link</label>
                  <input
                    type="text"
                    placeholder="Zoom, Meet, Salón 3..."
                    value={horarioForm.lugar}
                    onChange={(e) =>
                      setHorarioForm({
                        ...horarioForm,
                        lugar: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                className="btn-guardar-horario"
                onClick={guardarHorario}
              >
                Guardar horario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelInstructor;