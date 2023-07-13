//import jwt
const jwt = require('jsonwebtoken');
const { getJWT, setJWT } = require('./redis.helper')
const { storeUserRefreshJWT } = require("../model/user/User.model")

//create token
const createAccessJWT = async(email, _id) => {
    try {
        //implement token, secret code is implement through .env
        const accessJWT = await jwt.sign({ email },
            process.env.JWT_ACCESS_SECRET, { expiresIn: "3h" }
        );
        await setJWT(accessJWT, _id)

        return Promise.resolve(accessJWT);
    } catch (error) {
        return Promise.reject(error);
    }
}

const createRefreshJWT = async(email, _id) => {
    try {
        //implement token, secret code is implement through .env
        const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        await storeUserRefreshJWT(_id, refreshJWT);
        return Promise.resolve(refreshJWT);
    } catch (error) {
        return Promise.reject(error);
    }
};

const verifyAccessJWT = userJWT => {
    try {
        return Promise.resolve(
            jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET))
    } catch (error) {
        return Promise.resolve(error)
    }
}

const verifyRefreshJWT = userJWT => {
    try {
        return Promise.resolve(
            jwt.verify(userJWT, process.env.JWT_REFRESH_SECRET))
    } catch (error) {
        return Promise.resolve(error)
    }
}

module.exports = {
    createAccessJWT,
    createRefreshJWT,
    verifyAccessJWT,
    verifyRefreshJWT
}