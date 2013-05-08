
var mongoose = require('mongoose');

module.exports = function(io, modules){
    
    var WidgetSchema = {
        name: String,
        coords: {
            x: Number,
            y: Number
        },
        size: {
            width: Number, 
            height: Number
        },
        contentsModelId: String
    };
    
    var Model = mongoose.model('widget', WidgetSchema);
    
    io.sockets.on('connection', function (socket) {
        socket
        .on('create:widget', function (data, ack) {
            
            console.log("created a widget");
            var widget = new Model(data);
            
            widget.save(function(err){
                if(err) throw err;
                
                ack({_id: widget._id});
                socket.broadcast.emit('create:widget', widget);
            });
        })
        .on('update:widget', function(data){
            console.log("update widget");
            console.log(data);
            
            delete data.model._id;
                
            Model.update({_id: data.id}, data.model, function(err){
                if(err) throw err;
                
                socket.broadcast.emit('update:widget'+'_'+data.id, data.model);
                console.log("updated");
            });
        }).on('delete:widget', function(id, ack){
            console.log('delete widget');
            console.log(id);
            
            socket.broadcast.emit('delete:widget'+'_'+id);
            Model.remove({_id: id}, function(err){
                if(err) throw err;
                ack();
            });
        }).on('read:widget', function(data, ack){
            if(!data.id){
                Model.find(function(err, data){
                    
                    if(err) throw err;
                    
                    console.log("fetching collection :");
                    console.log(data);
                    
                    ack(data);
                });
            } else {
                // TODO
                console.log("fetching model : "+data.id);
            }
        });
        
        // Configures the modules api on this socket
        modules.populateSocket(socket);
    });
    
};