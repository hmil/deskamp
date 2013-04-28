

define(function(){
    return function(socket){
        var Sync = {
            sync: function(method, model, options){
                
                switch(method){
                    case 'create':
                        
                        console.log("emitting : create:"+model.url());
                        socket.emit('create:'+model.url(), model.toJSON());
                        
                        console.log('creating');
                        Sync.makeLive(model);
                        break;
                    case 'update':
                        
                        socket.emit('update:'+model.url(), model.toJSON());
                        
                        console.log('updating');
                        break;
                    case 'delete':
                        
                        socket.emit('delete:'+model.url(), model.toJSON());
                        
                        Sync.unmakeLive(model);
                        console.log('deleting');
                        break;
                    case 'read':
                        
                        socket.emit('read:'+model.url());
                        
                        console.log('reading');
                        break;
                }
            },
        
            makeLive: function(model){
                console.log(model);
                for(var i in model.attributes){
                    model.on('change:'+i, (function(attr){
                        return function(model, value, option){
                            Backbone.sync('update', {
                                url: model.url(),
                                toJSON: function(){ return this.attributes;},
                                attributes: _.pick(model.toJSON(), attr)
                            });
                        };
                    })(i));
                }
                model.on('destroy', function(){ Backbone.sync('delete', model); });
                
                model.once('sync', function(){
                    socket.on('update:'+model.url()+'_'+model.id, function(model){
                        console.log("server updated client data :");
                        console.log(model);
                    });
                });
            },
            
            unmakeLive: function(model){
                model.off();
                socket.removeAllListeners('update:'+model.url()+'_'+model.id);
            }
        };
        
        return Sync;
    };
});