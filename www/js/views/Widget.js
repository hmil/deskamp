define(['text!/templates/widget.jst'], function(WidgetTemplate) {
	return Backbone.View.extend({
		events: {
			"click .widget_delete_button": "delete"
		},
		initialize: function(params) {
			//!\ NO INSTANCE should be passed as 'wrapped', only object
			this.wrapped = params.wrapped;

			this.template = _.template(WidgetTemplate);

			this.model.on('change:title', $.proxy(function() {
				this.$('.widget_title').html(this.model.get('title'));
			}, this));

			_.bindAll(this, 'render', 'delete');
		}, 

		delete: function() {
			this.model.destroy();
		},

		render: function() {
			this.$el.html(this.template({
				widget: this.wrapped
			}));

			var wrappedView = new this.wrapped({
				el: this.$('.widget_content')
			});
			wrappedView.render();

			this.$el.draggable();
			this.$el.resizable();
		}
	});
});

