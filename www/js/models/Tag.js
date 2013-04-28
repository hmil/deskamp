define(['backbone'], function() {
	return Backbone.Model.extend({
		defaults: {
			x: 0, 
			y: 0, 
			name: "Default tag name title"
		}
	});
});