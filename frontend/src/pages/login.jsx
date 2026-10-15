import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import "./Login.css";

function Login() {
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
      await login(email, password);
      navigate("/perfil");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      {/* Panel izquierdo - Branding */}
      <div className="login-branding">
        <div className="login-branding-content">
          <div className="login-logo">☕</div>
          <h1 className="login-branding-title">Escuela Café</h1>
          <p className="login-branding-subtitle">
            Aprende emprendimiento, una taza a la vez
          </p>
          <div className="login-branding-features">
            <div className="feature-item">
              <span className="feature-icon">📚</span>
              <span>Cursos de emprendimiento</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎓</span>
              <span>Diplomas al finalizar</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📅</span>
              <span>Horarios y actividades</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Bienvenido de vuelta</h2>
            <p>Ingresa a tu cuenta para continuar</p>
          </div>

          {error && (
            <div className="login-error">
              <span></span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={cargando}
            >
              {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="login-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;