import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verCarrito, quitarDelCarrito, checkout } from "../services/api";
import "./Carrito.css";

function Carrito() {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const cargarCarrito = async () => {
    try {
      const data = await verCarrito();
      setCarrito(data);
    } catch (error) {
      console.error("Error al cargar suscripción:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCarrito();
  }, []);

  const handleQuitar = async (itemId) => {
    try {
      await quitarDelCarrito(itemId);
      await cargarCarrito();
    } catch (error) {
      alert(
        "Error al quitar el curso: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCheckout = async () => {
    if (!carrito || carrito.items.length === 0) return;
    setProcesando(true);
    setMensaje(null);
    try {
      const resultado = await checkout();
      setMensaje({
        tipo: "exito",
        texto: `Suscripción exitosa. Te inscribiste en ${resultado.inscripciones_creadas} curso(s).`,
      });
      await cargarCarrito();
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || "Error al procesar la suscripción",
      });
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <div className="carrito-loading">
        <div className="spinner"></div>
        <p>Cargando tu suscripción...</p>
      </div>
    );
  }

  const items = carrito?.items || [];
  const total = carrito?.total || 0;

  return (
    <div className="carrito-container">
      {/* ===== NAVBAR ===== */}
      <nav className="carrito-navbar">
        <Link to="/perfil" className="navbar-logo">
          <span className="logo-icon">EC</span>
          <span className="logo-text">Escuela Café</span>
        </Link>
        <div className="navbar-links">
          <Link to="/perfil">Inicio</Link>
          <Link to="/carrito" className="activo">Suscripción</Link>
          <Link to="/mis-cursos">Mis cursos</Link>
        </div>
      </nav>

      <div className="carrito-content">
        <div className="carrito-header">
          <h1>Mi suscripción</h1>
          <p>{items.length} curso(s) listos para inscribirte</p>
        </div>

        {mensaje && (
          <div className={`carrito-mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        {items.length === 0 ? (
          <div className="carrito-vacio">
            <div className="carrito-vacio-icon">--</div>
            <h2>Tu suscripción está vacía</h2>
            <p>Añade cursos para inscribirte y empezar a aprender.</p>
            <Link to="/perfil" className="btn-primario">
              Explorar cursos
            </Link>
          </div>
        ) : (
          <div className="carrito-layout">
            {/* Lista de items */}
            <div className="carrito-items">
              {items.map((item) => (
                <div key={item._id} className="carrito-item">
                  <div className="item-info">
                    <h3>{item.titulo}</h3>
                    <p className="item-cantidad">
                      Cantidad: {item.cantidad}
                    </p>
                  </div>
                  <div className="item-precio">
                    ${item.precio?.toLocaleString("es-CO")}
                  </div>
                  <button
                    className="item-quitar"
                    onClick={() => handleQuitar(item._id)}
                    title="Quitar de la suscripción"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="carrito-resumen">
              <h2>Resumen de suscripción</h2>
              <div className="resumen-linea">
                <span>Subtotal</span>
                <span>${total.toLocaleString("es-CO")}</span>
              </div>
              <div className="resumen-linea">
                <span>Impuestos</span>
                <span>$0</span>
              </div>
              <div className="resumen-linea total">
                <span>Total</span>
                <span>${total.toLocaleString("es-CO")}</span>
              </div>
              <button
                className="btn-checkout"
                onClick={handleCheckout}
                disabled={procesando}
              >
                {procesando ? "Procesando..." : "Suscribirme ahora"}
              </button>
              <p className="resumen-nota">
                Al suscribirte se crearán tus inscripciones a los cursos y podrás
                acceder a ellos desde "Mis cursos".
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;