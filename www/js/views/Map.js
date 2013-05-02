define(['text!/templates/Map.jst', 'backbone', 'jqueryUI'], 

    /** 
        A module representing the map.
        @exports views/Map
    */
    function(templateString){
    
    var MapView = Backbone.View.extend(
        /** 
            @lends module:views/Map~MapView.prototype
        */
        {
            /*
             *  DOM events this view listens to
             */
            events: {
                'mousedown' : 'onMousedown'
            },
            
            /**
             * Map's general settings
             * @property width : map's width. This is both the canvas and css width in px.
             * @property height : map's height. This is both the canvas and css height in px.
             */
            settings: {
                width: 200,
                height: 150
            },
            
            /**
             *  @Constructs
             */
            initialize: function(hash){
            
                this.template = _.template( templateString );
                
                // Binding "this" context to the methods that need it
                _.bindAll(this, 
                    "render", "onMousedown", "onMouseup", "onMousemove", "setTargetPosition", "moveViewportToCursor", "drawCanvas", "drawTarget", "onWidgetAdded"
                );

                // Global panel
                this.panel = hash.panel;
                // Widgets collection (used to render widgets on the map)
                this.widgets = hash.widgets;
                
                this.widgets.on('add', this.onWidgetAdded);
                
                $(window)
                    .resize(this.drawTarget)
                    .scroll(this.setTargetPosition);
                
                this.$el.width(this.settings.width).height(this.settings.height);
                
                // After we initialized everything, we can proceed to render
                this.render();
            },
            
            
            /*              ---     RENDERING METHODS    ---         */
            
            /**
             * Renders the HTML of the map, draws the map's contents and initializes the viewport.
             * (should be called only once)
             */
            render: function(){
                
                // Renders the DOM
                this.$el.html( this.template(this.settings) );
                
                /* Getting the target (target is the rectangle 
                    representing the viewport on the map)   */
                this.target = this.$('#map_target');
                this.drawTarget();
                
                /* Getting the canvas (on which is drawn the map's contents) */
                this.canvas = this.$('canvas');
                this.ctx = this.canvas.get(0).getContext('2d');
                this.drawCanvas();
            },
            
            
            /**
             *  Draws the background canvas representing the set of widgets on the map.
             *  (does not affect either the target or the DOM)
             */
            drawCanvas: function(){
                
                this.ctx.fillStyle = "#fff";
                this.ctx.fillRect(0, 0, this.canvas.width(), this.canvas.height());
                
                var coll = app.widgets.models;
                
                for(var i in coll){
                
                    var widPos = coll[i].get('coords');
                    var coords = this.globalCoordsToLocal({
                        x: widPos.x,
                        y: widPos.y
                    });
                    
                    var widSize = coll[i].get('size');
                    var size = this.globalCoordsToLocal({
                        x: widSize.width,
                        y: widSize.height
                    });

                    this.ctx.fillStyle = "#000";
                    this.ctx.fillRect(coords.x, coords.y, size.x, size.y);
                }
            },
            
            /**
             *  Sets the target properties (width and height) as well as it's position
             */
            drawTarget: function(){
                // Retreiving the viewport's size in local coordinates
                var targetSize = this.globalCoordsToLocal(
                    $(window).width(),
                    $(window).height()
                );
                
                // Setting size and position
                this.target.width(targetSize.x).height(targetSize.y);
                this.setTargetPosition();
            },
            
            /*              ---     EVENTS LISTENERS    ---         */
            
            /**
             * Listener called when a mousedown event is triggered inside the view.
             * Moves the viewport to the event's position and starts dragging.
             */
            onMousedown: function(evt){
                evt.preventDefault();
                evt.stopPropagation();
                
                $(window).on('mouseup', this.onMouseup)
                        .on('mousemove', this.onMousemove);
                        
                this.moveViewportToCursor({x: evt.clientX, y: evt.clientY});
            },
            
            /**
             * Listener called when a mouseup event is triggered inside the view.
             * Stops viewport's dragging.
             */
            onMouseup: function(evt){
                $(window).off('mouseup', this.onMouseup)
                        .off('mousemove', this.onMousemove);
            },
            
            onMousemove: function(evt){
                this.moveViewportToCursor({x: evt.clientX, y: evt.clientY});
            },
            
            onWidgetAdded: function(model){
                this.drawCanvas();
                
                model
                    .on('change:size change:coords', this.drawCanvas)
                    .once('remove', this.drawCanvas);
            },
            
            
            
            /*              ---     BEHAVIOURAL METHODS     ---             */
            
            /**
             * Moves the viewport's center to a position in the map coords.
             * @param {hash} coords : a hash containing 'x' and 'y' coords to move the viewport to
             */
            moveViewportToCursor: function(coords){
                var c = this.localCoordsToGlobal(
                    coords.x - this.$el.offset().left + $(document).scrollLeft() - this.target.width()/2, 
                    coords.y - this.$el.offset().top + $(document).scrollTop() - this.target.height()/2
                );
                
                this.panel.scrollTo(c.x, c.y);
            },
            
            /**
             * Sets the viewport position according to window's scroll position
             */
            setTargetPosition: function(){
                var c = this.globalCoordsToLocal($(window).scrollLeft(), $(window).scrollTop());
                
                this.target.offset({
                    left: this.$el.offset().left + c.x,
                    top:  this.$el.offset().top + c.y
                });
            },
            
            
            /*              ---     UTILITY METHODS     ---             */
            
            /**
             * This method transforms global coordinates to map's coordinates.
             * Takes either a hash of coordinates or the x and y coordinates as two arguments
             * @param {hash} coords : contains x and y coords to transform
             * @param {integer} x   : x coord to map
             * @param {integer} y   : y coord to map
             * @return {hash} {x, y} : hash of mapped coordinates (x and y)
             */
            globalCoordsToLocal: function(x, y){
                if(typeof y === 'undefined'){
                    y = x.y;
                    x = x.x;
                }
                
                return {
                    x: x * this.settings.width / this.panel.$el.width(),
                    y: y * this.settings.height / this.panel.$el.height()
                };
            },
            
            /**
             * This method transforms map's coordinates to global coordinates. 
             * Takes either a hash of coordinates or the x and y coordinates as two arguments
             * @param {hash} coords : contains x and y coords to transform
             * @param {integer} x   : x coord to map
             * @param {integer} y   : y coord to map
             * @return {hash} {x, y} : hash of mapped coordinates (x and y)
             */
            localCoordsToGlobal: function(x, y){
                if(typeof y === 'undefined'){
                    y = x.y;
                    x = x.x;
                }
                
                return {
                    x: x * this.panel.$el.width() / this.settings.width,
                    y: y * this.panel.$el.height() / this.settings.height
                };
            }
        }
    );
    
    return MapView;
});