/*
 * This is the only app router. It handles navigation and shows the proper views.
 */
define([
    'app',
    'jquery',
    'backbone'
], function(App, $){

    return Backbone.Router.extend({

        //Defines mapping between routes and methods
        routes: {
            "/": "default",
            "pos::left-:top": "scrollTo", 
            "anchor/:route": "scrollToAnchor"
        },

        //Called when the router is instanciated. 
        initialize: function () {

        }, 

        default: function() {
            console.log("default");
        }
    });
});
