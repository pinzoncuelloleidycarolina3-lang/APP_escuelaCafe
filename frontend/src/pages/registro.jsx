import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registro } from "../services/api";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registro({ nombre, email, password });
      alert("Usuario registrado correctamente. Ahora inicia sesión.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Registro</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Contraseña (mín. 8 caracteres)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button type="submit" style={{ padding: 10 }}>
        Registrarme
      </button>
    </form>
  );
}

export default Registro;