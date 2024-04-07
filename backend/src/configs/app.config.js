'use strict'

const development = {
    databases: {
        mongodb: {
            connectString: process.env.DEV_MONGODB_URI
        },
        mysql: {
            
        }
    }
};

const production = {
    databases: {
        mongodb: {
            connectString: process.env.PRO_MONGODB_URI
        },
        mysql: {

        }
    }
};

const config = { development, production };
const env = process.env.NODE_ENV || 'development';
module.exports = config[env];