define(['backbone'], function(){
    
    return Backbone.Model.extend({
        
        defaults: {
            path: []
        },
        
        addPath: function(path){
            this.set('path', this.get('path').concat([path]));
        }
        
    });

});