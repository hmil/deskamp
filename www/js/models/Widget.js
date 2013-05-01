define(['backbone'], function() {
	return Backbone.Model.extend({
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
			contents: '{}'
        }
	})
});