/*
 * This is the only app router. It handles navigation and shows the proper views.
 */
define([
    'jquery',
    'backbone', 
    'app'
], function($, App){

    return Backbone.Router.extend({

        //Defines mapping between routes and methods
        routes: {
            "/": "index",
            ":left-:top": "scrollTo", 
            /* Attention : si besoin de changer la forme de la route ci-dessous, il faut la changer dans la sticky view et dans le onScroll de GlobalPanel */
            "!:anchor": "scrollToAnchor" 
        },

        //Called when the router is instanciated. 
        initialize: function (args) {
            this.panel = args.panel;
            if(!App) App = require('app');
        }, 

        index: function() {}, 

        scrollToAnchor: function(anchor) {
            var result  = App.tags.find(function(tag) {
                return tag.get('name') == anchor;
            });
            if(typeof(result) === 'undefined') {
                window.location.hash = '/';
            }
            else {
                App.globalPanel.scrollTo(result.get('x')-$(window).width()/2, result.get('y'), 1000);
            }
        }, 

        scrollTo: function(left, top) {
            App.scrollTo(left, top);
        }
    });
});
