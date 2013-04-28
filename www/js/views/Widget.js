define(['text!/templates/widget.jst', 'app', '/js/models/Widget.js', 'backbone', 'lib/JSON'], function(WidgetTemplate, App, Widget) {
	return Backbone.View.extend({
		events: {
			"click": "handleWidgetsFocus",
			"click .widget_delete_button": "onDelete",
            "mouseenter .widget_container": "onMouseenter",
            "mouseleave .widget_container": "onMouseleave",
            "mousedown": "preventProp"
		},
        
        preventProp: function(evt){
            evt.stopPropagation();
        },

        handleWidgetsFocus: function() {
            if(!App) App = require('app');
        	var maxzIndex = App.maxzIndex || 1;
        	this.$el.css('z-index', maxzIndex+1);
        	App.maxzIndex = maxzIndex + 1;
        },
       
		initialize: function(params) {
           
			if(!this.model) {
				this.model = new Widget();
				app.widgets.add(this.model);
                this.model.save();
			}
            
			_.bindAll(this, 'render', 'onDelete', 'updatePosition', 'onMouseenter', 'onMouseleave', 'onDragStart', 'updateCoords', 'onWrappedModelChange');
            
            this.model.on('change:coords', this.updateCoords);
            this.model.on('change:contents', this.render);
            this.isDragged = false;

			// !\ NO INSTANCE should be passed as 'wrapped', only object
			this.wrapped = this.model.get('wrappedView');
            
            this.model.on('destroy', $.proxy(function(){
                this.onDelete()
            }, this));
            
            console.log("wrapped :");
            console.log(this.wrapped);
            
			this.template = _.template(WidgetTemplate);

			_.bindAll(this, 'render', 'onDelete', 'updatePosition', 
				'onMouseenter', 'onMouseleave', 'onDragStart', 
				'handleWidgetsFocus');
            
            this.render();
		}, 
        
        updateCoords: function(){
            var c = this.model.get('coords').split(' ');
            this.$el.css({
                left: c[0],
                top: c[1]
            });
        },

		onDelete: function(evt) {
            console.log("deleting !!!");
			this.$el.remove();
			if(this.wrapped.remove) {
				this.wrapped.remove();
			}
			
            if(evt)
                this.model.destroy();
		},

		updatePosition: function(event, ui) {
            this.isDragged = false;
			this.model.set('coords', ui.position.left+' '+ui.position.top);
		},
        
        onWrappedModelChange: function(){
            this.model.set('contents', JSON.stringify(this.wrappedView.model.toJSON()));
        },

		render: function() {
			this.$el.html(this.template());

			var wrappedView = this.wrappedView = new this.wrapped({
				el: this.$('.widget_content'),
                model: JSON.parse(this.model.get('contents'))
			});
			wrappedView.render();
            
            wrappedView.model.on('change', this.onWrappedModelChange);
            
            
			var width = (wrappedView.defaultSize) ? wrappedView.defaultSize.width : 200;
			var height = (wrappedView.defaultSize) ? wrappedView.defaultSize.height : 300;

			this.$el.width(width);
			this.$el.height(height);
			this.$el.css('position', 'absolute');
            
            var coords = this.model.get('coords').split(' ');
			this.$el.offset({
				left: coords[0], 
				top: coords[1]
			});

			this.$el.draggable({
				handle: ".widget_header",
                start: this.onDragStart,
				stop: this.updatePosition
			});

			this.$el.resizable();
			if(wrappedView.resizable === true) {
				console.log("resizable");
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

