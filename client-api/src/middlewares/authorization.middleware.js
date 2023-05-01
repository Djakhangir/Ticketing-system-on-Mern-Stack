const { verifyAccessJWT } = require("../helpers/jwt.helper")
const { getJWT, deleteJWT } = require("../helpers/redis.helper")

const userAuthorization = async(req, res, next) => {
    const { authorization } = req.headers

    //verify if jwt is valid
    const decoded = await verifyAccessJWT(authorization);

    if (decoded.email) {
        const userId = await getJWT(authorization)
        if (!userId) {
            return res.status(403).json({ message: 'Forbidden' })
        }
        req.userId = userId;

        return next();
    }
    deleteJWT(authorization);
    return res.status(403).json({ message: 'Forbidden due to User Authorization' })
}

module.exports = {
    userAuthorization
}