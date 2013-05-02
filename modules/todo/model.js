define(['backbone'], function(){
    
    return Backbone.Model.extend({
        
        defaults: {
            title: 'My todo list', 
            items: []
        }, 

        initialize: function() {
        	_.bindAll(this, 'addItem', 'checkItem', 'uncheckItem', 'removeItem');
        },

        addItem: function(item) {
        	this.set('items', this.get('items').concat([item]));
        }, 
        checkItem: function(itemName) {
        	 _.find(this.get('items'), function(i) {
        		return itemName == i.name;
        	}).done = true;
             this.trigger('change');
        }, 
        uncheckItem: function(itemName) {
        	 _.find(this.get('items'), function(i) {
        		return itemName == i.name;
        	}).done = false;
             this.trigger('change');
        }, 
        removeItem: function(itemName) {
        	this.set('items', _.filter(this.get('items'), function(item) {
        		return item.name != itemName;
        	}));
        }
        
    });

});