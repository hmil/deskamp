
define ([
     'views/Widget',
      'modules',
     'backbone'],
    function(Widget,modules){
            return Backbone.View.extend({
                
                events: {
                    'drop': 'ondrop', 
                    'mousedown': 'trackMouse', 
                    'mouseup': 'untrackMouse'
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

                    this.$el.mousemove($.proxy(function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        event = event ||window.event;
                        this.currentPosition = {
                            left: event.pageX, 
                            top: event.pageY
                        }
                        $('body, html').scrollLeft($(document).scrollLeft()-(this.currentPosition.left-this.lastPosition.left)/1.1)
                        $('body, html').scrollTop($(document).scrollTop()-(this.currentPosition.top-this.lastPosition.top)/1.1)
                        this.lastPosition = this.currentPosition;
                    }, this))
                },

                untrackMouse: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.$el.unbind('mousemove');
                    this.$el.css('cursor', 'default');
                },
                
                initialize : function(){
                    
                    _.bindAll(this, 'ondrop', 'updatePosition', 'trackMouse', 'untrackMouse');
                    
                    // We can drop elements into the main panel
                    this.$el.droppable();
                },
                updatePosition: function(event, ui) {
                    console.log("Updating position : ("+ui.position.left+", "+ui.position.top+")");
                },

                ondrop: function(event, ui){

                    var name = ui.draggable.attr("data-name");

                    if(!name) return; // We dont want to drop a new widget

                    var wid = new Widget({
                        wrapped: modules[name].view, 
                        x: event.pageX, 
                        y: event.pageY
                    });

                    this.$el.append(wid.$el);
                }


            })
    }
);