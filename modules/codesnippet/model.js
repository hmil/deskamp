define(['Core'], function(Core){
    
    return Core.Model.extend({
        
        url: "codesnippet",
        
        defaults: {
            language: "js", 
            code: "print 'Enter your code here';",
            skin: "desert"
        }
        
    });

});