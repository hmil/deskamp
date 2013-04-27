
define ([
     'views/Widget',
      'modules',
     'backbone'],
    function(Widget,modules){
            return Backbone.View.extend({

                initialize : function(){

                    this.$el.droppable({
                        drop: function(event, ui) {
                            console.log('drop');
                            var name = ui.draggable.attr("data-name");
                            console.log(name);


                            var wid = new Widget({
                                wrapped: modules[name]
                            });

                            this.$el.append(wid.$el);

                        }
                    });
                }



            })
    }
);