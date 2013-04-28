
define(["Session", "./model.js", "text!./template.jst", 'backbone'], 
    function(Session, Model, template){
    
    return Backbone.View.extend({
        
        /* Define these to attributes for the core to know how to layout your widget. */
        resizable: true,
        
        defaultSize: {
            width: 300,
            height: 250
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
            this.model = new Model(this.model);
            
            this.template = _.template(template);

            _.bindAll(this, 'render', 'finishEdit', 'focusin');
        },

        finishEdit: function() {
            var newContent = this.$('.sticky_content').val();

            this.model.set('text', newContent);
            
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