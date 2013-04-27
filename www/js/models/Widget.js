define(['backbone'], function() {
	return Backbone.Model.extend({
		url: "widget",
		
		default: {
			x: 0, 
			y: 0, 
			title: "Default widget title"
		}, 

		initialize: function() {

		}
	})
});