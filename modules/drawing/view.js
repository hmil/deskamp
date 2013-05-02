
define(["Session", "./model.js", "text!./template.jst", 'backbone'], 
    function(Session, Model, template){
    
    return Backbone.View.extend({
        
        /* Define these to attributes for the core to know how to layout your widget. */
        resizable: true,
        
        defaultSize: {
            width: 400,
            height: 300
        },
        
        /* Good old backbone code */
        events: {
            'mousedown': 'onMousedown'
        },

        focusin: function() {
            alert("focusin");
        },
        
        initialize: function(){
            
            this.template = _.template(template);
            
            this.canvasWidth = 400;
            this.canvasHeight = 300;

            _.bindAll(this, 'render', 'onMousemove', 'onMouseup', 'onMousedown');
            
            this.model.on('change', this.render);
        },
        
        render: function(){
            console.log("rendering");
            this.$el.html(
                this.template({
                    width:  this.canvasWidth  ,
                    height: this.canvasHeight
                })
            );
            
            this.ctx = this.$('.drawing_canvas').get(0).getContext('2d');
            
            /* draw the current model */
            var path = this.model.get('path');
            for(var i in path){
                var p = path[i];
                this.ctx.beginPath();
                this.ctx.moveTo(p[0]);
                for(var j = 0 ; j < p.length ; j++){
                    this.ctx.lineTo(p[j].x, p[j].y);
                }
                this.ctx.stroke();
            }
        },
        
        
        onMousedown: function(evt){
            
            this.ctx.beginPath();
            
            var c = this.mapCoords({x: evt.pageX - this.$el.offset().left, y: evt.pageY - this.$el.offset().top});
            
            this.ctx.moveTo(c.x, c.y);
            
            this.currentPath = [];
            
            $(window).mousemove(this.onMousemove)
                    .mouseup(this.onMouseup);
        },
        
        onMousemove: function(evt){
            // console.log((evt.pageX - this.$el.offset().left)+" "+evt.pageX);
            
            var c = this.mapCoords({x: evt.pageX - this.$el.offset().left, y: evt.pageY - this.$el.offset().top});
            
            this.ctx.lineTo(c.x, c.y);
            this.ctx.stroke();
            
            this.currentPath.push(c);
        },
        
        onMouseup: function(evt){
            
            this.model.addPath(this.currentPath);
            this.currentPath = null;
            
            $(window).unbind('mousemove', this.onMousemove)
                    .unbind('mouseup', this.onMouseup);
        },
        
        mapCoords: function(c){
            return {
                x: c.x * this.canvasWidth / this.$el.width(),
                y: c.y * this.canvasHeight / this.$el.height()
            };
        }
    });

});