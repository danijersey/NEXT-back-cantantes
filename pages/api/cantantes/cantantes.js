// import db from '../db';
import Cors from 'cors';
import db from '../../../db';
// Inicializa CORS
const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: 'http://localhost:3001', // Permitir solicitudes desde el frontend
    credentials: true // Permitir credenciales si es necesario
});

// Función para ejecutar el middleware de CORS
const runCors = (req, res) => {
    return new Promise((resolve, reject) => {
        cors(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
};

export default async function handler(req, res) {
    // Ejecuta CORS
    await runCors(req, res);

    switch (req.method) {
        case 'GET':
            // Listar todos los cantantes
            try {
                const [cantantes] = await db.query('SELECT * FROM cantantes');
                res.status(200).json(cantantes);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error al obtener los cantantes' });
            }
            break;
        case 'POST':
            // Crear un nuevo cantante
            const { nombre, edad, genero, pais } = req.body;
            try {
                const [result] = await db.query('INSERT INTO cantantes (nombre, edad, genero, pais) VALUES (?, ?, ?)', [nombre, edad, genero,pais]);
                res.status(201).json({ id: result.insertId, nombre, edad, genero, pais });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error al crear el cantante' });
            }
            break;
        case 'PUT':
            // Actualizar un cantante existente
            const { id, ...rest } = req.body;
            try {
                await db.query('UPDATE cantantes SET ? WHERE id = ?', [rest, id]);
                res.status(200).json({ id, ...rest });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error al actualizar el cantante' });
            }
            break;
        case 'DELETE':
            // Eliminar un cantante por su ID
            try {
                await db.query('DELETE FROM cantantes WHERE id = ?', [req.query.id]);
                res.status(204).end();
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error al eliminar el cantante' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Método ${req.method} no permitido`);
    }
}
