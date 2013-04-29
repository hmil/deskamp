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
            ":left-:top": "scrollTo", 
            "anchor/:route": "scrollToAnchor"
        },

        //Called when the router is instanciated. 
        initialize: function () {
            if(!App) App = require('app');
        }, 

        default: function() {
            console.log("default");
        }, 

        scrollToAnchor: function(anchor) {
            var result  = App.tags.find(function(tag) {
                return tag.get('name') == anchor;
            });
            if(typeof(result) === 'undefined') {
                window.location.hash = '/';
            }
            else {
                App.scrollTo(result.get('x'), result.get('y'));
            }
        }, 

        scrollTo: function(left, top) {
            App.scrollTo(left, top);
        }
    });
});
