
define(["Session", "./model.js", "text!./template.jst", 'backbone'], 
    function(Session, Model, template){
    
    return Backbone.View.extend({
        
        /* Define these to attributes for the core to know how to layout your widget. */
        resizable: true,
        
        defaultSize: {
            width: 200,
            height: 160
        },
        
        /* Good old backbone code */
        events: {
            "focusout .sticky_content": "finishEdit", 
            "click .sticky_content[data-name=content]": 'editContent', 
            "focusout .sticky_content_editbox": "finishContentEdit"
        },

        editContent: function() {
            var $content = this.$('.sticky_content');
            $content.hide();
            this.$('.sticky_content[data-name=edit]').show();
            this.$('.sticky_content_editbox').val(this.$('.sticky_content').html());
        },

        finishContentEdit: function() {
            this.$('.sticky_content[data-name=edit]').hide();
            var newContent = $('.sticky_content_editbox').val();
            this.$('.sticky_content').html(newContent).show();
            this.model.set('text', newContent);
        },
        
        initialize: function(){
            this.model = new Model(this.model);
            
            this.template = _.template(template);

            _.bindAll(this, 'render', 'finishEdit', 'editContent', 'finishContentEdit');
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