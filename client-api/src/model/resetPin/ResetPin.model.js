const { ResetPinSchema } = require("./ResetPin.schema");

const setPasswordResetPin = (email) => {
    //create random 6 digit number for the pin name
    const randomPin = 547634;
    const resetObj = {
        email,
        pin: randomPin
    }
    return new Promise((resolve, reject) => {
        ResetPinSchema(resetObj)
            .save()
            .then(data => resolve(data))
            .catch(error => reject(error))
    })
}


module.exports = { setPasswordResetPin };