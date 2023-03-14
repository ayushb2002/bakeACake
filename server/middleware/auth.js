const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    var token = req.headers.authorization.split(' ')[1];

    if(!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.data = decoded;
    } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;