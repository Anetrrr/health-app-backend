const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (o, f) => {
        
        if (allowedOrigins.indexOf(o) !== -1 || !o) {
            f(null, true)
        } else {
            f(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;