var theID = 0;

module.exports = function(io){
    
    io.sockets.on('connection', function (socket) {
        socket
        .on('create:widget', function (data, ack) {
            data.id = ++theID;
            
            socket.broadcast.emit('create:widget', data);
            
            ack({id: theID});
        })
        .on('update:widget', function(data){
            socket.broadcast.emit('update:widget'+'_'+data.id, data.model);
        }).on('delete:widget', function(id){
            socket.broadcast.emit('delete:widget'+'_'+id);
        });
    });
    
};