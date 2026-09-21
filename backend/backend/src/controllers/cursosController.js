// Cursos en memoria (temporal hasta conectar MySQL)
// TODO: reemplazar cada función por consultas a la BD
const cursos = [];

// GET /api/cursos — listar cursos publicados (HU-06)
const listarCursos = (req, res) => {
  try {
    const { nivel, buscar, page = 1 } = req.query;
    const porPagina = 10;

    let resultado = cursos.filter((c) => c.estado === "Publicado");

    // Filtro por nivel
    if (nivel) {
      resultado = resultado.filter((c) => c.nivel === nivel);
    }

    // Búsqueda por nombre
    if (buscar) {
      resultado = resultado.filter((c) =>
        c.titulo.toLowerCase().includes(buscar.toLowerCase())
      );
    }

    // Paginación
    const total = resultado.length;
    const inicio = (page - 1) * porPagina;
    const paginado = resultado.slice(inicio, inicio + porPagina);

    res.json({
      total,
      pagina: parseInt(page),
      cursos: paginado,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// GET /api/cursos/:id — detalle de un curso (HU-06)
const obtenerCurso = (req, res) => {
  try {
    const curso = cursos.find((c) => c.id === parseInt(req.params.id));
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    res.json(curso);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// POST /api/cursos — crear curso (HU-05)
const crearCurso = (req, res) => {
  try {
    const { titulo, descripcion, nivel, precio, duracion_horas, cupos_max } =
      req.body;

    // Validaciones
    if (!titulo || !descripcion || !nivel || precio === undefined) {
      return res.status(400).json({
        message: "Título, descripción, nivel y precio son obligatorios",
      });
    }

    const nivelesValidos = ["Basico", "Intermedio", "Avanzado"];
    if (!nivelesValidos.includes(nivel)) {
      return res.status(400).json({
        message: "Nivel inválido. Use: Basico, Intermedio o Avanzado",
      });
    }

    if (precio < 0) {
      return res
        .status(400)
        .json({ message: "El precio no puede ser negativo" });
    }

    // TODO: reemplazar por INSERT en tabla cursos
    const nuevoCurso = {
      id: cursos.length + 1,
      titulo,
      descripcion,
      nivel,
      precio: parseFloat(precio),
      duracion_horas: parseInt(duracion_horas) || 0,
      cupos_max: parseInt(cupos_max) || 20,
      cupos_disponibles: parseInt(cupos_max) || 20,
      estado: "Borrador",
      instructor_id: req.usuario.id,
      instructor: req.usuario.nombre,
      modulos: [],
      created_at: new Date().toISOString(),
    };

    cursos.push(nuevoCurso);

    res
      .status(201)
      .json({ message: "Curso creado correctamente", curso: nuevoCurso });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// PUT /api/cursos/:id — editar curso (HU-05)
const editarCurso = (req, res) => {
  try {
    const curso = cursos.find((c) => c.id === parseInt(req.params.id));
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Solo el instructor dueño o un admin puede editar
    if (curso.instructor_id !== req.usuario.id && req.usuario.rol !== "Admin") {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este curso" });
    }

    const {
      titulo,
      descripcion,
      nivel,
      precio,
      duracion_horas,
      cupos_max,
      estado,
    } = req.body;

    if (titulo) curso.titulo = titulo;
    if (descripcion) curso.descripcion = descripcion;
    if (nivel) curso.nivel = nivel;
    if (precio !== undefined) curso.precio = parseFloat(precio);
    if (duracion_horas) curso.duracion_horas = parseInt(duracion_horas);
    if (cupos_max) curso.cupos_max = parseInt(cupos_max);
    if (estado) curso.estado = estado;

    res.json({ message: "Curso actualizado correctamente", curso });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// DELETE /api/cursos/:id — archivar curso (HU-05)
const archivarCurso = (req, res) => {
  try {
    const curso = cursos.find((c) => c.id === parseInt(req.params.id));
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // TODO: reemplazar por UPDATE estado='Archivado' en BD
    curso.estado = "Archivado";

    res.json({ message: "Curso archivado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// POST /api/cursos/:id/modulos — agregar módulo (HU-07)
const agregarModulo = (req, res) => {
  try {
    const curso = cursos.find((c) => c.id === parseInt(req.params.id));
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    if (curso.instructor_id !== req.usuario.id && req.usuario.rol !== "Admin") {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este curso" });
    }

    const { titulo } = req.body;
    if (!titulo) {
      return res
        .status(400)
        .json({ message: "El título del módulo es obligatorio" });
    }

    // TODO: reemplazar por INSERT en tabla modulos
    const nuevoModulo = {
      id: curso.modulos.length + 1,
      titulo,
      orden: curso.modulos.length + 1,
      lecciones: [],
    };

    curso.modulos.push(nuevoModulo);

    res
      .status(201)
      .json({ message: "Módulo agregado correctamente", modulo: nuevoModulo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// POST /api/cursos/:id/modulos/:moduloId/lecciones — agregar lección (HU-07)
const agregarLeccion = (req, res) => {
  try {
    const curso = cursos.find((c) => c.id === parseInt(req.params.id));
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    const modulo = curso.modulos.find(
      (m) => m.id === parseInt(req.params.moduloId)
    );
    if (!modulo) {
      return res.status(404).json({ message: "Módulo no encontrado" });
    }

    const { titulo, tipo, contenido_url } = req.body;

    if (!titulo || !tipo) {
      return res
        .status(400)
        .json({ message: "Título y tipo son obligatorios" });
    }

    const tiposValidos = ["Texto", "Video", "PDF"];
    if (!tiposValidos.includes(tipo)) {
      return res
        .status(400)
        .json({ message: "Tipo inválido. Use: Texto, Video o PDF" });
    }

    // TODO: reemplazar por INSERT en tabla lecciones
    const nuevaLeccion = {
      id: modulo.lecciones.length + 1,
      titulo,
      tipo,
      contenido_url: contenido_url || null,
      orden: modulo.lecciones.length + 1,
    };

    modulo.lecciones.push(nuevaLeccion);

    res.status(201).json({
      message: "Lección agregada correctamente",
      leccion: nuevaLeccion,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

module.exports = {
  cursos,
  listarCursos,
  obtenerCurso,
  crearCurso,
  editarCurso,
  archivarCurso,
  agregarModulo,
  agregarLeccion,
};
