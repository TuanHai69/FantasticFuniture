const socketIo = require('socket.io');

let io;

function init(server) {
    io = socketIo(server, {
        cors: {
            origin: [
                'http://localhost:3001', // Frontend Client
            ],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A client has connected via WebSocket');

        socket.on('disconnect', () => {
            console.log('A client has disconnected');
        });
    });
}

function emitEvent(event, data) {
    if (io) {
        io.emit(event, data);
    } else {
        console.log('WebSocket is not initialized yet');
    }
}

module.exports = { init, emitEvent };

