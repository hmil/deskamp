define(['backbone'], function(){
    
    return Backbone.Model.extend({
        
        defaults: {
            language: "js", 
            code: "print 'Enter your code here';",
            skin: "desert"
        }
        
    });

});