const { UserSchema } = require("./User.schema");

const insertUser = userObj => {
    return new Promise((resolve, reject) => {
        UserSchema(userObj).save()
            .then(data => resolve(data))
            .catch(error => reject(error))
    })
}

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {

        if (!email) return false;
        try {
            //use userSchema to do the query;
            UserSchema.findOne({ email }, (error, data) => {
                if (error) {
                    reject(error)
                }
                resolve(data)
            })
        } catch (error) {
            reject(error)
        }

    })

}

const storeUserRefreshJWT = (_id, token) => {
    return new Promise((resolve, reject) => {
        try {
            UserSchema.findOneAndUpdate({ _id }, {
                    $set: { "refreshJWT.token": token },
                    "refreshJWT.addedAt": Date.now()
                }, { new: true })
                .then(data => resolve(data))
                .catch((error) => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { insertUser, getUserByEmail, storeUserRefreshJWT };