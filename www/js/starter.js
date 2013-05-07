define(['modules', 'util/Sync', 'backbone'], function(modules, Sync){
    
    var started = false;
    
    return function(){
        if(started) return;
        
        for(var i in modules){
            Sync.makeFactory(i, modules[i].collection);
            
            console.log("fetching coll");
            modules[i].collection.fetch();
        }
        
        started = true;
    }
});