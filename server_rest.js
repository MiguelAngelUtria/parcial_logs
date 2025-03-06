require('dotenv').config(); // Carga las variables de .env
const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json()); // Permite recibir datos en formato JSON

// Configurar la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Conectar a MySQL
db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
    } else {
        console.log('✅ Conectado a MySQL');
    }
});

// 📌 Ruta para registrar un log (POST /logs)
app.post('/logs', (req, res) => {
    const { servicio, nivel, mensaje } = req.body;

    if (!servicio || !nivel || !mensaje) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const query = 'INSERT INTO logs (servicio, nivel, mensaje) VALUES (?, ?, ?)';
    db.query(query, [servicio, nivel, mensaje], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Log registrado', id: result.insertId });
    });
});

// 📌 Ruta para obtener todos los logs (GET /logs)
app.get('/logs', (req, res) => {
    const query = 'SELECT * FROM logs ORDER BY fecha DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Iniciar el servidor en el puerto definido en .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor API REST corriendo en http://localhost:${PORT}`);
});
