
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
            "focusout .sticky_content_editbox": "finishEdit", 
            "click .sticky_content": 'editContent', 
            "click a": "cancelEvent",
            "focusout .sticky_content_editbox": "finishContentEdit"
        },

        cancelEvent: function(event) {
            event.stopPropagation();
            return true;
        },

        editContent: function(event) {
            var $content = this.$('.sticky_content');
            $content.hide();
            this.$('.sticky_content_edit').show();
            
            this.$('.sticky_content_editbox').focus();
        },

        finishContentEdit: function() {
            // console.log("Value : "+this.$('.sticky_content_editbox').val());
            this.$('.sticky_content_edit').hide();
            var newContent = this.$('.sticky_content_editbox').val();
            this.$('.sticky_content').html(this.parse(newContent)).show();
            this.model.set('text', newContent);
        },
        parse: function(c) {
            return c
                .replace(/#([a-zA-Z0-9.-]+)/gi, '<a href="#anchor/$1">$1</a>')
                .replace(/\n/gi, '<br />');

        },

        initialize: function(){
            this.model = new Model(this.model);
            
            this.template = _.template(template);

            _.bindAll(this, 'render', 'finishEdit', 'editContent', 'finishContentEdit');
        },

        finishEdit: function() {
            var newContent = this.$('.sticky_content').val();

            this.model.set('text', newContent);
        },
        
        render: function(){
            var model = this.model.toJSON();
            this.$el.html(
                this.template({
                    humanText : this.parse(model.text), 
                    rawText: model.text
                })
            );
        }
    });

});