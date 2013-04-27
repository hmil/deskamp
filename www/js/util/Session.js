define(['Backbone'], function(){

    return Backbone.Model.extend({
        
        url: 'sess/',
        
        defaults: {
            me: "Guest"
        }
    });
});