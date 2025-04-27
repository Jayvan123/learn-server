const { rateLimit} = require('express-rate-limit');

const generateLimiter = rateLimit({
    windowMs: 1* 60 * 1000, 
    max: 1,
    message: (req, res) => {
        return res.json({ message: "Limit exceeded"})
    },
    standardHeaders: true, 
    legacyHeaders: false, 
})

module.exports = { generateLimiter}