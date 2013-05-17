
define ([
    'models/Tag',
    '/js/models/Widget.js',
    '/js/views/Widget.js',
    '/js/views/Tag.js',
    '/js/views/Scrolling.js',
     'backbone'],
    function(TagModel, WidgetModel, WidgetView, TagView, Scrolling){
            return Backbone.View.extend({
                
                events: {
                    'drop': 'ondrop', 
                    'click #createTagLink': 'showTagForm', 
                    'keydown #newTagName': 'checkNewTagForm', 
                    'click': 'checkHideContextMenu'
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

                horizontalScrollSpeed: 0, 
                verticalScrollSpeed: 0,

                initialize : function(param){
                    this.tags = param.tags;
                    this.widgets = param.widgets;
                    
                    _.bindAll(this, 'ondrop', 'updatePosition', 'createWidget', 'createTag', 'showTagForm', 'checkNewTagForm', 'tagContextMenuHandler');
                    
                    this.widgets.on('add', this.createWidget);
                    this.tags.on('add', this.createTag);
                    
                    // We can drop elements into the main panel
                    this.$el.droppable();

                    this.$el.bind('contextmenu', this.tagContextMenuHandler);
                    
                    // Configures panel's width and height according to settings
                    this.$el.width(this.settings.width).height(this.settings.height);

                    this.scrolling = new Scrolling({
                        el: this.$el
                    });
                },

                scrollTo: function(x, y, delay) {
                    this.scrolling.scrollTo(x, y, delay);
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

                createTag: function(model) {
                    console.log('adding tag to DOM');
                    var tag = new TagView({
                        model: model
                    });

                    this.$el.append(tag.$el);
                },
                
                createWidget: function(model){
                    console.log('adding widget to DOM');
                    var wid = new WidgetView({
                        model: model
                    });

                    this.$el.append(wid.$el);
                },
                
                showTagForm: function(event){
                    event.preventDefault();

                    $('#createTagLink').hide();
                    $('#createTagForm').show();
                    $('#newTagName').focus();
                },

                checkNewTagForm: function(event) {
                    var keycode = event.keycode || event.which; // Compatibility
                    if(keycode == 13) {
                        event.preventDefault();
                        this.tags.create(new TagModel({
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
                    
                    this.widgets.create({
                        coords: {
                            x: event.pageX,
                            y: event.pageY
                        },
                        name: name
                    }, {client: true});
                },

                render: function() {
                    this.scrolling.render();
                }

            })
    }
);