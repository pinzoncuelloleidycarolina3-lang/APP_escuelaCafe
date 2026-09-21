import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (!data) {
      navigate("/login");
    } else {
      setUsuario(JSON.parse(data));
    }
  }, [navigate]);

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