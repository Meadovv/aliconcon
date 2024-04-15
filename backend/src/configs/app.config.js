'use strict'

const development = {
    databases: {
        mongodb: {
            connectString: process.env.DEV_MONGODB_URI
        },
        mysql: {
            
        }
    },
    jwt: {
        expired: process.env.DEV_JWT_EXPIRED,
    }
};

const production = {
    databases: {
        mongodb: {
            connectString: process.env.PRO_MONGODB_URI
        },
        mysql: {

        }
    },
    jwt: {
        expired: process.env.PRO_JWT_EXPIRED,
    }
};

const config = { development, production };
const env = process.env.NODE_ENV || 'development';
module.exports = config[env];