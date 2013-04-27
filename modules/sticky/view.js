
define(["Session", "model", "text!template.jst", 'backbone'], 
    function(Session, Model, template){
    
    return new Backbone.View.extend({
        
        /* Define these to attributes for the core to know how to layout your widget. */
        resizable: true,
        
        defaultSize: {
            width: 300,
            height: 150
        },
        
        /* Good old backbone code */
        
        events: {
            "click [data-role=text]": "onStartEdit"
        },
        
        
        
        initialize: function(){
            if(!this.model){
                console.log("User created a new sticky");
                this.model = new Model();
            }
            
            this.template = _.template(template);
            
        },
        
        render: function(){
            
            this.$el.html(
                this.template(
                    this.model.toJSON()
                )
            );
        },
        
        onStartEdit: function(){
            console.log("hello : "+Session.get('me'));
        }
    });

});