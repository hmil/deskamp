define(['text!/templates/widget.jst','backbone'], function(WidgetTemplate) {
	return Backbone.View.extend({
		events: {
			"click .widget_delete_button": "delete"
		},
		initialize: function(params) {
			// !\ NO INSTANCE should be passed as 'wrapped', only object
			this.wrapped = params.wrapped;
			this.xPos = params.x || 0;
			this.yPos = params.y || 0;

			this.template = _.template(WidgetTemplate);

			_.bindAll(this, 'render', 'delete');
            
            this.render();
		}, 

		delete: function() {
			this.$el.remove();
			if(this.wrapped.remove) {
				this.wrapped.remove();
			}
			console.log("Removing, but /!\\ remove() undefined in wrapped");
		},

		render: function() {
			this.$el.html(this.template());

			var wrappedView = new this.wrapped({
				el: this.$('.widget_content')
			});
			wrappedView.render();

			var width = wrappedView.defaultSize.width || 200;
			var height = wrappedView.defaultSize.height || 300;

			this.$el.width(width);
			this.$el.height(height);
			this.$el.css('position', 'absolute');
			this.$el.offset({
				top: this.yPos, 
				left: this.xPos
			});

			this.$el.draggable();
			if(wrappedView.resizable === true) {
				this.$el.resizable();
			}
		}
	});
});

