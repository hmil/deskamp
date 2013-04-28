
module.exports = function(io){
    
    io.sockets.on('connection', function (socket) {
        console.log("connected");
        socket.on('create:widget', function (data) {
            console.log("widget created");
            socket.broadcast.emit('create:widget', data);
        });
    });
    
};