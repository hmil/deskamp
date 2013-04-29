define(['models/Tag', 'backbone'], function(Tag) {
	return Backbone.Collection.extend({
		model: Tag
	});
});