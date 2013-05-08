
var fs = require('fs');

var modulePath = 'modules/';

var mongoose = require('mongoose');


module.exports = function(){
    var css = '';
    var jsFile = '';
    
    var modules = [];
    
    var models = {};
    
    var nbModules = 0;
    var fetchedStyles = 0;
    var fetchedViews = 0;
    
    console.log("Please wait a few seconds for modules to load...");
    
    function onViewFetched(){
        // Counts fetched views
        fetchedViews++;
        
        // When all views are fetched
        if(fetchedViews == nbModules){
            jsFile = 'define(["';
            
            for(var i in modules){
                jsFile += modules[i].view+'", "'+modules[i].model;
                if(i < modules.length -1)
                    jsFile += '","';
            }
            jsFile += '", "backbone"], function(';
            
            for(var i in modules){
                jsFile += modules[i].name+'View, '+modules[i].name+'Model';
                if(i < modules.length -1)
                    jsFile += ', ';
            }
            jsFile += '){';
            
            jsFile += 'return {'
            
            for(var i in modules){
                jsFile += modules[i].name+': { '
                    + 'view: '+modules[i].name+'View,'
                    + 'model:'+modules[i].name+'Model,'
                    + 'collection: new (Backbone.Collection.extend({'
                    + 'model: '+modules[i].name+'Model,'
                    + 'url: "'+modules[i].name+'"})),'
                    + 'icon: "'+modules[i].icon+'",'
                    + 'title: "'+modules[i].title+'",'
                    + 'name: "'+modules[i].name+'"'
                    + '}';
                    
                if(i < modules.length -1)
                    jsFile += ',';
            }
            
            jsFile += '}; });';
            
            // Rewriting real value
            nbModules = modules.length;
            
            console.log("modules js ready");
        }
    }
    
    function onCssFetched(){
        fetchedStyles ++;
                if(fetchedStyles == nbModules)
                    console.log("All styles fetched");
    }
    
    /* Fetches an individual module */
    function fetchModule(name){
        if(/^\..*/.exec(name)){
            onViewFetched();
            onCssFetched();
            return;
        }
            
        fs.readFile(modulePath+name+'/package.json', function (err, data) {
            if (err) throw err;
            var parsedPackage = JSON.parse(data);
            
            /* loading css */
            fs.readFile(modulePath + name +'/'+ parsedPackage.style, function(err, data){
                if(err) throw err;
                
                css += data;
                
                onCssFetched();
            });
            
            modules.push({
                view: '/modules/'+name+'/'+requiredProperty(parsedPackage, 'view', name),
                model: '/modules/'+name+'/'+requiredProperty(parsedPackage, 'model', name),
                name: requiredProperty(parsedPackage, 'name', name),
                icon: '/modules/'+name+'/'+requiredProperty(parsedPackage, 'icon', name),
                title: requiredProperty(parsedPackage, 'title', name)
            });
            
            onViewFetched();
            
            models[name] = mongoose.model(name+"Module", 
                require('../modules/'+name+'/'+requiredProperty(parsedPackage, 'schema', name)));
        });
        
       
    }
    
    // Check if the required property is defined and throws an error if not
    function requiredProperty(src, prop, name){
        var ret = src[prop];
        if(typeof ret === 'undefined')
            throw prop+" is not defined in package "+name;
        return ret;
    }

    // Fetch module list
    fs.readdir(modulePath, function(err, files){
        if(err) throw err;
        
        nbModules = files.length;
        
        for(var i in files){
            fetchModule(files[i]);
        }
    });
    
    this.route = function(app){
        // Serve module list
        app.get('/js/modules.js', function(req, res){
            res.set('Content-Type', 'text/javascript');
            res.send(jsFile);
        });
        
        app.get('/css/modules.css', function(req, res){
            res.set('Content-Type', 'text/css');
            res.send(css);
        });
    };
    
    this.populateSocket = function(socket){
        function createListeners(name){
            console.log("module : "+name);
            
            socket.on('create:'+name, function(data, ack){
                console.log("created a "+name);
                
                var mod = new models[name](data);
                
                console.log(mod);
                mod.save(function(err){
                    console.log(mod);
                    if(err) throw err;
                    console.log("saved");
                    
                    console.log("created : "+mod._id);
                    ack({_id: mod._id});
                    data._id = mod._id;
                    socket.broadcast.emit('create:'+name, data);
                });
                
            }).on('read:'+name, function(data, ack){
                console.log("reading "+name+" "+data.id);
                
                if(!data.id){
                    models[name].find(function(err, data){
                        
                        if(err) throw err;
                        
                        console.log("fetching collection :");
                        console.log(data);
                        
                        ack(data);
                    });
                } else {
                    // TODO
                    console.log("fetching model : "+data.id);
                }
            }).on('update:'+name, function(data){
                console.log("updated : "+data.id);
                console.log(data);
                socket.broadcast.emit('update:'+name+'_'+data.id, data.model);
                
                delete data.model._id;
                
                models[name].update({_id: data.id}, data.model, function(err){
                    if(err) throw err;
                    
                    console.log("updated");
                });
                
            }).on('delete:'+name, function(id, ack){
                socket.broadcast.emit('delete:'+name+'_'+id);
                
                models[name].remove({_id: id}, function(err){
                    if(err) throw err;
                    ack();
                });
            });
        }
        
        for(var i = 0 ; i < nbModules ; i++){
            if(!modules[i]){
                console.log("Warning : client connected before modules were initialized !");
                return;
            }
            
            var name = modules[i].name;
            
            createListeners(name);
        }
    };
}