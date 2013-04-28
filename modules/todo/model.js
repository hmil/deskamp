define(['backbone'], function(){
    
    return Backbone.Model.extend({
        
        defaults: {
            title: 'My todo list', 
            items: []
        }, 

        initialize: function() {
        	_.bindAll(this, 'addItem', 'checkItem');
        },

        addItem: function(item) {
        	this.get('items').push(item);
        	//console.log("Added -> "+this.items[this.items.length-1].name);
        }, 
        checkItem: function(itemName) {
        	 _.find(this.get('items'), function(i) {
        		return itemName == i.name;
        	}).done = true;
        }
        
    });

});