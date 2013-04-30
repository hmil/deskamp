
define ([
    'app',
    'models/Tag',
    '/js/views/Widget.js',
    '/js/models/Widget.js',
    'modules',
     'backbone'],
    function(app, Tag, Widget, WidgetModel, modules){
            return Backbone.View.extend({
                
                events: {
                    'drop': 'ondrop', 
                    'click #createTagLink': 'createTag', 
                    'keydown #newTagName': 'checkNewTagForm', 
                    'click': 'checkHideContextMenu',
                    'mouseover #left-scroller': 'scrollLeft', 
                    'mouseover #right-scroller': 'scrollRight', 
                    'mouseover #top-scroller': 'scrollTop', 
                    'mouseover #bottom-scroller': 'scrollBottom',
                    'mouseout .scroller': 'stopScroll', 
                    'mapscroll': 'onScroll'
                },
                
                /**
                 * GlobalPanel's general settings
                 * @property width : panel's width in px.
                 * @property height : panel's height in px.
                 */
                settings: {
                    width: 8000,
                    height: 6000
                },
            
                lastPosition: {}, 
                currentPosition: {},

                lastScrollCheck: -1,

                initialize : function(){
                    
                    if(!app) app = require('app');
                    
                    _.bindAll(this, 'ondrop', 'updatePosition', 'trackMouse', 'untrackMouse', 
                        'trackMove', 'createWidget', 'createTag', 'checkNewTagForm', 'tagContextMenuHandler', 
                        'scrollLeft', 'scrollRight', 'scrollTop', 'scrollBottom', 'stopScroll', 'onScroll');
                    
                    app.widgets.on('add', this.createWidget);
                    
                    // We can drop elements into the main panel
                    this.$el.droppable();

                    this.$el.bind('contextmenu', this.tagContextMenuHandler);
                    
                    this.$el.on('mousedown', this.trackMouse);
                    
                    // Configures panel's width and height according to settings
                    this.$el.width(this.settings.width).height(this.settings.height);

                    $(window).scroll(this.onScroll);
                },

                onScroll: function(event) {
                    /* Only checks every 500ms */
                    var currentTime = new Date().getTime();
                    if ( !(this.lastScrollCheck === -1 || new Date().getTime() - this.lastScrollCheck >= 500)) return;

                    var scrollTop = $(document).scrollTop()
                      , scrollLeft = $(document).scrollLeft()
                      , $el       = this.$el;
                    var inViewportTags = app.tags.find(function(tag) {
                        return (tag.get('x') >= scrollTop && tag.get('x') <= scrollLeft + $el.width())
                            && (tag.get('y') >= scrollTop && tag.get('y') <= scrollTop + $el.height())
                    });
                    if(typeof(inViewportTags) !== 'undefined') {
                        app.router.navigate("!"+inViewportTags.get('name'), false);
                    }
                    this.lastScrollCheck = currentTime;
                },

                scrollLeft: function(event) {
                    this.scrollingInterval = setInterval(function() {
                        $(document).scrollLeft($(document).scrollLeft()-20);
                    }, 10);
                },

                scrollRight: function(event) {
                    this.scrollingInterval = setInterval(function() {
                        $(document).scrollLeft($(document).scrollLeft()+20);
                    }, 10);
                },

                scrollTop: function(event) {
                    this.scrollingInterval = setInterval(function() {
                        $(document).scrollTop($(document).scrollTop()-20);
                    }, 10);
                }, 

                scrollBottom: function(event) {
                    this.scrollingInterval = setInterval(function() {
                        $(document).scrollTop($(document).scrollTop()+20);
                    }, 10);
                },

                stopScroll: function(event) {
                    if(typeof(this.scrollingInterval) != undefined) {
                        clearInterval(this.scrollingInterval);
                    }
                },
                
                scrollTo: function(xPos, yPos, delay) {
                    $('body, html').animate({
                        scrollTop: yPos,
                        scrollLeft: xPos
                    }, delay || 0);
                },

                trackMouse: function(event) {
                    event.stopPropagation();

                    this.$el.css('cursor', 'move');
                    this.initialPosition = {
                        left: event.clientX, 
                        top: event.clientY
                    };
                    
                    this.initialScroll = {
                        left: $(document).scrollLeft(),
                        top: $(document).scrollTop()
                    };

                    $(window).mousemove(this.trackMove).mouseup(this.untrackMouse);
                },
                
                trackMove: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    event = event || window.event;
                    this.currentPosition = {
                        left: event.clientX, 
                        top: event.clientY
                    };
                    
                    $(document).scrollLeft(this.initialScroll.left - (this.currentPosition.left - this.initialPosition.left));
                    $(document).scrollTop(this.initialScroll.top - (this.currentPosition.top - this.initialPosition.top));

                    if (this.map) this.map.draggable.newpos();
                },

                untrackMouse: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(window).unbind('mousemove', this.trackMove)
                            .unbind('mouseup', this.untrackMouse);
                    this.$el.css('cursor', 'default');
                },

                getHeight : function(event){
                    return this.$el.height();
                },

                getWidth : function(event){
                    return this.$el.width();
                },

                getRelativeHeight : function(event){
                    return this.$el.height() / $(window).height();
                },

                getRelativeWidth : function(event){
                    return this.$el.width() / $(window).width();

                },

                tagContextMenuHandler: function(event) {
                        if($(event.target).attr('id') != this.$el.attr('id')) return;
                        event.preventDefault();

                        $('#rightclickmenu')
                            .css('top', event.pageY+'px')
                            .css('left', event.pageX+'px');

                        this.currentPosition = {
                            x: event.pageX, 
                            y: event.pageY
                        };
                        console.log("Current position is");
                        console.log(this.currentPosition);
                        console.warn("test");

                        $('#rightclickmenu, #createTagLink').show();
                        return false;
                },

                createTag: function(event) {
                    event.preventDefault();

                    $('#createTagLink').hide();
                    $('#createTagForm').show();
                    $('#newTagName').focus();
                }, 

                checkNewTagForm: function(event) {
                    var keycode = event.keycode || event.which; // Compatibility
                    if(keycode == 13) {
                        event.preventDefault();
                        app.tags.create(new Tag({
                            x: this.currentPosition.x,
                            y: this.currentPosition.y,
                            name: $('#newTagName').val()
                        }));
                        $('#rightclickmenu, #createTagForm').hide();
                        $('#newTagName').val('');
                    }
                },

                /* Closes context menu when somewhere else is clicked */
                checkHideContextMenu: function(event) {
                    var id = event.target.id;

                    if(id != 'rightclickmenu' && $(event.target).parent()[0].id != 'rightclickmenu') {
                        $('#rightclickmenu, #createTagLink, #createTagForm').hide();
                        $('#newTagName').val('');
                    }
                },
                
                updatePosition: function(event, ui) {
                    console.log("Updating position : ("+ui.position.left+", "+ui.position.top+")");
                },

                ondrop: function(event, ui){

                    var name = ui.draggable.attr("data-name");

                    if(!name) return; // We dont want to drop a new widget
                    
                    app.widgets.create({
                        coords: event.pageX+" "+event.pageY,
                        wrappedView: modules[name].view,
                        wrappedName: name
                    });
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