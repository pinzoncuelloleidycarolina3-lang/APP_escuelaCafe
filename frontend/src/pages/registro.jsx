import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registro } from "../services/api";
import "./Registro.css";

function Registro() {
  const [rolSeleccionado, setRolSeleccionado] = useState("Estudiante");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    setCargando(true);
    try {
      // Mandamos el rol al backend
      await registro({ nombre, email, password, rol: rolSeleccionado });
      alert(`Cuenta de ${rolSeleccionado} creada exitosamente. Ahora inicia sesión.`);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      {/* Panel izquierdo - Branding */}
      <div className="registro-branding">
        <div className="registro-branding-content">
          <div className="registro-logo">EC</div>
          <h1 className="registro-branding-title">Únete a Escuela Café</h1>
          <p className="registro-branding-subtitle">
            Crea tu cuenta y empieza a aprender o enseñar.
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="registro-form-panel">
        <div className="registro-form-wrapper">
          
          <div className="registro-header">
            <h2>Crear cuenta</h2>
            <p>Selecciona tu perfil y completa tus datos</p>
          </div>

          {/* Selector de Rol */}
          <div className="rol-selector">
            <button
              type="button"
              className={`rol-btn ${rolSeleccionado === "Estudiante" ? "activo" : ""}`}
              onClick={() => setRolSeleccionado("Estudiante")}
            >
              Estudiante
            </button>
            <button
              type="button"
              className={`rol-btn ${rolSeleccionado === "Instructor" ? "activo" : ""}`}
              onClick={() => setRolSeleccionado("Instructor")}
            >
              Instructor
            </button>
          </div>

          {error && (
            <div className="registro-error">
              <span>!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="registro-form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <div className="input-wrapper">
                <input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmar">Confirmar contraseña</label>
              <div className="input-wrapper">
                <input
                  id="confirmar"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="registro-button" disabled={cargando}>
              {cargando ? "Creando cuenta..." : `Registrarme como ${rolSeleccionado}`}
            </button>
          </form>

          <div className="registro-footer">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="registro-link">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;