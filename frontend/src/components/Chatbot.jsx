import { useState, useRef, useEffect } from "react";
import {
  misCursosComoInstructor,
  misInscripciones,
} from "../services/api";
import "./Chatbot.css";

// ==================== LÓGICA DE RESPUESTAS ====================
function getRespuesta(mensaje, contexto) {
  const texto = mensaje.toLowerCase().trim();
  const {
    esInstructor,
    nombre,
    totalCursos,
    totalInscritos,
    totalInscripciones,
  } = contexto;

  // === SALUDOS ===
  if (/^(hola|buenas|hey|hi|qué tal|que tal|saludos)/.test(texto)) {
    const saludos = [
      `¡Hola, ${nombre}! ¿En qué te puedo ayudar hoy?`,
      `¡Buenas, ${nombre}! ¿Qué necesitas?`,
      `¡Hola de nuevo, ${nombre}! Cuéntame en qué te ayudo.`,
    ];
    return saludos[Math.floor(Math.random() * saludos.length)];
  }

  // === AGRADECIMIENTOS ===
  if (/(gracias|graciaz|thanks|te agradezco)/.test(texto)) {
    const agradecimientos = [
      `¡Con gusto, ${nombre}! ¿Necesitas algo más?`,
      `¡Un placer ayudarte, ${nombre}!`,
      "¡De nada! Aquí estoy si necesitas algo más.",
    ];
    return agradecimientos[Math.floor(Math.random() * agradecimientos.length)];
  }

  // === DESPEDIDAS ===
  if (/(adiós|adios|chao|bye|hasta luego|nos vemos)/.test(texto)) {
    return `¡Hasta luego, ${nombre}! Que tengas un excelente día.`;
  }

  // === FECHA Y HORA ===
  if (/(qué hora|que hora|hora es|fecha|día es|que dia)/.test(texto)) {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const hora = ahora.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `Hoy es ${fecha} y son las ${hora}.`;
  }

  // === ¿QUIÉN SOY? ===
  if (/(quién soy|quien soy|mi nombre|mi rol|mi correo)/.test(texto)) {
    return `Eres ${nombre}${esInstructor ? " (Instructor)" : ""}. ¿Necesitas cambiar tus datos? Ve a "Editar perfil".`;
  }

  // === ESTADÍSTICAS DEL INSTRUCTOR ===
  if (
    esInstructor &&
    /(cuántos cursos|cuantos cursos|mis cursos|total cursos)/.test(texto)
  ) {
    return `Actualmente tienes ${totalCursos} curso(s) creado(s). Puedes verlos en el "Panel instructor".`;
  }

  if (
    esInstructor &&
    /(cuántos estudiantes|cuantos estudiantes|inscritos|total estudiantes)/.test(
      texto
    )
  ) {
    return `Tienes ${totalInscritos} estudiante(s) inscrito(s) en total en todos tus cursos.`;
  }

  // === ESTADÍSTICAS DEL ESTUDIANTE ===
  if (
    !esInstructor &&
    /(cuántos cursos|cuantos cursos|mis cursos|total cursos|inscripciones)/.test(
      texto
    )
  ) {
    return `Estás inscrito en ${totalInscripciones} curso(s). Puedes verlos en la sección "Mis cursos".`;
  }

  // === AYUDA GENERAL ===
  if (/(ayuda|help|qué puedes hacer|que puedes hacer|qué haces)/.test(texto)) {
    if (esInstructor) {
      return `Puedo ayudarte con:\n• Crear y publicar cursos\n• Definir horarios\n• Ver estudiantes inscritos\n• Poner notas y progreso\n• Editar tu perfil\n• Problemas técnicos\n\n¿Qué necesitas?`;
    }
    return `Puedo ayudarte con:\n• Inscribirte a cursos\n• Ver tus horarios\n• Consultar tus notas\n• Gestionar tu suscripción\n• Editar tu perfil\n\n¿Qué necesitas?`;
  }

  // === PREGUNTAS FRECUENTES INSTRUCTOR ===
  if (esInstructor) {
    if (/(crear.*curso|nuevo curso|publicar)/.test(texto)) {
      return `Para crear un curso:\n1. Ve a "Crear curso" (arriba en la navbar)\n2. Completa título, descripción, nivel y precio\n3. Guarda\n4. Luego edítalo y cambia el estado a "Publicado" para que aparezca en el catálogo.`;
    }
    if (/(horario|días|dias|hora clase)/.test(texto)) {
      return `Para definir un horario:\n1. Entra al "Panel instructor"\n2. En cada curso haz clic en "Horario"\n3. Selecciona días, hora inicio/fin, modalidad y lugar\n4. Guarda los cambios.`;
    }
    if (/(nota|calificar|progreso)/.test(texto)) {
      return `Para poner notas:\n1. En el Panel instructor haz clic en "Ver estudiantes"\n2. Busca al estudiante\n3. Haz clic en "Editar nota"\n4. Ingresa la nota (0-5), el progreso (%) y observaciones\n5. Guarda.`;
    }
    if (/(error|no funciona|problema|falla|bug)/.test(texto)) {
      return `Si algo no funciona:\n1. Recarga con Ctrl + Shift + R\n2. Verifica que el backend esté corriendo\n3. Revisa la consola del navegador (F12)\n4. Si el token expiró, vuelve a iniciar sesión.`;
    }
  }

  // === PREGUNTAS FRECUENTES ESTUDIANTE ===
  if (!esInstructor) {
    if (/(inscribir|suscripción|suscribir|comprar|agregar)/.test(texto)) {
      return `Para inscribirte a un curso:\n1. Ve a "Inicio"\n2. Elige el curso que te guste\n3. Haz clic en "Agregar a suscripción"\n4. Ve a "Suscripción" y haz clic en "Suscribirme ahora".`;
    }
    if (/(horario|días|dias|hora clase)/.test(texto)) {
      return `Puedes ver el horario de tus cursos en "Mis cursos". Ahí aparece el día, hora y modalidad.`;
    }
    if (/(nota|calificación|progreso)/.test(texto)) {
      return `Tus notas y progreso los ves en "Mis cursos". El instructor es quien las actualiza.`;
    }
    if (/(pago|precio|costo|pagar)/.test(texto)) {
      return `Los precios aparecen en el catálogo. Al agregar a suscripción y confirmar, se registra tu inscripción.`;
    }
  }

  // === RESPUESTA POR DEFECTO ===
  if (esInstructor) {
    return `No estoy seguro de entender, ${nombre}. Puedes preguntarme sobre:\n• Crear cursos\n• Horarios\n• Notas\n• Estudiantes inscritos\n• Problemas técnicos\n\n¿Puedes reformular tu pregunta?`;
  }
  return `No estoy seguro de entender, ${nombre}. Puedes preguntarme sobre:\n• Inscripciones\n• Horarios\n• Notas\n• Pagos\n• Editar perfil\n\n¿Puedes reformular tu pregunta?`;
}

