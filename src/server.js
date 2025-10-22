const app = require('./app');
const config = require('./config');
const http = require('http');

// Creamos un servidor HTTP con express
const server = http.createServer(app);

// Iniciamos Socket.IO
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*", // Ajusta esto para mayor seguridad
        methods: ["GET", "POST"]
    }
});

// Evento de conexión
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Ejemplo: escuchar mensajes
    socket.on('mensaje', (data) => {
        console.log("Mensaje recibido:", data);

        // Responder a todos los clientes
        io.emit('mensaje', `Servidor recibió: ${data}`);
    });

    // Evento de desconexión
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

// Iniciar servidor
server.listen(config.app.port, () => {
    console.log("Servidor corriendo en puerto", config.app.port);
});

// Manejo de errores
server.on('error', (error) => {
    console.log("Error al conectar al servidor:", error);
});

// Cierre seguro
process.on('SIGINT', () => {
    console.log("Cerrando servidor");
    server.close(() => {
        console.log("Servidor cerrado");
        process.exit(0);
    });
});
