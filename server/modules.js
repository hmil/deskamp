
var fs = require('fs');

var modulePath = 'modules/';



module.exports = function(app){
    var css = '';
    var jsFile = '';
    
    var modules = [];
    
    var nbModules = 0;
    var fetchedStyles = 0;
    var fetchedViews = 0;
    
    console.log("Please wait a few seconds for modules to load...");
    
    /* Fetches an individual module */
    function fetchModule(name){
    
        fs.readFile(modulePath+name+'/package.json', function (err, data) {
            if (err) throw err;
            
            var parsedPackage = JSON.parse(data);
            
            /* loading css */
            fs.readFile(modulePath + name +'/'+ parsedPackage.style, function(err, data){
                if(err) throw err;
                
                css += data;
                
                fetchedStyles ++;
                if(fetchedStyles == nbModules)
                    console.log("All styles fetched");
            });
            
            modules.push({
                view: '/modules/'+name+'/'+parsedPackage.view,
                name: parsedPackage.name,
                icon: '/modules/'+name+'/'+parsedPackage.icon,
                title: parsedPackage.title
            });
            
            // Counts fetched views
            fetchedViews++;
            
            // When all views are fetched
            if(fetchedViews == nbModules){
                jsFile = 'define(["';
                
                for(var i in modules){
                    jsFile += modules[i].view;
                    if(i < modules.length -1)
                        jsFile += '","';
                }
                jsFile += '"], function(';
                
                for(var i in modules){
                    jsFile += modules[i].name+'View';
                    if(i < modules.length -1)
                        jsFile += ',';
                }
                jsFile += '){';
                
                jsFile += 'return ['
                
                for(var i in modules){
                    jsFile += '{ '
                        + 'view: '+modules[i].name+'View,'
                        + 'icon: "'+modules[i].icon+'",'
                        + 'title: "'+modules[i].title+'",'
                        + 'name: "'+modules[i].name+'"'
                        +'}';
                        
                    if(i < modules.length -1)
                        jsFile += ',';
                }
                
                jsFile += ']; });';
                
                console.log("modules js ready");
            }
            
        });
        
       
    }

    // Fetch module list
    fs.readdir(modulePath, function(err, files){
        if(err) throw err;
        
        nbModules = files.length;
        
        for(var i in files){
            fetchModule(files[i]);
        }
    });
    
    
    // Serve module list
    app.get('/js/modules.js', function(req, res){
        res.set('Content-Type', 'text/javascript');
        res.send(jsFile);
    });
    
    app.get('/css/modules.css', function(req, res){
        res.set('Content-Type', 'text/css');
        res.send(css);
    });
}