import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { misInscripciones } from "../services/api";
import "./MisCursos.css";

function MisCursos() {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await misInscripciones();
        setInscripciones(data.inscripciones || []);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (cargando) {
    return (
      <div className="miscursos-loading">
        <div className="spinner"></div>
        <p>Cargando tus cursos...</p>
      </div>
    );
  }

  return (
    <div className="miscursos-container">
      <nav className="miscursos-navbar">
        <Link to="/perfil" className="navbar-logo">
          <span className="logo-icon">EC</span>
          <span className="logo-text">Escuela Café</span>
        </Link>
        <div className="navbar-links">
          <Link to="/perfil">Inicio</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/mis-cursos" className="activo">Mis cursos</Link>
        </div>
      </nav>

      <div className="miscursos-content">
        <div className="miscursos-header">
          <h1>Mis cursos</h1>
          <p>{inscripciones.length} curso(s) en tu biblioteca</p>
        </div>

        {inscripciones.length === 0 ? (
          <div className="miscursos-vacio">
            <div className="miscursos-vacio-icon">--</div>
            <h2>Aún no tienes cursos</h2>
            <p>Explora el catálogo y comienza tu primer curso.</p>
            <Link to="/perfil" className="btn-primario">Explorar cursos</Link>
          </div>
        ) : (
          <div className="miscursos-grid">
            {inscripciones.map((ins) => (
              <div key={ins._id} className="miscursos-card">
                <div className="miscursos-card-header">
                  <span className="miscursos-estado">{ins.estado}</span>
                  <span className="miscursos-fecha">
                    {new Date(ins.fecha_inscripcion).toLocaleDateString("es-CO")}
                  </span>
                </div>
                <h3>{ins.titulo_curso}</h3>
                <p className="miscursos-instructor">Por {ins.instructor}</p>
                <div className="miscursos-precio">
                  ${ins.precio_pagado?.toLocaleString("es-CO")}
                </div>
                <div className="miscursos-progreso">
                  <div className="progreso-barra">
                    <div className="progreso-fill" style={{ width: `${ins.progreso}%` }}></div>
                  </div>
                  <span>{ins.progreso}% completado</span>
                </div>
                <button className="miscursos-btn">Continuar curso</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisCursos;