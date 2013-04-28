
define(["Session", "./model.js", "text!./template.jst", 'backbone'], 
    function(Session, Model, template){
    
    return Backbone.View.extend({
        
        /* Define these to attributes for the core to know how to layout your widget. */
        resizable: true,
        
        defaultSize: {
            width: 300,
            height: 150
        },
        
        /* Good old backbone code */
        events: {
            "focusout .sticky_content": "finishEdit", 
            "sticky_content": 'focustest'
        },

        focusin: function() {
            alert("focusin");
        },
        
        initialize: function(){
            if(!this.model){
                console.log("User created a new sticky");
                this.model = new Model();
            }
            
            this.template = _.template(template);

            _.bindAll(this, 'render', 'finishEdit', 'focusin');
        },

        finishEdit: function() {
            var newContent = this.$('.sticky_content').val();

            this.model.set('content', newContent);
            
            console.log("edited");
        },
        
        render: function(){
            
            this.$el.html(
                this.template(
                    this.model.toJSON()
                )
            );
        }
    });

});