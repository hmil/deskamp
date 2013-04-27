/*
 * This is the only app router. It handles navigation and shows the proper views.
 */
define([
    'backbone'
], function(
){
    return Backbone.Router.extend({

        //Defines mapping between routes and methods
        routes: {
            "": "index"
        },

        //Called when the router is instanciated. 
        initialize: function () {
        }
    });
});
