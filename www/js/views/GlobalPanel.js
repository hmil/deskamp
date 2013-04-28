
define ([
    'app',
    '/js/views/Widget.js',
    '/js/models/Widget.js',
    'modules',
     'backbone'],
    function(app, Widget, WidgetModel, modules){
            return Backbone.View.extend({
                
                events: {
                    'drop': 'ondrop'
                },
                lastPosition: {}, 
                currentPosition: {},

                trackMouse: function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    this.$el.css('cursor', 'move');
                    this.lastPosition = {
                        left: event.pageX, 
                        top: event.pageY
                    };

                    $(window).mousemove(this.trackMove).mouseup(this.untrackMouse);
                                    },
                
                trackMove: function(event) {
                    console.log('trackmove');
                    event.preventDefault();
                    event.stopPropagation();
                    event = event || window.event;
                    this.currentPosition = {
                        left: event.pageX, 
                        top: event.pageY
                    }
                    $('body, html').scrollLeft($(document).scrollLeft()-(this.currentPosition.left-this.lastPosition.left)/1.1)
                    $('body, html').scrollTop($(document).scrollTop()-(this.currentPosition.top-this.lastPosition.top)/1.1)
                    this.lastPosition = this.currentPosition;
                    if (this.map) this.map.draggable.newpos();
                },

                untrackMouse: function(event) {
                    console.log("untrack");
                    event.preventDefault();
                    event.stopPropagation();
                    $(window).unbind('mousemove', this.trackMove)
                            .unbind('mouseup', this.untrackMouse);
                    this.$el.css('cursor', 'default');
                },

                getHeight : function(event){
                    return this.$el.height();
                },

                getWidth : function(event){
                    return this.$el.width();
                },

                getRelativeHeight : function(event){
                    return this.$el.height() / $(window).height();
                },

                getRelativeWidth : function(event){
                    return this.$el.width() / $(window).width();

                },

                initialize : function(){
                    
                    if(!app) app = require('app');
                    
                    _.bindAll(this, 'ondrop', 'updatePosition', 'trackMouse', 'untrackMouse', 'trackMove', 'createWidget');
                    
                    app.widgets.on('add', this.createWidget);
                    
                    // We can drop elements into the main panel
                    this.$el.droppable();
                    
                    this.$el.on('mousedown', this.trackMouse);
                },
                
                updatePosition: function(event, ui) {
                    console.log("Updating position : ("+ui.position.left+", "+ui.position.top+")");
                },

                ondrop: function(event, ui){

                    var name = ui.draggable.attr("data-name");

                    if(!name) return; // We dont want to drop a new widget
                    
                    var wid = new WidgetModel({
                            coords: event.pageX+" "+event.pageY,
                            wrappedView: modules[name].view,
                            wrappedName: name
                        });
                    
                    
                    app.widgets.add(wid);
                    
                    wid.save();
                },
                
                createWidget: function(model){
                    console.log('adding');
                    var wid = new Widget({
                        model: model
                    });

                    this.$el.append(wid.$el);
                }

            })
    }
);