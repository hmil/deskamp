define(['text!/templates/widget.jst','backbone'], function(WidgetTemplate) {
	return Backbone.View.extend({
		events: {
			"click .widget_delete_button": "delete"
		},
		initialize: function(params) {
			// !\ NO INSTANCE should be passed as 'wrapped', only object
			this.wrapped = params.wrapped;

			this.template = _.template(WidgetTemplate);

			_.bindAll(this, 'render', 'delete');
            
            this.render();
		}, 

		delete: function() {
			this.model.destroy();
		},

		render: function() {
			this.$el.html(this.template());

			var wrappedView = new this.wrapped({
				el: this.$('.widget_content')
			});
			wrappedView.render();

			this.$el.draggable();
			this.$el.resizable();
		}
	});
});

