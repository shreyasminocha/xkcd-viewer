function zeroPad(string, digits) {
    const zeros = Array(digits).fill('0');
    return (zeros + string).slice(-digits);
}

module.exports = zeroPad;
