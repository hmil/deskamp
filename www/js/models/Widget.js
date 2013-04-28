define(['backbone'], function() {
	return Backbone.Model.extend({
		url: "widget",
		
		defaults: {
			coords: "0 0", 
			contents: '{}'
        }, 

		initialize: function() {

		}
	})
});