var theID = 0;

module.exports = function(io){
    
    io.sockets.on('connection', function (socket) {
        console.log("connected");
        socket
        .on('create:widget', function (data, ack) {
            data.id = ++theID;
            
            console.log("widget created");
            socket.broadcast.emit('create:widget', data);
            
            ack({id: theID});
        })
        .on('update:widget', function(data){
            console.log("changing model :"+data.id);
            socket.broadcast.emit('update:widget'+'_'+data.id, data.model);
        }).on('delete:widget', function(id){
            console.log("deleting model :"+id);
            socket.broadcast.emit('delete:widget'+'_'+id);
        });
    });
    
};