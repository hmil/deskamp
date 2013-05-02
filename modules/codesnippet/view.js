
define(["./model.js", "text!./template.jst", './textareaUtils.js', 'backbone'], 
    function(CodeSnippetModel, template){

    return Backbone.View.extend({
        
        resizable: true,
        
        defaultSize: {
            width: 400,
            height: 300
        },

        events: {
            'click .code-content': 'editCode',
            'keydown .code-editbox': 'handleTabulation',
            'focusout .code-editbox': 'finishEdit'
        }, 
        
        initialize: function() {
            _.bindAll(this, 'render', 'editCode', 'finishEdit', 'handleTabulation');

            this.model = new CodeSnippetModel();

            this.template = _.template(template);
            this.render();

        }, 

        editCode: function() {
            var $code = this.$('.code-content');
            $code.removeClass('prettyprinted');
            $code.hide();
            this.$('.code-edit').show();
            this.$('.code-editbox').val($code.text())
                .focus()
                .setCursorPosition($code.text().length);
        },

        finishEdit: function() {
            var newCode = this.$('.code-editbox').val();
            this.$('.code-edit').hide();
            this.$('.code-content').text(newCode);
            this.$('.code-content').show();
            PR.prettyPrint();
        },

        render: function() {
            this.$el.html(
                this.template({
                    snippet: this.model, 
                    loadPrettify: true
                })
            );
        }, 

        /**
        *   When pressing tab, the default browser behaviour is to
        *   focusout the current input element to go the next one.
        *   In this context, we just want to insert a tab whenever the 
        *   tab key is pressed.
        */
        handleTabulation: function(event) {
            var keycode = event.keycode || event.which;
            if(keycode == 9) {
                event.preventDefault();
                this.$('.code-editbox').insertAtCursor("\t");
            }
        }

    });

});
