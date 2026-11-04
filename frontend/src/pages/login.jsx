import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import "./Login.css";

function Login() {
  const [rolSeleccionado, setRolSeleccionado] = useState("Estudiante");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const data = await login(email, password);
      const rolReal = data.usuario.rol;
      const esInstructorReal = rolReal === "Instructor" || rolReal === "Admin";
      const eligioInstructor = rolSeleccionado === "Instructor";

      // Validaciones cruzadas
      if (eligioInstructor && !esInstructorReal) {
        throw new Error("Esta cuenta es de Estudiante. Cambia el perfil arriba.");
      }

      if (!eligioInstructor && esInstructorReal) {
        throw new Error("Esta cuenta es de Instructor. Cambia el perfil arriba.");
      }

      // Redirección
      if (esInstructorReal) {
        navigate("/panel-instructor");
      } else {
        navigate("/perfil");
      }
    } catch (err) {
      // Limpiamos el token si hubo error de rol
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  // Clase dinámica según el rol para cambiar colores
  const containerClass = `login-container ${
    rolSeleccionado === "Instructor" ? "theme-instructor" : "theme-estudiante"
  }`;

  return (
    <div className={containerClass}>
      
      {/* ===== PANEL IZQUIERDO (Branding Dinámico) ===== */}
      <div className="login-branding">
        <div className="branding-content">
          <div className="branding-logo">EC</div>
          
          <h1 className="branding-title">
            {rolSeleccionado === "Instructor" 
              ? "Comparte tu conocimiento" 
              : "Aprende a tu ritmo"}
          </h1>
          
          <p className="branding-subtitle">
            {rolSeleccionado === "Instructor"
              ? "Crea cursos, gestiona estudiantes y haz crecer tu comunidad en Escuela Café."
              : "Descubre cursos de emprendimiento, mira tus horarios y obtén tu diploma."}
          </p>

          <div className="branding-features">
            {rolSeleccionado === "Instructor" ? (
              <>
                <div className="feature"><span>01</span> Crea y publica cursos</div>
                <div className="feature"><span>02</span> Gestiona notas y horarios</div>
                <div className="feature"><span>03</span> Revisa tus ingresos</div>
              </>
            ) : (
              <>
                <div className="feature"><span>01</span> Explora el catálogo</div>
                <div className="feature"><span>02</span> Inscríbete fácilmente</div>
                <div className="feature"><span>03</span> Certifícate al terminar</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== PANEL DERECHO (Formulario) ===== */}
      <div className="login-form-panel">
        <div className="form-wrapper">
          
          {/* Selector de Rol */}
          <div className="role-switcher">
            <button
              type="button"
              className={`role-btn ${rolSeleccionado === "Estudiante" ? "active" : ""}`}
              onClick={() => { setRolSeleccionado("Estudiante"); setError(""); }}
            >
              Estudiante
            </button>
            <button
              type="button"
              className={`role-btn ${rolSeleccionado === "Instructor" ? "active" : ""}`}
              onClick={() => { setRolSeleccionado("Instructor"); setError(""); }}
            >
              Instructor
            </button>
          </div>

          <div className="form-header">
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus datos para acceder como {rolSeleccionado}</p>
          </div>

          {error && (
            <div className="form-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={cargando}>
              {cargando ? "Validando..." : `Entrar como ${rolSeleccionado}`}
            </button>
          </form>

          <div className="form-footer">
            <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;