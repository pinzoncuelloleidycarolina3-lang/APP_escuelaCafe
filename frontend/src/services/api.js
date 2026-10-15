import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Interceptor: agrega el token automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ AUTENTICACIÓN ============
export const registro = (data) => api.post("/auth/registro", data);

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  localStorage.setItem("usuario", JSON.stringify(data.usuario));
  return data;
};

export const perfil = async () => {
  const { data } = await api.get("/auth/perfil");
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

// ============ CURSOS ============
export const listarCursos = async () => {
  const { data } = await api.get("/cursos");
  return data;
};

export const obtenerCurso = async (id) => {
  const { data } = await api.get(`/cursos/${id}`);
  return data;
};

export const crearCurso = async (cursoData) => {
  const { data } = await api.post("/cursos", cursoData);
  return data;
};
export const misCursosComoInstructor = async () => {
  const { data } = await api.get("/cursos/mis-cursos");
  return data;
};

export const estudiantesDelCurso = async (cursoId) => {
  const { data } = await api.get(`/cursos/${cursoId}/estudiantes`);
  return data;
};


// ============ CARRITO ============
export const verCarrito = async () => {
  const { data } = await api.get("/carrito");
  return data;
};

export const agregarAlCarrito = async (curso_id) => {
  const { data } = await api.post("/carrito/agregar", { curso_id });
  return data;
};


export const checkout = async () => {
  const { data } = await api.post("/carrito/checkout");
  return data;
};

export const misInscripciones = async () => {
  const { data } = await api.get("/carrito/inscripciones");
  return data;
};

export const quitarDelCarrito = async (itemId) => {
  const { data } = await api.delete(`/carrito/${itemId}`);
  return data;
};


export default api;