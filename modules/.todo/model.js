define(['core'], function(Core){
    
    return Core.Model.extend({
        
        url: 'todo',
        
        defaults: {
            title: 'My todo list', 
            items: {}
        }, 

        initialize: function() {
        	_.bindAll(this, 'addItem', 'checkItem', 'uncheckItem', 'removeItem');
        },

        addItem: function(itemName) {
            //This will create a new item
            this.setItemState(itemName, false);
        }, 
        
        checkItem: function(itemName) {
        	this.setItemState(itemName, true);
        },

        uncheckItem: function(itemName) {
        	this.setItemState(itemName, false);
        },
        
        setItemState: function(itemName, state){
            var items = _.clone(this.get('items'));
            items[itemName] = state;
            this.set('items', items);
        },
        
        removeItem: function(itemName) {
            var items = _.clone(this.get('items'));
        	delete items[itemName];
            this.set('items', items);
        }
        
    });

});