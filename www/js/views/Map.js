
define([
    'text!templates/Map.jst',
    'backbone', 
    'jqueryUI'], function(templateString){
    
    return Backbone.View.extend({

        
        initialize: function(){
            
            this.template = _.template( templateString );
            
            this.render();


        },

        newpos: function(ri,to) {
            $('#target').css({'top': "'"+to +"%'", 'right': "'"+ ri +"%'"});
        },
        
        render: function(){



            this.$el.html( this.template() );

            _this = this;
            
            _this.draggable = this.$('#target');
            initialpos ={};

            initialpos = _this.draggable.offset();

            this.$('[data-draggable="draggable"]').draggable({
                containment: "#map",


                drag: function(event, ui){    
                        console.log(initialpos);             

                        currentpos = _this.draggable.offset();

                        console.log(currentpos);
                        console.log($(document).scrollLeft());
                        console.log((currentpos.left-initialpos.left));


                        $('body, html').scrollLeft($(document).scrollLeft()-(currentpos.left-initialpos.left)*30);
                        //$('map').scrollLeft($('map').scrollLeft()+(currentpos.left-initialpos.left)*30);
                        //$('body, html').scrollTop($(document).scrollTop()-(this.currentPosition.top-this.lastPosition.top)/1.1)
                        //this.lastPosition = this.currentPosition;


                }



                
            });
        }
    
    });
});