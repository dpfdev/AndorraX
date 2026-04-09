export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Para que tú lo veas en la consola
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
        detalle: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};