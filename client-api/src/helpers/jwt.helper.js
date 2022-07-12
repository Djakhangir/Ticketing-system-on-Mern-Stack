//import jwt
const jwt = require('jsonwebtoken');

const createAccessJWT = (payload) => {
    //implement token, secret code is implement through .env
    const accessJWT = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

    return Promise.resolve(accessJWT);
}

const createRefreshJWT = (payload) => {
    //implement token, secret code is implement through .env
    const refreshJWT = jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    return Promise.resolve(refreshJWT);
}

module.exports = {
    createAccessJWT,
    createRefreshJWT
}