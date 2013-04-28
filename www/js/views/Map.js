
define([
    'text!templates/Map.jst',
    'backbone', 
    'jqueryUI'], function(templateString){
    
    return Backbone.View.extend({
        
        initialize: function(){
            
            this.template = _.template( templateString );
            
            this.render();
        },
        
        render: function(){
            this.$el.html( this.template() );

                


                console.log($('#target').offsetLeft);





            this.$('[data-draggable="draggable"]').draggable({
                containment: "#map",

                drag: function(event, ui){

                    var x = document.getElementById('target').offsetLeft;
                    var y = document.getElementById('target').offsetTop;

                    var viewportWidth = $(window).width();
                    var viewportHeight = $(window).height();

                    console.log("drag");
                    $(window).scrollLeft(viewportWidth * ($('#target').offsetLeft-x)/$('#target').width());
                    $(window).scrollTop(viewportHeight * ($('#target').offsetTop-y)/$('#target').height());

                }



                
            });
        }
    
    });
});