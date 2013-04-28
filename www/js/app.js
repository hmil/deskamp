/* 
 * app.js is the main application object. It instanciates the main views and router(s).
 * Whenever something is global to the application, it has to be placed here.
 * Since there is only one party going on at a time, the application holds the party model and the player view.
 */


define([
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
    function(WidgetBar, GlobalPanel, Sync, Widgets, Widget, Map, modules){


    // App is a singleton object
    var App = {};
    
    /*
        This method is called by the loader when the dom is ready.
    */
    App.init = function () {
        // Creates the router
        this.router = new (require('Router'));
        this.router.on('route:scrollTo', function(left, top) {
                    $('html, body').animate({
                        scrollTop: top || 0,
                        scrollLeft: left || 0
                    }, 1000);
                });
        this.widgets = new Widgets();
        
       
        
        var socket = io.connect('/');
        
        // Creates a sync with the socket
        var sync = Sync(socket);
        
        // Server pushing widgets
        socket.on('create:widget', $.proxy(function(data){
            console.log("getting a widget");
            console.log('data name :'+data.wrappedName);
            var widget = new Widget(_.extend(data, {wrappedView: modules[data.wrappedName].view}));
            this.widgets.add(widget);
            sync.makeLive(widget);
            widget.emit('sync'); // The server pushed this so it seems ok to fire this event
        }, this));
            
        Backbone.sync = sync.sync;
        
        if(!Backbone.history.start()){
            window.location.hash = '/';
        }
        
        var arguments = {};
        
        this.widgetBar = new WidgetBar({
            el: '#widget_bar'
        });
        this.globalPanel = new GlobalPanel({
            el: '#global_panel'
        });
        this.map = new Map({
            el: '#map',
            panel : this.globalPanel
        });
        
        console.log("app initialized");
    };
    
    
    return window.app = App;
});
