//import jwt
const jwt = require('jsonwebtoken');
const { getJWT, setJWT } = require('./redis.helper')

//create token
const createAccessJWT = async(email, _id) => {
    try {
        //implement token, secret code is implement through .env
        const accessJWT = await jwt.sign({ email },
            process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' }
        );

        await setJWT(accessJWT, _id)

        return Promise.resolve(accessJWT);
    } catch (error) {
        return Promise.reject(error);
    }
}

const createRefreshJWT = (email) => {
    //implement token, secret code is implement through .env
    const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

    return Promise.resolve(refreshJWT);
}

module.exports = {
    createAccessJWT,
    createRefreshJWT
}