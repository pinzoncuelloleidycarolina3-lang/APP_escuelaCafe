import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { perfil, logout } from "../services/api";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await perfil();
        setUsuario(data);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        navigate("/login");
      } finally {
        setCargando(false);
      }
    };
    fetchPerfil();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (cargando) return <p style={{ textAlign: "center" }}>Cargando perfil...</p>;
  if (!usuario) return null;

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Bienvenido, {usuario.nombre}</h2>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Rol:</strong> {usuario.rol}</p>
      <button onClick={handleLogout} style={{ padding: 10 }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Perfil;