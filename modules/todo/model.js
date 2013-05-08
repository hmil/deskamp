define(['Core'], function(Core){
    
    return Core.Model.extend({
        
        url: 'todo',
        
        defaults: {
            title: 'My todo list', 
            items: []
        }, 

        initialize: function() {
        	_.bindAll(this, 'addItem', 'checkItem', 'uncheckItem', 'removeItem');
        },

        addItem: function(itemName) {
            
            var items = _.clone(this.get('items'));
            items.push({name: itemName, state: false});
            this.set('items', items);
            
            console.log(items);
        }, 
        
        checkItem: function(itemName) {
        	this.setItemState(itemName, true);
        },

        uncheckItem: function(itemName) {
        	this.setItemState(itemName, false);
        },
        
        setItemState: function(itemName, state){
            var items = _.clone(this.get('items'));
            
            for(var i = 0 ; i < items.length ; i++){
                if(items[i].name == itemName){
                    items[i] = {
                        name: itemName,
                        state: state
                    };
                    break;
                }
            }
            
            this.set('items', items);
        },
        
        removeItem: function(itemName) {
            var items = _.filter(this.get('items'), function(it){
                it.name = itemName;
            });
            
            this.set('items', items);
        }
        
    });

});