/*
 * main.js is the only file explicitly loaded by require (see index.html)
 * It will load every main classes needed by app to initialize.
 * One doesn't need to specify here sub-dependencies.
*/

requirejs.config({
    paths: {
        'socket.io': '/socket.io/lib/socket.io',
        'underscore': '/js/lib/underscore',
        'backbone': '/js/lib/backbone',
        'templates': '/templates',
        'Session': '/js/util/Session',
        'jqueryUI': '/js/lib/jquery-ui-1.10.2.custom.min'
    }
});


require([
    "jquery",
    "app"],
    
    /*
        The arguments of the callback function are the required objects 
        in the same order as in the list above. Therefore, we retreive jquery
        first, then the app object.
    */
    function($, app) {
    
        /* We can still use jquery to make sure the dom is completely loaded even though
            it's very unlikely it isn't already loaded. */
        $(function() {
            //Initializing app
            app.init();
        });
});