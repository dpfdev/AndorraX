import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';

const CARPETA_FOTOS = './imagenes'; // O la ruta a tu carpeta
const URL_API = 'http://localhost:3000/api/imagenes/subir-migracion';
const DB_CONFIG = { host: "localhost", user: "root", password: "", database: "vacaciones" };

const limpiar = (t) => t?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") || "";

async function iniciar() {
    const db = await mysql.createConnection(DB_CONFIG);
    const [hoteles] = await db.query("SELECT id_hotel as id, nombre FROM hoteles");
    const [actividades] = await db.query("SELECT id_actividad as id, nombre FROM actividades");
    const [eventos] = await db.query("SELECT id_evento as id, nombre FROM eventos");

    const leerArchivos = (dir) => {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) results = results.concat(leerArchivos(fullPath));
            else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) results.push(fullPath);
        });
        return results;
    };

    const fotos = leerArchivos(CARPETA_FOTOS);
    console.log(`🚀 Procesando ${fotos.length} imágenes...`);

    for (const ruta of fotos) {
        const nombreImg = path.basename(ruta, path.extname(ruta));
        const nombreLimpioImg = limpiar(nombreImg);
        
        let pool = [], tipo = "";
        if (ruta.toLowerCase().includes('hotel') || nombreLimpioImg.includes('hotel')) { tipo = "hotel"; pool = hoteles; }
        else if (ruta.toLowerCase().includes('actividad') || nombreLimpioImg.includes('ski') || nombreLimpioImg.includes('ruta')) { tipo = "actividad"; pool = actividades; }
        else { tipo = "evento"; pool = eventos; }

        // BÚSQUEDA AGRESIVA:
        const encontrado = pool.find(item => {
            const nDB = limpiar(item.nombre);
            return nDB.includes(nombreLimpioImg) || nombreLimpioImg.includes(nDB) || nDB.startsWith(nombreLimpioImg.substring(0, 5));
        });

        if (encontrado) {
            const form = new FormData();
            form.append('foto', fs.createReadStream(ruta));
            form.append('tipo_objeto', tipo);
            form.append('id_objeto', encontrado.id);

            try {
                await axios.post(URL_API, form, { headers: form.getHeaders() });
                console.log(`✅ OK: ${nombreImg} -> ${encontrado.nombre}`);
            } catch (err) {
                console.log(`❌ ERROR 500 en ${nombreImg}. Mira la consola del BACKEND.`);
            }
        } else {
            console.log(`⚠️  Sin coincidencia: ${nombreImg}`);
        }
    }
    process.exit();
}

iniciar();