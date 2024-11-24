const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");


// async function startServer() {
//     try {
//         await MongoDB.connect(config.db.uri);
//         console.log("Connected to the database!");

//         const PORT = config.app.port;
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}.`);
//         });
//     } catch (error) {
//         console.log("Cannot connect to the database!", error);
//         process.exit();
//     }
// }

// startServer();

const http = require('http');
const { init } = require('./socket.io'); // Import phương thức khởi tạo socket.io

// Tạo server HTTP với Express app
const server = http.createServer(app);

// Khởi tạo WebSocket server
init(server);

// Khởi động server WebSocket và Express
async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        console.log("Connected to database!");

        const PORT = config.app.port;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Cannot connect to the database", error);
        process.exit();
    }
}

startServer();