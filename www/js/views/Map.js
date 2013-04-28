
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

            var _this = this;

            this.$el.html( this.template() );

            
            this.draggable = this.$('#target');


            this.$('[data-draggable="draggable"]').draggable({
                containment: "#map",

                drag: function(event, ui){    

                        mappos = $('#map').offset();
                        currentpos = _this.draggable.offset();

                        //console.log({top : currentpos.top - mappos.top, left : currentpos.left - mappos.left});
                        console.log(this.panel.getHeight());
//                        console.log($(document).scrollLeft());
//                        console.log((currentpos.left-initialpos.left));


                        //$('body, html').scrollLeft($(document).scrollLeft()-(currentpos.left-initialpos.left)*30);
                        //$('map').scrollLeft($('map').scrollLeft()+(currentpos.left-initialpos.left)*30);
                        //$('body, html').scrollTop($(document).scrollTop()-(this.currentPosition.top-this.lastPosition.top)/1.1)
                        //this.lastPosition = this.currentPosition;
//                        $('body, html').scrollLeft(200);

                }



                
            });
        }
    
    });
});