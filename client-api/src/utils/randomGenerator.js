const randomPinNumber = Length => {
    let pin = '';
    for (let i = 0; i < Length; i++) {
        pin += Math.floor(Math.random() * 10)

    }
    return pin;
};

module.exports = { randomPinNumber };