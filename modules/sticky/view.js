
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
            "click .sticky_title": "editTitle", 
            "focusout .sticky_title_editbox": "finishEditTitle",
            "click .sticky_content": "editContent", 
            "focusout .sticky_content_editbox": "finishEditContent"
        },
        
        initialize: function(){
            if(!this.model){
                console.log("User created a new sticky");
                this.model = new Model();
            }
            
            this.template = _.template(template);

            _.bindAll(this, 'render', 'editTitle', 'editContent', 'finishEditContent', 'finishEditTitle');
        },

        editTitle: function() {
            var $title = this.$('.sticky_title');
            $title.hide();
            this.$('.sticky_title_editbox').val($title.text());
            this.$('.sticky_title_edit').show();
        }, 

        finishEditTitle: function() {
            var newTitle = this.$('.sticky_title_editbox').val();
            this.$('.sticky_title_edit').hide();
            this.$('.sticky_title').text(newTitle)
                                   .show();
            this.model.set('title', newTitle);
        },

        editContent: function() {
            var $content = this.$('.sticky_content');
            $content.hide();
            this.$('.sticky_content_editbox').val($content.text().replace(/    /g, '').replace(/<br>/g, "\n"));
            this.$('.sticky_content_edit').show();
        },

        finishEditContent: function() {
            var newContent = this.$('.sticky_content_editbox').val().replace(/\\n/g, '<br>');
            this.$('.sticky_content_edit').hide();
            this.$('.sticky_content').html(newContent)
                                     .show();
            this.model.set('content', newContent);
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