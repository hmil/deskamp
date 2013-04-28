
define([
    'text!templates/Map.jst',
    'backbone', 
    'jqueryUI'], function(templateString){
    
    return Backbone.View.extend({

        
        initialize: function(hash){
            
            this.template = _.template( templateString );



            this.panel =  hash.panel;
            this.render();


        },


        render: function(){

            var _this = this;

            this.$el.html( this.template() );

            
            this.draggable = this.$('#target');

            this.draggable.posintomap = function(pos){
                var mappos = _this.$el.offset();
                if (pos){
                    _this.draggable.offset({
                        top : mappos.top + pos.top,
                        left : mappos.left + pos.left
                    });
                }
                else{
                    var currentpos = _this.draggable.offset();
                    return {top : currentpos.top - mappos.top, left : currentpos.left - mappos.left};
                }
            }

            this.panel.map = this;

            this.draggable.newpos = function(){
                console.log('newpos');
                _this.draggable.posintomap({
                    top : $(document).scrollTop() / _this.panel.getRelativeHeight(),
                    left : $(document).scrollLeft() / _this.panel.getRelativeWidth()});
            }
            window.onscroll = this.draggable.newpos;
            this.$('[data-draggable="draggable"]').draggable({
                containment: "#map",

                drag: function(event, ui){


                        _this.draggable.height( _this.$el.height() / _this.panel.getRelativeHeight());
                        _this.draggable.width( _this.$el.width() / _this.panel.getRelativeWidth());
                        $(document).scrollLeft(_this.draggable.posintomap().left * _this.panel.getRelativeWidth());
                        $(document).scrollTop(_this.draggable.posintomap().top * _this.panel.getRelativeHeight());
                }
            });
        }
    
    });
});