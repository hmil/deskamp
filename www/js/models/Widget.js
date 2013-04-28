define(['backbone'], function() {
	return Backbone.Model.extend({
		
		defaults: {
			coords: "0 0", 
			title: "Default widget title"
		}, 

		initialize: function() {

		}
	})
});