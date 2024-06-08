// test commit

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middlewares
app.use(cookieParser());
app.use(morgan('dev')); // Logger
app.use(helmet()); // Security
app.use(compression()); // Compression
app.use(express.json({
    limit: '10mb'
})); // Body parser
app.use(express.urlencoded({ 
    extended: true 
})); // Body parser
app.use(cors());

// Databases
require('./databases/mongodb.database');

// Routes
app.use('/', require('./routers'));

// 404 Not Found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

// Error Handler
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    let message = error.message || 'Internal Server Error';

    // Check if error is a CastError
    if (error.name === 'CastError') {
        message = 'Invalid ID format';
    }

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
})

module.exports = app;