
define(['models/Widget', 'backbone'], function(Widget){
    
    return Backbone.Collection.extend({
        model: Widget,
        
        url: "widget",
        
        initialize: function(){
            this.on('destroy', function(model){
                console.log(model);
                this.remove(model);
            });
        }
    });
});