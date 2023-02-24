const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL)


client.on('error', (err) => console.log('Redis Client Error', err));
//redis://localhost:6379 - default url to access redis db
const setJWT = (key, value) => {
    return new Promise((resolve, reject) => {
        try {
            return client.set(key, value, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getJWT = (key) => {
    return new Promise((resolve, reject) => {
        try {
            client.get(key, (error, response) => {
                if (error)
                    reject(error);

                resolve(response)
            });
        } catch (error) {
            reject(error);
        }

    });

}

module.exports = {
    setJWT,
    getJWT
}