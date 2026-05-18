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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex justify-center p-6">

      <div className="w-full max-w-xl">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-center mb-6 text-cyan-400">
          📝 TODO LIST
        </h1>

        {/* INPUT AGREGAR */}
        <div className="flex gap-2 mb-4">
          <input
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
            placeholder="Escribe una tarea..."
            className="flex-1 p-3 rounded-xl bg-slate-700 text-white outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <button
            onClick={agregar}
            className="bg-cyan-500 hover:bg-cyan-600 px-4 rounded-xl font-bold"
          >
            +
          </button>
        </div>

        {/* SEARCH */}
        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar tarea..."
          className="w-full p-3 mb-6 rounded-xl bg-slate-700 text-white outline-none focus:ring-2 focus:ring-cyan-400"
        />

        {/* LISTA */}
        <ul className="space-y-3">
          {tareasFiltradas.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center bg-slate-800 p-4 rounded-xl shadow-md hover:scale-[1.01] transition"
            >

              <span className="text-lg">{t.tarea}</span>

              <div className="flex gap-2">
                <button
                  onClick={() => editar(t.id, t.tarea)}
                  className="bg-yellow-700 hover:bg-yellow-600 px-3 py-1 rounded-lg"
                >
                  ✏️
                </button>

                <button
                  onClick={() => eliminar(t.id)}
                  className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded-lg"
                >
                  🗑️
                </button>
              </div>

            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}