define(['util/Sync', 'modules', 'backbone'], function(Sync, modules) {
    
    function onModelSync(model){
        console.log("onModelSync : "+model.id);
        
        var contents = model.get('contentsModel');
        contents.id = model.id;
        contents.trigger('sync', contents);
    };
    
	return Sync.Model.extend({
		url: "widget",
		
        constructor: function(){
            Sync.Model.apply(this, arguments);
            
            this.on('sync', onModelSync);
        },
        
		defaults: {
			coords: {
                x: 0,
                y: 0
            }, 
            size: {
                width: 300, 
                height: 200
            },
			contentsModel: {} //TODO
        },
        
        parse: function(data){
            var ext = {};
            if(data.name){
                ext.contentsView = modules[data.name].view;
                ext.contentsModel = Sync.createModel(modules[data.name].model, {id : data.id});
            }
            return _.extend(data, ext);
        }
	})
});