define(['text!/templates/widget.jst', '/js/models/Widget.js', 'backbone'], function(WidgetTemplate, Widget) {
	return Backbone.View.extend({
		events: {
			"click .widget_delete_button": "delete"
		},
		initialize: function(params) {
			if(!this.model) {
				this.model = new Widget();
				this.model.save();
			}

			// !\ NO INSTANCE should be passed as 'wrapped', only object
			this.wrapped = params.wrapped;
			this.xPos = params.x || 0;
			this.yPos = params.y || 0;

			this.template = _.template(WidgetTemplate);

			_.bindAll(this, 'render', 'delete', 'updatePosition');
            
            this.render();
		}, 

		delete: function() {
			this.$el.remove();
			if(this.wrapped.remove) {
				this.wrapped.remove();
			}
			else console.log("Removing, but /!\\ remove() undefined in wrapped");
		},

		updatePosition: function(event, ui) {
			this.model.set('x', ui.position.left);
			this.mosel.set('y', ui.position.top);
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

			this.$el.draggable({
				handle: ".widget_header",
				stop: this.updatePosition
			});

			if(wrappedView.resizable === true) {
				this.$el.resizable();
			}
		}
	});
});

