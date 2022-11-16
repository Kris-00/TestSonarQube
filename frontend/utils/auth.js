const jwt = require('jsonwebtoken');
const fs = require('fs');

const verifyVendor = (token) => {
    const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY);
    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        if (decoded.role === 'Vendor') {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

const verifyAdmin = (token) => {
    const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY);
    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        if (decoded.role === 'Admin') {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};
exports.verifyVendor = verifyVendor;
exports.verifyAdmin = verifyAdmin;