
define ([
    'app',
    'views/Widget',
    'models/Widget',
    'modules',
     'backbone'],
    function(app, Widget, WidgetModel, modules){
            return Backbone.View.extend({
                
                events: {
                    'drop': 'ondrop'
                },
                lastPosition: {}, 
                currentPosition: {},

                trackMouse: function(event) {
                    //event.preventDefault();
                    event.stopPropagation();

                    this.$el.css('cursor', 'move');
                    this.lastPosition = {
                        left: event.pageX, 
                        top: event.pageY
                    };

                    $(window).mousemove(this.trackMove).mouseup(this.untrackMouse);
                },
                
                trackMove: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    event = event || window.event;
                    this.currentPosition = {
                        left: event.pageX, 
                        top: event.pageY
                    }
                    $('body, html').scrollLeft($(document).scrollLeft()-(this.currentPosition.left-this.lastPosition.left)/1.1)
                    $('body, html').scrollTop($(document).scrollTop()-(this.currentPosition.top-this.lastPosition.top)/1.1)
                    this.lastPosition = this.currentPosition;
                },

                untrackMouse: function(event) {
                    console.log("untrack");
                    event.preventDefault();
                    event.stopPropagation();
                    $(window).unbind('mousemove', this.trackMove)
                            .unbind('mouseup', this.untrackMouse);
                    this.$el.css('cursor', 'default');
                },
                
                initialize : function(){
                    
                    if(!app) app = require('app');
                    
                    _.bindAll(this, 'ondrop', 'updatePosition', 'trackMouse', 'untrackMouse', 'trackMove', 'createWidget');
                    
                    app.widgets.on('add', this.createWidget);
                    
                    // We can drop elements into the main panel
                    this.$el.droppable();

                    var contextmenuHandler = $.proxy(function(event) {
                        if($(event.target).attr('id') != 'global_panel') return;
                        this.$el.unbind('contextmenu');
                        event.preventDefault();
                        var that = this;

                        $menu = $("<div>")
                                .addClass('context-menu')
                                // .css('top', (event.pageY+$(document).scrollTop())+"px")
                                // .css('left', (event.pageX+$(document).scrollLeft())+"px")
                                .css('top', event.pageY+"px")
                                .css('left', event.pageX+"px")
                                .css('position', 'absolute')
                                .css('padding', '10px')
                                .css('background-color', 'white')
                                .css("zIndex", "100")
                                .css('border-radius', '25px')
                                .css('min-width', '150px')
                                .appendTo(this.$el)
                                .click(function() {
                                    
                                    // $(this).remove();
                                    that.$el.bind('contextmenu', contextmenuHandler);
                                });
                        $('<a>')
                            .attr('href', '#')
                            .css('color', 'black')
                            .html('Make a new tag here')
                            .click(function() {
                                $menu.html('');
                                $('<label>')
                                    .attr('for', 'tagName')
                                    .html("Enter tag name : ")
                                    .appendTo($menu);
                                var input = $('<input />')
                                    .attr('type', 'text')
                                    .attr('id', 'tagName')
                                    .appendTo($menu);
                                input.focus();
                                input.keydown(function(e) {
                                    var keycode = e.keycode || e.which;
                                    console.log(keycode);
                                    if(keycode == 13) {
                                        alert("Create tag "+$(this).val());
                                        $menu.remove();
                                    }
                                });
                            })
                            .appendTo($menu);
                        return false;
                    }, this)
                    this.$el.bind('contextmenu', contextmenuHandler);

                    // $window.bind("contextmenu", function(event) {
                    //             event.preventDefault();
                    //              $close = $("<div class='custom-menu'><a href='#' id='close'>Close</a></div>")
                    //                  .appendTo("body")
                    //                  .css({
                    //                      position: "absolute", 
                    //                      top: event.pageY + "px", 
                    //                      left: event.pageX + "px",
                    //                      background: "#e8e8e8", 
                    //                      border: "1px solid black",
                    //                      borderRadius: "5px",
                    //                      zIndex: "100"
                    //                  })
                    //                  .click(function() { $window.remove(); $(this).remove();});
                    //         });
                    
                    this.$el.on('mousedown', this.trackMouse);
                },
                
                updatePosition: function(event, ui) {
                    console.log("Updating position : ("+ui.position.left+", "+ui.position.top+")");
                },

                ondrop: function(event, ui){

                    var name = ui.draggable.attr("data-name");

                    if(!name) return; // We dont want to drop a new widget
                    
                    var wid = new WidgetModel({
                            coords: event.pageX+" "+event.pageY,
                            wrappedView: modules[name].view,
                            wrappedName: name
                        });
                    
                    
                    app.widgets.add(wid);
                    
                    wid.save();
                },
                
                createWidget: function(model){
                    console.log('adding');
                    var wid = new Widget({
                        model: model
                    });

                    this.$el.append(wid.$el);
                }


            })
    }
);