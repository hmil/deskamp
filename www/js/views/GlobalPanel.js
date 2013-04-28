
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
                    
                    _.bindAll(this, 'ondrop');
                    
                    this.$el.droppable();
                },
                
                ondrop: function(event, ui){
                    var name = ui.draggable.attr("data-name");

                    if(!name) return;
                    
                    console.log(name);
                    
                    console.log(modules);
                    
                    var test = new (modules[name].view);

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