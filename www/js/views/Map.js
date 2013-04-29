
define([
   // 'app',
    'text!/templates/Map.jst',
    'backbone', 
    'jqueryUI'], function(/*app,*/ templateString){
    
    return Backbone.View.extend({

        
        initialize: function(hash){

         //   if(!app) app = require('app');

            this.template = _.template( templateString );

            _.bindAll(this, "render");

            //app.widgets.on('add', this.render);

            this.panel =  hash.panel;
            this.render();
            this.draggable.newpos();


        },

     /*   drawCanvas: function(){
            var coll = app.widgets.models;

            for(var i in coll){
                var mappos = coll[i].get('coords').split(' ');

                var top = mappos[1];
                var left = mappos[0];

                top = this.$el.width() * mappos[1] / 400 ;
                left = this.$el.height() * mappos[0] / 300;

                this.ctx.fillRect(left-3, top-3, left+3, top+3);
            }
        },          */

        render: function(){

            var _this = this;

            this.$el.html( this.template() );


         //   var canvas = this.$('canvas');

         //   this.ctx = canvas.get(0).getContext('2d');

         //   this.drawCanvas();

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

            this.addWidget = function(wid){
                //to implement
            };

            this.draggable.newpos = function(event){
                _this.draggable.posintomap({
                    top : _this.$el.height() * $(window).scrollTop() / _this.panel.$el.height(),
                    left : _this.$el.width() * $(window).scrollLeft() / _this.panel.$el.width()
                });
                _this.draggable.height( _this.$el.height() / _this.panel.getRelativeHeight());
                _this.draggable.width( _this.$el.width() / _this.panel.getRelativeWidth());
                }
            window.onscroll = this.draggable.newpos;
            this.$('[data-draggable="draggable"]').draggable({
                containment: "#map",

                drag: function(event, ui){

                    window.onscroll = function(){};

                        //_this.draggable.height( _this.$el.height() / _this.panel.getRelativeHeight());
                        //_this.draggable.width( _this.$el.width() / _this.panel.getRelativeWidth());

                        $(document).scrollLeft(_this.draggable.posintomap().left * _this.panel.getRelativeWidth());
                        $(document).scrollTop(_this.draggable.posintomap().top * _this.panel.getRelativeHeight());

                    window.onscroll = this.draggable.newpos;
                }
            });
        }

    });
});