const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());


// Base de datos
const db = new sqlite3.Database('./tareas.db');

db.run(`
  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT,
    completada INTEGER
  )
`);

// POST - crear tarea
app.post('/tareas', (req, res) => {
  const { texto } = req.body;

  db.run(
    'INSERT INTO tareas (texto, completada) VALUES (?, ?)',
    [texto, 0],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        texto,
        completada: false
      });
    }
  );
});

// GET - obtener tareas
app.get('/tareas', (req, res) => {
  db.all('SELECT * FROM tareas', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// DELETE - borrar tarea
app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.run('DELETE FROM tareas WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ mensaje: 'Tarea eliminada' });
  });
});

// PUT - completar tarea
app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.run(
    'UPDATE tareas SET completada = 1 WHERE id = ?',
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ mensaje: 'Tarea actualizada' });
    }
  );
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando :)');
});

// Arrancar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});