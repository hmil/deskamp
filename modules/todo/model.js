define(['backbone'], function(){
    
    return Backbone.Model.extend({
        
        defaults: {
            title: 'My todo list', 
            items: []
        }, 

        initialize: function() {
        	_.bindAll(this, 'addItem', 'checkItem', 'uncheckItem');
        },

        addItem: function(item) {
        	this.get('items').push(item);
        }, 
        checkItem: function(itemName) {
        	console.log("Checking "+itemName);
        	 _.find(this.get('items'), function(i) {
        		return itemName == i.name;
        	}).done = true;
        }, 
        uncheckItem: function(itemName) {
        	 _.find(this.get('items'), function(i) {
        		return itemName == i.name;
        	}).done = false;
        }, 
        removeItem: function(itemName) {
        	this.set('items', _.filter(this.get('items'), function(item) {
        		return item.name != itemName;
        	}));
        }
        
    });

});