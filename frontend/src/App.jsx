import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Registro from "./pages/registro";
import Perfil from "./pages/perfil";
import Carrito from "./pages/Carrito";
import CrearCursos from "./pages/CrearCursos";
import MisCursos from "./pages/MisCursos";
import PanelInstructor from "./pages/PanelInstructor"; // ← nuevo
import EditarPerfil from "./pages/EditarPerfil";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/crear-curso" element={<CrearCursos />} />
      <Route path="/mis-cursos" element={<MisCursos />} />
      <Route path="/panel-instructor" element={<PanelInstructor />} /> {/* ← nuevo */}
      <Route path="/editar-perfil" element={<EditarPerfil />} />
    </Routes>
  );
}

export default App;