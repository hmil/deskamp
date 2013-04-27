define(['text!/templates/main.jst'], function(MainTemplate) {
	return Backbone.View.extend({
		initialize: function() {
			this.template = _.template(MainTemplate);

			_.bindAll(this, 'render');
		}, 

		render: function() {
			this.$el.html(this.template());
		}
	});
});