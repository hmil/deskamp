
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
    
    var TagSchema = {
        name: String,
        x: Number,
        y: Number
    };
    
    var Widget = mongoose.model('widget', WidgetSchema);
    var Tag = mongoose.model('tag', TagSchema);
    
    // Cleans database for tests
    Widget.remove(function(err){ if(err) throw err; });
    Tag.remove(function(err){ if(err) throw err; });
    
    io.sockets.on('connection', function (socket) {
        socket
        
        // Widget sync API
        
        .on('create:widget', function (data, ack) {
            
            console.log("created a widget");
            var widget = new Widget(data);
            
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
                
            Widget.update({_id: data.id}, data.model, function(err){
                if(err) throw err;
                
                socket.broadcast.emit('update:widget'+'_'+data.id, data.model);
                console.log("updated");
            });
        }).on('delete:widget', function(id, ack){
            console.log('delete widget');
            console.log(id);
            
            socket.broadcast.emit('delete:widget'+'_'+id);
            Widget.remove({_id: id}, function(err){
                if(err) throw err;
                ack();
            });
        }).on('read:widget', function(data, ack){
            if(!data.id){
                Widget.find(function(err, data){
                    
                    if(err) throw err;
                    
                    console.log("fetching collection :");
                    console.log(data);
                    
                    ack(data);
                });
            } else {
                // TODO
                console.log("fetching model : "+data.id);
            }
        })
        
        // Tag sync API
        
        .on('create:tags', function (data, ack) {
            
            console.log("created a tag");
            var tag = new Tag(data);
            
            tag.save(function(err){
                if(err) throw err;
                
                ack({_id: tag._id});
                socket.broadcast.emit('create:tags', tag);
            });
        })
        .on('update:tags', function(data){
            console.log("update tag");
            console.log(data);
            
            delete data.model._id;
                
            Tag.update({_id: data.id}, data.model, function(err){
                if(err) throw err;
                
                socket.broadcast.emit('update:tags'+'_'+data.id, data.model);
                console.log("updated");
            });
        }).on('delete:tags', function(id, ack){
            console.log('delete tag');
            console.log(id);
            
            socket.broadcast.emit('delete:tags'+'_'+id);
            Tag.remove({_id: id}, function(err){
                if(err) throw err;
                ack();
            });
        }).on('read:tags', function(data, ack){
            if(!data.id){
                Tag.find(function(err, data){
                    
                    if(err) throw err;
                    
                    console.log("fetching collection :");
                    console.log(data);
                    
                    ack(data);
                });
            } else {
                // TODO
                console.log("fetching tags : "+data.id);
            }
        });
        
        // Configures the modules api on this socket
        modules.populateSocket(socket);
    });
    
};