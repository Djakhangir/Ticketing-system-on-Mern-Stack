const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = plainPassword => {
    return new Promise(resolve => {
        resolve(bcrypt.hashSync(plainPassword, saltRounds))
    })
}

const comparePassword = (plainPass, passFromDB) => {
    return new Promise((resolve, reject) => {
        // Load hash from your password DB.
        bcrypt.compare(plainPass, passFromDB, function(error, result) {

            if (error) reject(error);

            resolve(result);
        });
    })
}

module.exports = { hashPassword, comparePassword };