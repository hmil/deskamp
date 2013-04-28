define(['text!/templates/widget.jst', '/js/models/Widget.js', 'backbone'], function(WidgetTemplate, Widget) {
	return Backbone.View.extend({
		events: {
			"click .widget_delete_button": "onDelete",
            "mouseenter .widget_container": "onMouseenter",
            "mouseleave .widget_container": "onMouseleave",
            "mousedown": "preventProp"
		},
        
        preventProp: function(evt){
            evt.stopPropagation();
        },
       
		initialize: function(params) {
			if(!this.model) {
				this.model = new Widget();
				app.widgets.add(this.model);
                this.model.save();
			}
            
            this.isDragged = false;

			// !\ NO INSTANCE should be passed as 'wrapped', only object
			this.wrapped = params.wrapped;
			this.xPos = params.x || 0;
			this.yPos = params.y || 0;

			this.template = _.template(WidgetTemplate);

			_.bindAll(this, 'render', 'onDelete', 'updatePosition', 'onMouseenter', 'onMouseleave', 'onDragStart');
            
            this.render();
		}, 

		onDelete: function() {
			this.$el.remove();
			if(this.wrapped.remove) {
				this.wrapped.remove();
			}
			
            app.widgets.remove(this.model);
            this.model.destroy();
		},

		updatePosition: function(event, ui) {
            this.isDragged = false;
			this.model.set('coords', ui.position.left+' '+ui.position.top);
		},

		render: function() {
			this.$el.html(this.template());

			var wrappedView = new this.wrapped({
				el: this.$('.widget_content')
			});
			wrappedView.render();

			var width = (wrappedView.defaultSize) ? wrappedView.defaultSize.width : 200;
			var height = (wrappedView.defaultSize) ? wrappedView.defaultSize.height : 300;

			this.$el.width(width);
			this.$el.height(height);
			this.$el.css('position', 'absolute');
			this.$el.offset({
				top: this.yPos, 
				left: this.xPos
			});

			this.$el.draggable({
				handle: ".widget_header",
                start: this.onDragStart,
				stop: this.updatePosition
			});

			if(wrappedView.resizable === true) {
				this.$el.resizable();
			}
            
            this.controls = this.$('.widget_controls');
            
            this.controlsShown = false;
		},
        
        onMouseenter: function(){
            if(!this.controlsShown) {
                this.controls.fadeIn({
                    duration: 'fast',
                    complete: $.proxy(function(){
                        this.controlsShown = true;
                    }, this)
                });
            }
        },
        
        onMouseleave: function(){
            if(this.controlsShown && !this.isDragged) {
                this.controls.fadeOut({
                    duration: 'fast',
                    complete: $.proxy(function(){
                        this.controlsShown = false;
                    }, this)
                });
            }
        },
        
        onDragStart: function(){
            this.isDragged = true;
        }
	});
});