// ==================== COMPONENTE ====================
function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [contexto, setContexto] = useState({
    esInstructor: false,
    nombre: "amig@",
    totalCursos: 0,
    totalInscritos: 0,
    totalInscripciones: 0,
  });
  const chatBodyRef = useRef(null);

  // Cargar contexto del usuario
  useEffect(() => {
    const cargarContexto = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        const esInstructor =
          usuario?.rol === "Instructor" || usuario?.rol === "Admin";
        const nombre = usuario?.nombre?.split(" ")[0] || "amig@";

        let totalCursos = 0;
        let totalInscritos = 0;
        let totalInscripciones = 0;

        if (esInstructor) {
          try {
            const data = await misCursosComoInstructor();
            totalCursos = data.total_cursos || 0;
            totalInscritos = (data.cursos || []).reduce(
              (acc, c) => acc + (c.total_inscritos || 0),
              0
            );
          } catch (e) {
            // Silencioso
          }
        } else {
          try {
            const data = await misInscripciones();
            totalInscripciones = data.total || 0;
          } catch (e) {
            // Silencioso
          }
        }

        setContexto({
          esInstructor,
          nombre,
          totalCursos,
          totalInscritos,
          totalInscripciones,
        });

        setMensajes([
          {
            tipo: "bot",
            texto: esInstructor
              ? `¡Hola, ${nombre}! Soy tu asistente técnico. Puedo ayudarte con cursos, horarios, notas o problemas. ¿Qué necesitas?`
              : `¡Hola, ${nombre}! Soy el asistente de Escuela Café. Puedo ayudarte con inscripciones, horarios, notas y más. ¿En qué te ayudo?`,
          },
        ]);
      } catch (error) {
        console.error("Error cargando contexto del chatbot:", error);
      }
    };

    cargarContexto();
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [mensajes, abierto]);

  const enviarMensaje = (textoManual) => {
    const texto = (textoManual || input).trim();
    if (!texto) return;

    setMensajes((prev) => [...prev, { tipo: "user", texto }]);
    setInput("");

    setTimeout(() => {
      const respuesta = getRespuesta(texto, contexto);
      setMensajes((prev) => [...prev, { tipo: "bot", texto: respuesta }]);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") enviarMensaje();
  };

  // Preguntas rápidas según rol
  const preguntasRapidas = contexto.esInstructor
    ? [
        "¿Cuántos estudiantes tengo?",
        "¿Cómo creo un curso?",
        "¿Cómo pongo una nota?",
        "¿Qué hora es?",
      ]
    : [
        "¿Cómo me inscribo?",
        "¿Cuántos cursos tengo?",
        "¿Dónde veo mi horario?",
        "¿Qué hora es?",
      ];

  return (
    <>
      {!abierto && (
        <button
          className="chatbot-bubble"
          onClick={() => setAbierto(true)}
          aria-label="Abrir chat"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="chatbot-dot"></span>
        </button>
      )}

      {abierto && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">EC</div>
              <div>
                <h4>
                  {contexto.esInstructor
                    ? "Asistente Técnico"
                    : "Asistente Escuela Café"}
                </h4>
                <span className="chatbot-status">En línea</span>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setAbierto(false)}
            >
              ×
            </button>
          </div>

          <div className="chatbot-body" ref={chatBodyRef}>
            {mensajes.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-msg ${msg.tipo === "bot" ? "bot" : "user"}`}
              >
                <p style={{ whiteSpace: "pre-line" }}>{msg.texto}</p>
              </div>
            ))}
          </div>

          {mensajes.length <= 2 && (
            <div className="chatbot-rapidas">
              {preguntasRapidas.map((p) => (
                <button key={p} onClick={() => enviarMensaje(p)}>
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={() => enviarMensaje()} aria-label="Enviar">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;