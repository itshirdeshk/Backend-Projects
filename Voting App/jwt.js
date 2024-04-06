const jwt = require("jsonwebtoken");
const jwtAuthMiddleware = (req, res, next) => {
    // first check request headers has auth or not
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Token not found!" });

    // Extract the jwt token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        // Verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: "Invalid token!" });
    }
};

// Function to generate JWT Token
const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 30000 });
};

module.exports = { jwtAuthMiddleware, generateToken };
