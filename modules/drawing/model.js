define(['core'], function(Core){
    
    return Core.Model.extend({
        
        url: 'drawing',
        
        defaults: {
            path: []
        },
        
        addPath: function(path){
            var p = _.clone(this.get('path'));
            p.push(path);
            
            this.set('path', p);
        }
        
    });

});