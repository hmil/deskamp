define(['util/Sync', 'modules', 'backbone'], function(Sync, modules) {
    
	return Sync.Model.extend({
		url: "widget",
        
		defaults: {
			coords: {
                x: 0,
                y: 0
            },
            size: {
                width: 300, 
                height: 200
            },
            contentsModelId: ''
        },
        
        initialize: function(args){
            console.log("widget initialized");
            
            if(!this.get('name')){
                throw "widget initialized without a name !";
            }
            
            _.bindAll(this, 'fetchContents', 'onDestroy', 'onContentsIdChanged');
            
            this.once('destroy', this.onDestroy);
            
            var contentsId = this.get('contentsModelId');
            // User just created the widget
            if(contentsId == ''){
                this.contentsModel = modules[this.get('name')].collection.create();
                this.contentsModel.on('change:_id', this.onContentsIdChanged);
                this.contentsModel.on('destroy', this.onContentsDestroyed);
            }
            // Widget was pushed by the server
            else {
                this.fetchContents();
            }
            
        },
        
        onContentsIdChanged: function(){
            console.log("contentsIdChanged");
            this.set('contentsModelId', this.contentsModel.id);
        },
        
        onDestroy: function(){
            if(this.contentsModel)
                this.contentsModel.destroy();
        },
        
        fetchContents: function(){
            console.log('fetching widgets contents');
            
            var coll = modules[this.get('name')].collection;
            this.contentsModel = coll.get(this.get('contentsModelId'));
            
            if(typeof this.contentsModel === 'undefined'){
                coll.once('sync', this.fetchContents);
            } else {
                this.contentsModel.on('destroy', this.onContentsDestroyed);
                this.contentsModel.on('change:_id', this.onContentsIdChanged);
                this.trigger('contentsReady', this.contentsModel);
            }
        }
	})
});