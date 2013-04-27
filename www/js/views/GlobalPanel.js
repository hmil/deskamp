
define ([
     'views/Widget',
      'modules',
     'backbone'],
    function(Widget,modules){
            return Backbone.View.extend({
                
                events: {
                    'drop': 'ondrop'
                },
                
                initialize : function(){
                    
                    _.bindAll(this, 'ondrop', 'updatePosition');
                    
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