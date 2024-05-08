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
    },
    imgur: {
        token: process.env.DEV_IMGUR_TOKEN
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
    },
    imgur: {
        token: process.env.PRO_IMGUR_TOKEN
    }
};

const config = { development, production };
const env = process.env.NODE_ENV || 'development';
module.exports = config[env];