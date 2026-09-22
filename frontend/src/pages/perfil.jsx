import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Perfil() {
  // Leer localStorage AL INICIALIZAR el estado (una sola vez)
  const [usuario] = useState(() => {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data) : null;
  });
  const navigate = useNavigate();

  //  El efecto solo redirige si no hay usuario
  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    }
  }, [usuario, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (!usuario) return null;

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Bienvenido a Escuela Café</h2>
      <p>
        <strong>Nombre:</strong> {usuario.nombre}
      </p>
      <p>
        <strong>Email:</strong> {usuario.email}
      </p>
      <p>
        <strong>Rol:</strong> {usuario.rol}
      </p>
      <button onClick={handleLogout} style={{ padding: "10px" }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Perfil;