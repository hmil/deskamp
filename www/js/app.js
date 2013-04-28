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
    'socket.io',
    'backbone', 
    'Router'],
    function(WidgetBar, GlobalPanel, Sync, Widgets){

    // App is a singleton object
    var App = {};
    
    /*
        This method is called by the loader when the dom is ready.
    */
    App.init = function () {
        // Creates the router
        this.router = new (require('Router'));
        
        this.widgets = new Widgets();
        
        var socket = io.connect('/');
        
        Backbone.sync = Sync.create(socket);
        
        if(!Backbone.history.start()){
            window.location.hash = '/';
        }
        
        var arguments = {};
        
        this.widgetBar = new WidgetBar({
            el: '#widget_bar'
        });
        this.globallPanel = new GlobalPanel({
            el: '#global_panel'
        });
        
        console.log("app initialized");
    };
    
    
    return window.app = App;
});
