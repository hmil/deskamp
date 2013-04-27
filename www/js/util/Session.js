define(['backbone'], function(){

    return Backbone.Model.extend({
        
        url: 'sess/',
        
        defaults: {
            me: "Guest"
        }
    });
});