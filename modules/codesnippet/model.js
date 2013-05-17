define(['Core'], function(Core){
    
    return Core.Model.extend({
        
        url: "codesnippet",
        
        defaults: {
            code: "print 'Enter your code here';",
            skin: "desert"
        }
        
    });

});