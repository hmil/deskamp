
define(["Session", "./model.js", "text!./template.jst", 'backbone'], 
    function(Session, Model, template){
    
    return Backbone.View.extend({
        
        /* Define these to attributes for the core to know how to layout your widget. */
        resizable: true,
        
        defaultSize: {
            width: 200,
            height: 200
        },
        
        /* Good old backbone code */
        events: {
            "click .frametitle": "editTitle", 
            "focusout .frame_title_editbox": "finishEditTitle"
        },

        initialize: function() {
            
            this.template = _.template(template);

            _.bindAll(this, 'render', "editTitle", "finishEditTitle");
            
            this.model.on('change', this.render);
        },

        editTitle: function() {
            var title = this.$('.frametitle');
            title.hide();
            this.$('.frame_title_editbox').val(title.html());
            this.$('.frame_title_edit').show();
        },

        finishEditTitle: function() {
            this.$('.frame_title_edit').hide();
            var newTitle = this.$('.frame_title_editbox').val();
            this.$('.frametitle').html(newTitle).show();
            this.model.set('title', newTitle);
        },

        render: function(){
            console.log(this.model.toJSON());
            this.$el.html(
                this.template({
                    frame: this.model.toJSON()
                })
            );
        }
        
    });

});