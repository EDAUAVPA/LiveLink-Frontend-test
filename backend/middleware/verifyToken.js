let jwt = require("jsonwebtoken");
require('dotenv').config();
let secret = process.env.SECRET_KEY;

function verifyToken(req, res, next){
    const token = req.headers['token'];
    jwt.verify(token, secret, (err, result) => {
        if (err) {
            console.log("El error es", err);
            return res.status(401).json("El token no es válido");
        }
        next();
    });
}

module.exports = verifyToken;