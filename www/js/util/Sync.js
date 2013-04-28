

define(function(){
    return function(socket){
        var Sync = {
            sync: function(method, model, options){
                
                switch(method){
                    case 'create':
                        
                        console.log("emitting : create:"+model.url);
                        socket.emit('create:'+model.url, model.toJSON(), $.proxy(function(ack){
                            console.log(ack);
                            model.id = ack.id;
                            
                            console.log(model);
                            
                            Sync.makeLive(model);
                        }, this));
                        console.log('creating');
                        break;
                    case 'update':
                    
                        socket.emit('update:'+model.url, {id: model.id, model: model.toJSON()});
                        
                        console.log('updating : '+model.id);
                        console.log(model);
                        break;
                    case 'delete':
                        
                        socket.emit('delete:'+model.url, model.id);
                        
                        Sync.unmakeLive(model);
                        console.log('deleting');
                        break;
                    case 'read':
                        
                        socket.emit('read:'+model.url);
                        
                        console.log('reading');
                        break;
                }
            },
        
            makeLive: function(model){
                console.log(model);
                for(var i in model.attributes){
                    model.on('change:'+i, (function(attr){
                        return function(model, value, option){
                            if(!option.remote)
                                Backbone.sync('update', model);
                        };
                    })(i));
                }
                model.on('destroy', this.onModelDestroy);
                socket.on('update:'+model.url+'_'+model.id, function(data){
                    console.log("server updated client data : "+model.id);
                    for(var i in data){
                        model.set(i, data[i], {remote: true});
                    }
                })
                .once('delete:'+model.url+'_'+model.id, function(){
                    console.log("deleting :"+model.id);
                    model.destroy({remote: true});
                });
            },
            
            unmakeLive: function(model){
                model.off('destroy', this.onModelDestroy);
                socket.removeAllListeners('update:'+model.url+'_'+model.id)
                    .removeAllListeners('delete:'+model.url+'_'+model.id);
            },
            
            onModelDestroy: function(options){ 
                if(!options.remote)
                    Backbone.sync('delete', model); 
            }
        };
        
        return Sync;
    };
});