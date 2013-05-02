define(['core'], function(Core){
    
    return Core.Model.extend({
        
        url: 'sticky',
        
        defaults: {
            text: 'New sticky note'
        }
        
    });

});