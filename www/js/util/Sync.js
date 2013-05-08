
define(['socket.io', 'backbone'], function(){
    
    /** 
        This module handle every syncing task
        @exports Sync
        @namespace
    */
    var Sync = {
        /**
         * Socket.io's this.socket object used to dialog with the server. 
         */
        socket: io.connect('/'),
        
        /**
         * Method one can use to override default backbone's sync.
         * Every sync action will go through the socket and not the HTTP crud api.
         * Although, the format is similar and still uses model's "path" property :   
         *    
         *     create   → 'create:path'   
         *     read     → 'read:path'   , { id }   
         *     update   → 'update:path' , { id, model }   
         *     delete   → 'delete:path' , { id }   
         *   
         * The server has to respond with the ack callback for the create 
         * and read events to send the response back.
         * 
         * 
         * @param {String}  method  : CRUD method to perform
         * @param {Model}   model   : Target model on which to perform the action
         * @param {Hash}    options : User defined options
         *
         * @example <caption>Overriding backbone's sync</caption>
         *  var Sync = require('util/Sync');
         *  Backbone.sync = Sync.sync;
         *
         * @example <caption>Server crud API</caption>
         *  io.sockets.on('connection', function (socket) {
         *      socket.on('create:myModel', function (data, ack) {
         *          // Do stuff to save the model
         *
         *          //Sends the new id to the client
         *          ack({id: newId});
         *      }).on('update:myModel', function(data){
         *          // Save new data
         *      }).on('delete:widget', function(id){
         *          // Remove the model
         *      }).on('read:myModel', function(data, ack){
         *          if(data.id){
         *             //fetch a model with specified id
         *          } else {
         *              //fetch the collection
         *          }
         *
         *          ack(data);
         *      });
         *  });
         */
        sync: function(method, model, options){
            switch(method){
                case 'create':
                    Sync.socket.emit('create:'+model.url, model.toJSON(), function(data){
                        console.log(data);
                        model.set(data);
                        
                        if(options.success) options.success(data);
                    });
                    break;
                case 'update':
                
                    Sync.socket.emit('update:'+model.url, {id: model.id, model: model.toJSON()}, function(data){
                        if(options.success) options.success(data);
                    });

                    break;
                case 'delete':
                    
                    Sync.socket.emit('delete:'+model.url, model.id, function(data){
                        if(options.success) options.success(data);
                    });
                    
                    console.log('deleting');
                    break;
                case 'read':
                    var sendData = {};
                    
                    if(model) sendData.id = model.id;
                    
                    Sync.socket.emit('read:'+model.url, sendData, function(data){
                        if(options.success) options.success(data);
                    });
                    
                    console.log('reading');
                    break;
            }
        },
    
        /**
         * Attaches all events handler to the model so that it is synced with the server at all times.
         * 
         * @private
         */
        makeLive: function(model){
        
            var applyLive = $.proxy(function(){
                console.log("subscribing to :"+model.url+"_"+model.id);
                model.on('change', function(model, option){
                    console.log("changed : "+model.url+" !");
                    if(!option.remote)
                        model.save();
                });
                this.socket.on('update:'+model.url+'_'+model.id, function(data){
                    console.log("server updated client data : "+model.id);
                    console.log(data);
                    for(var i in data){
                        model.set(i, data[i], {remote: true});
                    }
                })
                .once('delete:'+model.url+'_'+model.id, function(){
                    console.log("deleting :"+model.id);
                    model.destroy({remote: true});
                });
                
                model.off('change', notifyChanged);
                // In case some changes occured before sync
                if(hasChanged){
                    console.log("model has presync changes");
                    model.save();
                }
            }, this);
            
            var hasChanged = false;
            function notifyChanged(){
                hasChanged = true;
            }
            
            console.log("making live : "+model.url);
            
            if(typeof model.id === 'undefined'){
                // Enables auto sync
                model.once('sync', applyLive);
                
                model.on('change', notifyChanged);
            } else {
                applyLive();
            }
            model.once('destroy', $.proxy(this.onModelDestroy, this));
        },
        
        unmakeLive: function(model){
            
            this.socket.removeAllListeners('update:'+model.url+'_'+model.id)
                .removeAllListeners('delete:'+model.url+'_'+model.id);
        },
    
        /**
         * Handler for model's destroy event
         *
         * @private
         */
        onModelDestroy: function(model, coll, options){
            this.unmakeLive(model);
        },
        
        /**
         * Enables the server to create objects in the given collection using the given name.
         * @param {String} name : name used by the server to push models in the collection
         *
         * @param {Collection} collection : collection in which to create the models.
         */
        makeFactory: function(name, collection){
            // Server pushing widgets
            Sync.socket.on('create:'+name, $.proxy(function(data){
                var model = collection.create(data);
                model.trigger('sync', model);
            }, this));
        }
    };
    
    /**
     * Base class for synced model. These models are synced with the server at all times. 
     * When an attribute is set, the server is notified and the server can push modification to it.
     *
     * @example
     *  var Sync = require('util/Sync');
     *  var MySyncedModel = Sync.Model.extends({
     *      defaults: ...
     *      initialize: ...
     *  });
     *
     */
    Sync.Model = Backbone.Model.extend({
        constructor: function(){
            Backbone.Model.apply(this, arguments);
            
            Sync.makeLive(this);
        },
        
        idAttribute: '_id'
    });
    
    Sync.createModel = function(model, data){
        var ret = new model(data);
        return ret;
    };
    
    Sync.Model.extend = Backbone.Model.extend;
    
    return Sync;
});