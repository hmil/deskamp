
define(['models/Widget', 'backbone'], function(Widget){
    
    return Backbone.Collection.extend({
        model: Widget,
        
        url: "widget"
    });
});