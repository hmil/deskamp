define(['backbone'], function() {
	return Backbone.Model.extend({
		url: "widget",
		
		defaults: {
			coords: "0 0", 
            size: {
                width: 300, 
                height: 200
            },
			contents: '{}'
        }
	})
});