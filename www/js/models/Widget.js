define(['backbone'], function() {
	return Backbone.Model.extend({
		url: "widget",
		
		defaults: {
			coords: "0 0", 
            size: "100 100",
			contents: '{}'
        }, 

		initialize: function() {

		}
	})
});