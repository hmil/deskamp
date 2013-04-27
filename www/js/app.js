/* 
 * app.js is the main application object. It instanciates the main views and router(s).
 * Whenever something is global to the application, it has to be placed here.
 * Since there is only one party going on at a time, the application holds the party model and the player view.
 *
 * The player is accessible via app.player, the party can be accessed with getParty() and setParty().
 * When the party is replaced, the 'partyChange' event is fired.
 *
 * The app also initializes the navbar view (app.nabar).
 */


define([
    'views/WidgetBar',
    'backbone', 
    'Router'
    ],
    function(WidgetBar,Backbone){

        // App is a singleton object
        var App = {};

        /*
            This method is called by the loader when the dom is ready.
        */
        App.init = function () {
            // Creates the router
            this.router = new (require('Router'));

            if(!Backbone.history.start()){
                window.location.hash = '/';
            }

            var arguments = {};

            this.widgetBar = new WidgetBar({
                el: '#widget_bar',

                widgets: [

                    {
                        name: "todo",
                        title: "Todo list",
                        icon: "todo/icon.png"
                    },

                    {
                        name: "sticky",
                        title: "Sticky note",
                        icon: "sticky/icon.png"
                    }

                ]
            });


            console.log("app initialized");
        };


        return window.app = App;
});
