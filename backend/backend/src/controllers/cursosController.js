const Curso = require("../models/Curso");

// GET /api/cursos — listar cursos publicados (HU-06)
const listarCursos = async (req, res) => {
  try {
    const { nivel, buscar, page = 1 } = req.query;
    const porPagina = 10;

    // Construir filtro
    const filtro = { estado: "Publicado" };

    if (nivel) {
      filtro.nivel = nivel;
    }

    if (buscar) {
      filtro.titulo = { $regex: buscar, $options: "i" };
    }

    const total = await Curso.countDocuments(filtro);
    const inicio = (page - 1) * porPagina;

    const cursos = await Curso.find(filtro)
      .skip(inicio)
      .limit(porPagina)
      .sort({ created_at: -1 });

    res.json({
      total,
      pagina: parseInt(page),
      cursos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// GET /api/cursos/:id — detalle de un curso (HU-06)
const obtenerCurso = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
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
const crearCurso = async (req, res) => {
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

    const nuevoCurso = new Curso({
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
    });

    await nuevoCurso.save();

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
const editarCurso = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Solo el instructor dueño o un admin puede editar
    if (
      curso.instructor_id.toString() !== req.usuario.id &&
      req.usuario.rol !== "Admin"
    ) {
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

    await curso.save();

    res.json({ message: "Curso actualizado correctamente", curso });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// DELETE /api/cursos/:id — archivar curso (HU-05)
const archivarCurso = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    curso.estado = "Archivado";
    await curso.save();

    res.json({ message: "Curso archivado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// POST /api/cursos/:id/modulos — agregar módulo (HU-07)
const agregarModulo = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    if (
      curso.instructor_id.toString() !== req.usuario.id &&
      req.usuario.rol !== "Admin"
    ) {
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

    const nuevoModulo = {
      titulo,
      orden: curso.modulos.length + 1,
      lecciones: [],
    };

    curso.modulos.push(nuevoModulo);
    await curso.save();

    res.status(201).json({
      message: "Módulo agregado correctamente",
      modulo: curso.modulos[curso.modulos.length - 1],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// POST /api/cursos/:id/modulos/:moduloId/lecciones — agregar lección (HU-07)
const agregarLeccion = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    const modulo = curso.modulos.id(req.params.moduloId);
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

    const nuevaLeccion = {
      titulo,
      tipo,
      contenido_url: contenido_url || null,
      orden: modulo.lecciones.length + 1,
    };

    modulo.lecciones.push(nuevaLeccion);
    await curso.save();

    res.status(201).json({
      message: "Lección agregada correctamente",
      leccion: modulo.lecciones[modulo.lecciones.length - 1],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

module.exports = {
  listarCursos,
  obtenerCurso,
  crearCurso,
  editarCurso,
  archivarCurso,
  agregarModulo,
  agregarLeccion,
};