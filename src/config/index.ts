const dotenv = require('dotenv'); 

dotenv.config({path: '.env'});
module.exports = {
    server: {
        port: process.env.PORT 
    },
    db: {
       spamprotect: process.env.MONGODB_SRV_URI 
    },
    environment: process.env.BUILD_ENV,
    JWT_SECRET: process.env.JWT_SECRET
};
