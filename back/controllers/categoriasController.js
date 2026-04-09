import db from '../config/db.js';

export const getAllCategorias = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias ORDER BY nombre ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

export const getCategoriaById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias WHERE id_categoria = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "No existe" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
};