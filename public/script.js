const API_URL = 'http://localhost:3000/tareas';

async function obtenerTareas() {
  const res = await fetch(API_URL);
  const tareas = await res.json();

  const lista = document.getElementById('listaTareas');
  lista.innerHTML = '';

  tareas.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
  <span style="${t.completada ? 'text-decoration: line-through; color: gray;' : ''}">
    ${t.texto}
  </span>

  <div class="acciones">
    ${!t.completada ? `<button onclick="completarTarea(${t.id})">✔️</button>` : ''}
    <button onclick="borrarTarea(${t.id})">❌</button>
  </div>
`;
    lista.appendChild(li);
  });
} // ✅ IMPORTANTE: cerrar función

async function crearTarea() {
  const input = document.getElementById('inputTarea');

  if (!input.value.trim()) {
    alert('Escribe una tarea');
    return;
  }

  await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ texto: input.value })
  });

  input.value = '';
  obtenerTareas();
}

async function completarTarea(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT'
  });

  obtenerTareas();
}

async function borrarTarea(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  obtenerTareas();
}

obtenerTareas();