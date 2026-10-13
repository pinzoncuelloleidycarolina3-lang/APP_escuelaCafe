const Carrito = require("../models/Carrito");
const Inscripcion = require("../models/Inscripcion");
const Curso = require("../models/Curso");

// GET /api/carrito — ver el carrito actual
const verCarrito = async (req, res) => {
  try {
    let carrito = await Carrito.findOne({
      usuario_id: req.usuario.id,
      estado: "Activo",
    });

    if (!carrito) {
      carrito = await Carrito.create({
        usuario_id: req.usuario.id,
        items: [],
        total: 0,
      });
    }

    res.json(carrito);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// POST /api/carrito/agregar — agregar un curso al carrito
const agregarAlCarrito = async (req, res) => {
  try {
    const { curso_id } = req.body;

    if (!curso_id) {
      return res.status(400).json({ message: "El curso_id es obligatorio" });
    }

    const curso = await Curso.findById(curso_id);
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Buscar o crear carrito
    let carrito = await Carrito.findOne({
      usuario_id: req.usuario.id,
      estado: "Activo",
    });

    if (!carrito) {
      carrito = new Carrito({
        usuario_id: req.usuario.id,
        items: [],
      });
    }

    // Verificar si ya está en el carrito
    const yaExiste = carrito.items.some(
      (item) => item.curso_id.toString() === curso_id
    );

    if (yaExiste) {
      return res
        .status(400)
        .json({ message: "El curso ya está en el carrito" });
    }

    carrito.items.push({
      curso_id: curso._id,
      titulo: curso.titulo,
      precio: curso.precio,
      cantidad: 1,
    });

    await carrito.save();

    res.status(201).json({
      message: "Curso agregado al carrito",
      carrito,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// DELETE /api/carrito/:itemId — quitar un curso del carrito
const quitarDelCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({
      usuario_id: req.usuario.id,
      estado: "Activo",
    });

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    carrito.items = carrito.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await carrito.save();

    res.json({ message: "Curso removido del carrito", carrito });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// POST /api/carrito/checkout — pagar el carrito (simulado)
const checkout = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({
      usuario_id: req.usuario.id,
      estado: "Activo",
    });

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    // Crear inscripciones para cada curso
    const inscripciones = [];

    for (const item of carrito.items) {
      const curso = await Curso.findById(item.curso_id);
      if (!curso) continue;

      // Verificar si ya está inscrito
      const yaInscrito = await Inscripcion.findOne({
        usuario_id: req.usuario.id,
        curso_id: item.curso_id,
      });

      if (yaInscrito) continue;

      const inscripcion = await Inscripcion.create({
        usuario_id: req.usuario.id,
        curso_id: item.curso_id,
        titulo_curso: item.titulo,
        instructor: curso.instructor,
        precio_pagado: item.precio,
      });

      // Reducir cupo disponible
      curso.cupos_disponibles = Math.max(0, curso.cupos_disponibles - 1);
      await curso.save();

      inscripciones.push(inscripcion);
    }

    // Marcar el carrito como Pagado
    carrito.estado = "Pagado";
    await carrito.save();

    res.json({
      message: "Pago exitoso (simulado)",
      inscripciones_creadas: inscripciones.length,
      inscripciones,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// GET /api/carrito/inscripciones — ver mis cursos inscritos
const misInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find({
      usuario_id: req.usuario.id,
    }).populate("curso_id", "titulo descripcion nivel precio");

    res.json({
      total: inscripciones.length,
      inscripciones,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

module.exports = {
  verCarrito,
  agregarAlCarrito,
  quitarDelCarrito,
  checkout,
  misInscripciones,
};