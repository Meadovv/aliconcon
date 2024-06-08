const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('./database/mongoose');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*"
    }
});

const orderModel = require('./models/order.model');

io.on('connection', (socket) => {

    console.log('client connected: ' + socket.id);

    socket.emit('connected', 'Connected to server with id: ' + socket.id);

    socket.on('invoice', async (invoiceId) => {
        if(!invoiceMap.has(invoiceId)) {
            invoiceMap.set(invoiceId, []);
        }
        invoiceMap.get(invoiceId).push(socket.id);
    });

    socket.on('disconnect', () => {
        invoiceMap.delete(socket.id);
        console.log('client disconnected: ' + socket.id);
    });
});

const invoiceMap = new Map();
const nameMap = new Map();

app.post('/api/v1/get', async (req, res) => {
    const { invoiceId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return res.status(400).send('Invalid order ID');
    }
    const foundOrder = await orderModel.findById(invoiceId).lean();
    if (!foundOrder) {
        return res.status(404).send({
            success: false,
            message: 'Order not found',
        });
    }
    const name = 'ALI_' + generateRandomString(8);
    nameMap.set(name, invoiceId);
    return res.status(200).json({
        ...foundOrder, name
    });
})

app.post('/api/v1/verify', async (req, res) => {
    const { name } = req.body;
    const invoiceId = nameMap.get(name);
    if(!invoiceId) {
        return res.status(404).send('Order not found');
    }
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return res.status(400).send('Invalid order ID');
    }
    const foundOrder = await orderModel.findById(invoiceId).lean();
    if (!foundOrder) {
        return res.status(404).send('Order not found');
    }
    if (foundOrder.paid) {
        return res.status(400).send('Order already paid');
    }
    await orderModel.findByIdAndUpdate(invoiceId, {
        paid: 1,
    });
    const clients = invoiceMap.get(invoiceId);
    clients?.forEach(client => {
        const clientSocket = io.sockets.sockets.get(client);
        if (clientSocket) clientSocket.emit('verified', 'Payment successful: ' + invoiceId);
    });
    invoiceMap.delete(invoiceId);
    return res.status(200).send('Payment successful');
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}