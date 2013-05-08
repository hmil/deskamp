define(['Core'], function(Core){
    
    return Core.Model.extend({
        url: 'frame',
        
        defaults: {
            title: 'New frame'
        }
        
    });

});