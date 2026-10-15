import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

// Respuestas para ESTUDIANTE
const RESPUESTAS_ESTUDIANTE = [
  {
    keywords: ["inscribir", "inscripción", "suscribir", "agregar", "comprar", "curso"],
    respuesta:
      "Para inscribirte a un curso:\n1. Ve a Inicio\n2. Elige el curso que te guste\n3. Haz clic en «Agregar a suscripción»\n4. Ve a Suscripción y confirma el pago.",
  },
  {
    keywords: ["horario", "hora", "días", "cuando", "clase"],
    respuesta:
      "Puedes ver el horario de tus cursos en «Mis cursos». Allí aparece el día, la hora y si es virtual o presencial.",
  },
  {
    keywords: ["nota", "calificación", "progreso", "calific"],
    respuesta:
      "Tus notas y progreso los ves en «Mis cursos». El instructor es quien las actualiza.",
  },
  {
    keywords: ["instructor", "profesor", "contacto", "hablar"],
    respuesta:
      "Puedes ver el nombre del instructor en cada curso. Pronto habrá un canal directo de contacto.",
  },
  {
    keywords: ["pago", "precio", "costo", "pagar", "dinero"],
    respuesta:
      "Los precios aparecen en el catálogo. Al agregar a suscripción y confirmar, se registra tu inscripción.",
  },
  {
    keywords: ["hola", "buenas", "hey", "saludos"],
    respuesta: "¡Hola! 👋 Soy el asistente de Escuela Café. ¿En qué te puedo ayudar?",
  },
  {
    keywords: ["gracias", "ok", "listo", "perfecto"],
    respuesta: "¡Con gusto! Si tienes otra duda, aquí estoy. 😊",
  },
  {
    keywords: ["ayuda", "duda", "pregunta", "cómo", "que"],
    respuesta:
      "Puedo ayudarte con:\n• Cómo inscribirte a un curso\n• Ver tu horario\n• Consultar tus notas\n• Información de pagos\n\n¿Qué necesitas?",
  },
];

// Respuestas para INSTRUCTOR (problemas técnicos)
const RESPUESTAS_INSTRUCTOR = [
  {
    keywords: ["crear", "nuevo curso", "publicar curso"],
    respuesta:
      "Para crear un curso:\n1. Ve a «Crear curso»\n2. Completa título, descripción, nivel y precio\n3. Guarda\n4. Luego ve al Panel y cambia el estado a «Publicado» para que aparezca en el catálogo.",
  },
  {
    keywords: ["horario", "días", "hora", "clase"],
    respuesta:
      "Para definir el horario de un curso:\n1. Entra al Panel instructor\n2. En la tarjeta del curso haz clic en «Horario»\n3. Selecciona los días, hora inicio/fin, modalidad y lugar\n4. Guarda.",
  },
  {
    keywords: ["nota", "calificar", "progreso", "estudiante"],
    respuesta:
      "Para poner notas:\n1. En el Panel instructor haz clic en «Ver estudiantes»\n2. En la tabla busca al estudiante\n3. Haz clic en «Editar nota»\n4. Ingresa la nota (0 a 5), el progreso (%) y observaciones\n5. Guarda.",
  },
  {
    keywords: ["publicar", "borrador", "estado", "visible"],
    respuesta:
      "Los cursos se crean en estado «Borrador». Para que los estudiantes los vean, debes editar el curso y cambiar el estado a «Publicado».",
  },
  {
    keywords: ["inscritos", "estudiantes", "quién", "lista"],
    respuesta:
      "En el Panel instructor, cada curso muestra cuántos inscritos tiene. Haz clic en «Ver estudiantes» para ver la lista completa con email, progreso y nota.",
  },
  {
    keywords: ["error", "no funciona", "problema", "falla", "bug"],
    respuesta:
      "Si algo no funciona:\n1. Recarga la página con Ctrl + Shift + R\n2. Verifica que el backend esté corriendo (npm run dev)\n3. Revisa la consola del navegador (F12)\n4. Confirma que el token no haya expirado (vuelve a iniciar sesión).",
  },
  {
    keywords: ["eliminar", "borrar", "archivar"],
    respuesta:
      "Actualmente puedes archivar un curso desde el backend. Pronto agregaremos el botón de eliminar/archivar directamente en el Panel.",
  },
  {
    keywords: ["hola", "buenas", "hey", "saludos"],
    respuesta:
      "¡Hola instructor! 👋 Soy tu asistente técnico de Escuela Café. ¿Qué necesitas resolver?",
  },
  {
    keywords: ["gracias", "ok", "listo", "perfecto"],
    respuesta: "¡Listo! Si tienes otro problema técnico, avísame. 🛠️",
  },
  {
    keywords: ["ayuda", "duda", "pregunta", "cómo", "que"],
    respuesta:
      "Puedo ayudarte con:\n• Crear y publicar cursos\n• Definir horarios\n• Poner notas a estudiantes\n• Ver lista de inscritos\n• Solucionar errores técnicos\n\n¿Qué necesitas?",
  },
];

function buscarRespuesta(mensaje, esInstructor) {
  const texto = mensaje.toLowerCase();
  const lista = esInstructor ? RESPUESTAS_INSTRUCTOR : RESPUESTAS_ESTUDIANTE;

  for (const item of lista) {
    if (item.keywords.some((kw) => texto.includes(kw))) {
      return item.respuesta;
    }
  }

  if (esInstructor) {
    return "No encontré una respuesta exacta. Puedes preguntarme sobre:\n• Crear/publicar cursos\n• Horarios\n• Notas y estudiantes\n• Errores técnicos\n\n¿Intentas de nuevo?";
  }

  return "No estoy seguro de entender. Puedes preguntarme sobre:\n• Inscripciones\n• Horarios\n• Notas\n• Pagos\n\n¿Intentas de nuevo?";
}

function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef(null);

  // Detectar rol del usuario
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esInstructor =
    usuario?.rol === "Instructor" || usuario?.rol === "Admin";

  useEffect(() => {
    // Mensaje inicial según el rol
    setMensajes([
      {
        tipo: "bot",
        texto: esInstructor
          ? "¡Hola instructor! 👋 Soy tu asistente técnico. ¿En qué te puedo ayudar?"
          : "¡Hola! 👋 Soy el asistente de Escuela Café. ¿En qué te puedo ayudar hoy?",
      },
    ]);
  }, [esInstructor]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [mensajes, abierto]);

  const enviarMensaje = () => {
    const texto = input.trim();
    if (!texto) return;

    setMensajes((prev) => [...prev, { tipo: "user", texto }]);
    setInput("");

    setTimeout(() => {
      const respuesta = buscarRespuesta(texto, esInstructor);
      setMensajes((prev) => [...prev, { tipo: "bot", texto: respuesta }]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") enviarMensaje();
  };

  const preguntasRapidas = esInstructor
    ? [
        "¿Cómo creo un curso?",
        "¿Cómo pongo una nota?",
        "¿Cómo defino el horario?",
      ]
    : [
        "¿Cómo me inscribo?",
        "¿Dónde veo mi horario?",
        "¿Cómo veo mis notas?",
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
                  {esInstructor
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
                <button
                  key={p}
                  onClick={() => {
                    setMensajes((prev) => [
                      ...prev,
                      { tipo: "user", texto: p },
                    ]);
                    setTimeout(() => {
                      setMensajes((prev) => [
                        ...prev,
                        {
                          tipo: "bot",
                          texto: buscarRespuesta(p, esInstructor),
                        },
                      ]);
                    }, 600);
                  }}
                >
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
            <button onClick={enviarMensaje} aria-label="Enviar">
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