// backend/backend/seed_cursos.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const Curso = require("./src/models/Curso");
const Usuario = require("./src/models/usuario");

const cursosDemo = [
  {
    titulo: "Emprendimiento Digital",
    descripcion: "Curso introductorio para crear negocios online desde cero.",
    nivel: "Basico",
    precio: 50000,
    duracion_horas: 20,
    cupos_max: 30,
  },
  {
    titulo: "Marketing Digital para Emprendedores",
    descripcion: "Aprende a promocionar tu negocio en redes sociales y atraer clientes.",
    nivel: "Basico",
    precio: 45000,
    duracion_horas: 15,
    cupos_max: 25,
  },
  {
    titulo: "Finanzas Personales y del Negocio",
    descripcion: "Administra el dinero de tu emprendimiento y toma mejores decisiones.",
    nivel: "Intermedio",
    precio: 60000,
    duracion_horas: 20,
    cupos_max: 30,
  },
  {
    titulo: "Modelo de Negocio Canvas",
    descripcion: "Diseña el modelo de negocio de tu emprendimiento con la metodología Canvas.",
    nivel: "Basico",
    precio: 35000,
    duracion_horas: 10,
    cupos_max: 40,
  },
  {
    titulo: "Atención al Cliente y Ventas",
    descripcion: "Desarrolla habilidades para cerrar ventas y fidelizar clientes.",
    nivel: "Intermedio",
    precio: 55000,
    duracion_horas: 18,
    cupos_max: 25,
  },
  {
    titulo: "Contabilidad Básica para Emprendedores",
    descripcion: "Aprende a llevar las cuentas de tu negocio sin ser contador.",
    nivel: "Basico",
    precio: 40000,
    duracion_horas: 12,
    cupos_max: 35,
  },
  {
    titulo: "Estrategias de Crecimiento Empresarial",
    descripcion: "Escala tu emprendimiento con estrategias avanzadas de negocio.",
    nivel: "Avanzado",
    precio: 85000,
    duracion_horas: 25,
    cupos_max: 20,
  },
  {
    titulo: "Innovación y Creatividad Empresarial",
    descripcion: "Desarrolla la mentalidad innovadora para crear productos y servicios únicos.",
    nivel: "Intermedio",
    precio: 65000,
    duracion_horas: 22,
    cupos_max: 30,
  },
];

async function seed() {
  try {
    console.log("🔌 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" Conectado a MongoDB\n");

    // Buscar un instructor existente
    const instructor = await Usuario.findOne({ rol: "Instructor" });
    if (!instructor) {
      console.error(" No hay usuario con rol Instructor en la BD.");
      console.error("   Cambia el rol de algún usuario a 'Instructor' y vuelve a intentarlo.");
      process.exit(1);
    }

    console.log(` Instructor asignado: ${instructor.nombre}\n`);
    console.log(" Insertando cursos:");

    let creados = 0;
    let existentes = 0;

    for (const curso of cursosDemo) {
      const yaExiste = await Curso.findOne({ titulo: curso.titulo });
      if (yaExiste) {
        console.log(`   ⏭  ${curso.titulo} (ya existe)`);
        existentes++;
      } else {
        await Curso.create({
          ...curso,
          cupos_disponibles: curso.cupos_max,
          estado: "Publicado",
          instructor_id: instructor._id,
          instructor: instructor.nombre,
          modulos: [],
        });
        console.log(`    ${curso.titulo}`);
        creados++;
      }
    }

    const total = await Curso.countDocuments();
    console.log("\n═══════════════════════════════════");
    console.log(` Cursos nuevos creados: ${creados}`);
    console.log(` Cursos ya existentes: ${existentes}`);
    console.log(` Total en la BD: ${total}`);
    console.log("═══════════════════════════════════");
    console.log(" ¡Listo!\n");

    process.exit(0);
  } catch (error) {
    console.error(" Error:", error.message);
    process.exit(1);
  }
}

seed();