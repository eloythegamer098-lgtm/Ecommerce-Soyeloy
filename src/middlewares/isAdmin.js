export const isAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({
            error: 'Acceso denegado. Se requieren privilegios de administrador.'
        });
    }
    next();
};
