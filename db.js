import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost', // Cambia esto si tu base de datos está en otro host
  user: 'root', // Reemplaza con tu usuario de MySQL
  password: '', // Reemplaza con tu contraseña de MySQL
  database: 'cantantes_db',
});

export default db;