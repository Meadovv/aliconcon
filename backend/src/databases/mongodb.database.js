'use strict'

const { databases: {
    mongodb: { connectString }
}} = require('../configs/app.config');
const mongoose = require('mongoose');

class Databases {

    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if(1 === 0) {
            mongoose.set('debug', true);
            mongoose.set('debug', {
                color: true
            });
        }
        mongoose.connect(connectString, {
            maxPoolSize: 100, // Maximum number of connection in the pool
        })
        .then( database => {
            console.log(`Database ${database.connection.name} connected on ${database.connection.host}:${database.connection.port}`);
        })
        .catch( error => {
            console.log('Error connecting to database', error);
        });
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new Databases();
        }
        return this.instance;
    }
}

const instanceMongodb = Databases.getInstance();
module.exports = instanceMongodb;

