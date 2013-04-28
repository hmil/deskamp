

define(function(){
    return {
        create: function(socket){
        
            var sync = function(method, model, options){
                
                switch(method){
                    case 'create':
                        
                        socket.emit('create:'+model.url, model.toJSON());
                        
                        console.log('creating');
                        makeLive(model);
                        break;
                    case 'update':
                        
                        socket.emit('update:'+model.url, model.toJSON());
                        
                        console.log('updating');
                        break;
                    case 'delete':
                        
                        socket.emit('delete:'+model.url, model.toJSON());
                        
                        unmakeLive(model);
                        console.log('deleting');
                        break;
                    case 'read':
                        
                        socket.emit('read:'+model.url);
                        
                        console.log('reading');
                        break;
                }
            };
            
            function makeLive(model){
                console.log(model);
                for(var i in model.attributes){
                    model.on('change:'+i, (function(attr){
                        return function(model, value, option){
                            sync('update', {
                                url: model.url,
                                toJSON: function(){ return this.attributes;},
                                attributes: _.pick(model.toJSON(), attr)
                            });
                        };
                    })(i));
                }
                model.on('destroy', function(){ sync('delete', model); });
            }
            
            function unmakeLive(model){
                model.off();
            }
            
            return sync;
        }
    };
});