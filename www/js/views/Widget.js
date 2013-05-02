define(['text!/templates/widget.jst', '/js/models/Widget.js', 'app', 'backbone'], function(WidgetTemplate, Widget, app) {
	return Backbone.View.extend({
		events: {
			"click": "handleWidgetsFocus",
			"click .widget_delete_button": "onDelete",
            "mouseenter .widget_container": "onMouseenter",
            "mouseleave .widget_container": "onMouseleave",
            "mousedown": "preventProp",
            "resizestop": "onResize"
		},
        
        preventProp: function(evt){
            evt.stopPropagation();
        },

        handleWidgetsFocus: function() {
            
        	var maxzIndex = app.maxzIndex || 1;
        	this.$el.css('z-index', maxzIndex+1);
        	app.maxzIndex = maxzIndex + 1;
        },
       
		initialize: function(params) {
            if(!app) app = require('app');
            
			if(!this.model) {
                throw "Widget cannot be instanciated without a model property !";
			}
            
			_.bindAll(this, 'render', 'onDelete', 'updatePosition', 'onMouseenter', 'onMouseleave', 'onDragStart', 'updateCoords', 'updateSize', 'onResize');
            
            this.model.on('change:coords', this.updateCoords);
            this.model.on('change:size', this.updateSize);
            this.model.on('change:contents', this.render);
            this.isDragged = false;

			this.wrapped = this.model.get('contentsView');
            
            this.model.on('destroy', $.proxy(function(){
                this.onDelete()
            }, this));
            
			this.template = _.template(WidgetTemplate);

			_.bindAll(this, 'render', 'onDelete', 'updatePosition', 
				'onMouseenter', 'onMouseleave', 'onDragStart', 
				'handleWidgetsFocus');
            
            this.render();
		}, 
        
        updateCoords: function(){
            var c = this.model.get('coords');
            this.$el.css({
                left: c.x,
                top: c.y
            });
        },
        
        updateSize: function(){
            var s = this.model.get('size');
            this.$el.width(s.width).height(s.height);
        },

		onDelete: function(evt) {
			this.$el.remove();
			if(this.wrapped.remove) {
				this.wrapped.remove();
			}
			
            if(evt)
                this.model.destroy();
		},
        
        onResize: function(evt, ui){
            this.model.set('size', ui.size);
            console.log(ui.size);
        },

		updatePosition: function(event, ui) {
            this.isDragged = false;
			this.model.set('coords', {
                x: ui.position.left,
                y: ui.position.top
            });
		},

		render: function() {
			this.$el.html(this.template());

			var wrappedView = this.wrappedView = new this.wrapped({
				el: this.$('.widget_content'),
                model: this.model.get('contentsModel')
			});
			wrappedView.render();
            
			var width = (wrappedView.defaultSize) ? wrappedView.defaultSize.width : 200;
			var height = (wrappedView.defaultSize) ? wrappedView.defaultSize.height : 300;
            
            this.model.set('size', {
                width: width,
                height: height
            });
            
			this.$el.width(width);
			this.$el.height(height);
			this.$el.css('position', 'absolute');
            
            var c = this.model.get('coords');
			this.$el.offset({
				left: c.x, 
				top: c.y
			});

			this.$el.draggable({
				handle: ".widget_header",
                start: this.onDragStart,
				stop: this.updatePosition
			});

			this.$el.resizable();
            
            this.controls = this.$('.widget_controls');
            
            this.controlsShown = false;
		},
        
        onMouseenter: function(){
            if(!this.controlsShown) {
                this.controls.animate({
                    opacity: 0.9
                },{
                    duration: 'fast',
                    complete: $.proxy(function(){
                        this.controlsShown = true;
                    }, this)
                });
            }
        },
        
        onMouseleave: function(){
            if(this.controlsShown && !this.isDragged) {
                this.controls.animate({
                    opacity: 0.3
                }, {
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

