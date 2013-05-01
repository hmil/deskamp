/* 
 * app.js is the main application object. It instanciates the main views and router(s).
 * Whenever something is global to the application, it has to be placed here.
 * Since there is only one party going on at a time, the application holds the party model and the player view.
 */


define([
    'models/Tag',
    'collections/TagsCollection',
    'views/WidgetBar',
    'views/GlobalPanel',
    'util/Sync',
    'collections/Widgets',
    'models/Widget',
    'views/Map',
    'modules',
    'socket.io',
    'backbone', 
    'Router'],
    function(Tag, TagsCollection, WidgetBar, GlobalPanel, Sync, Widgets, Widget, Map, modules){


    // App is a singleton object
    var App = {};
    
    /*
        This method is called by the loader when the dom is ready.
    */
    App.init = function () {
        App.tags = new TagsCollection();

        

        this.widgets = new Widgets();
        
       
        
        var socket = io.connect('/');
        
        // Creates a sync with the socket
        var sync = Sync(socket);
        
        // Server pushing widgets
        socket.on('create:widget', $.proxy(function(data){
            var widget = this.widgets.create(_.extend(data, {wrappedView: modules[data.wrappedName].view}));
            sync.makeLive(widget);
            widget.trigger('sync'); // The server pushed this so it seems ok to fire this event
        }, this));
            
        Backbone.sync = sync.sync;
        
        
        
        var arguments = {};
        
        this.widgetBar = new WidgetBar({
            el: '#widget_bar'
        });
        this.globalPanel = new GlobalPanel({
            el: '#global_panel'
        });
        this.map = new Map({
            el: '#map',
            panel   : this.globalPanel,
            widgets : this.widgets
        });
        
        // Creates the router
        this.router = new (require('Router'))({
            panel: this.globalPanel
        });
        if(!Backbone.history.start()){
            window.location.hash = '/';
        }
        
        console.log("app initialized");
    };
    
    
    return window.app = App;
});
