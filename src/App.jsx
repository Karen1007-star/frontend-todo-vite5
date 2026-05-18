import { useEffect, useState } from "react";
const api = "https://backend-todo-tareas4.onrender.com/tareas"
export default function App() {

  const [tarea, setTarea] = useState("");
  const [tareas, setTareas] = useState([]);
  const [buscar, setBuscar] = useState("");

  // =========================
  // OBTENER TAREAS
  // =========================
  useEffect(() => {
    obtenerTareas();
  }, []);

  async function obtenerTareas() {
    const res = await fetch(api);
    const data = await res.json();
    setTareas(data);
  }

  // =========================
  // AGREGAR
  // =========================
  async function agregar() {
    if (tarea.trim() === "") return;

    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tarea: tarea
      })
    });

    const nuevaTarea = await res.json();

    setTareas([...tareas, nuevaTarea]);
    setTarea("");
  }

  // =========================
  // ELIMINAR
  // =========================
  async function eliminar(id) {
    await fetch(`${api}/${id}`, {
      method: "DELETE"
    });

    setTareas(tareas.filter(t => t.id !== id));
  }

  // =========================
  // EDITAR
  // =========================
  async function editar(id, actual) {
    const nuevo = prompt("Editar tarea", actual);

    if (!nuevo || nuevo.trim() === "") return;

    await fetch(`${api}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tarea: nuevo
      })
    });

    setTareas(
      tareas.map(t =>
        t.id === id ? { ...t, tarea: nuevo } : t
      )
    );
  }

  // =========================
  // FILTRAR BÚSQUEDA
  // =========================
  const tareasFiltradas = tareas.filter(t =>
    t.tarea.toLowerCase().includes(buscar.toLowerCase())
  );

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: "20px" }}>

      <h1>TODO LIST</h1>

      <input
        value={tarea}
        onChange={(e) => setTarea(e.target.value)}
        placeholder="Nueva tarea"
      />

      <button onClick={agregar}>Agregar</button>

      <br /><br />

      <input
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        placeholder="Buscar"
      />

      <ul>
        {tareasFiltradas.map((t) => (
          <li key={t.id}>
            {t.tarea + " "} 

            <button onClick={() => eliminar(t.id)}>
              🗑️
            </button>

            <button onClick={() => editar(t.id, t.tarea)}>
              ✏️
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
}