import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import db from '../config/db.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/subir-migracion', upload.single('foto'), async (req, res) => {
    let connection;
    try {
        const { tipo_objeto, id_objeto } = req.body;
        if (!req.file) return res.status(400).send("No hay archivo");

        // Guardamos la ruta limpia sin 'undefinedes'
        const urlImagen = `/uploads/${req.file.filename}`;
        
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [resImg] = await connection.query(
            "INSERT INTO imagenes (tipo_objeto, id_objeto, url, descripcion, fecha_subida) VALUES (?, ?, ?, ?, NOW())",
            [tipo_objeto, id_objeto, urlImagen, `Imagen de ${tipo_objeto} ${id_objeto}`]
        );
        
        const id_imagen = resImg.insertId;
        const tablaIntermedia = `imagenes_${tipo_objeto}es`;
        const colRelacion = `id_${tipo_objeto}`;

        await connection.query(
            `INSERT INTO ${tablaIntermedia} (id_imagen, ${colRelacion}) VALUES (?, ?)`,
            [id_imagen, id_objeto]
        );

        await connection.commit();
        res.json({ success: true, url: urlImagen });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) connection.release();
    }
});

export default router;