


import { body, validationResult } from 'express-validator';

export function loggerDetallado(req,res,next){
    const inicio = Date.now();
    const id = Math.random().toString(36).slice(7)
    req.requestId = id
    console.log(`Request ${id} - ${req.method} ${req.url} - Inicio: ${new Date().toISOString()}`)

    res.on('finish',()=>{
        const ms = Date.now() - inicio;
        console.log(`Request ${id} ${res.statusCode} - Duracion: ${ms}ms`)
    })
    next();
}

/**
 * Middleware para validar resultados de express-validator
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        error: "Errores de validación",
        detalles: extractedErrors,
    });
};

/**
 * Reglas de validación para registro
 */
export const registroRules = [
    body('nombre').isString().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
];

/**
 * Reglas de validación para login
 */
export const loginRules = [
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
];


export function validarCampos(camposRequeridos){
    return (req,res,next) => {
        const errores = [];
        for (const campo of camposRequeridos) {
            if(!req.body[campo]) {
                errores.push(`El campo ${campo} es requerido`)
            }
        }
        if(errores.length > 0) {
            return res.status(400).json({ error:"Faltan campos requeridos", errores })
        }
        next();
    }
}


export const asynHandler = (fn) => 
    (req,res,next) => 
        fn(req,res,next).catch(next);
