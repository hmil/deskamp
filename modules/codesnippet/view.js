/**
*   Code snippet view. 
*
*   @todo Enable syntax coloration theme choice
*/

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
        
        prettifyLoaded: false, 
        prettifyLoading: false,

        initialize: function() {
            _.bindAll(this, 'render', 'editCode', 'finishEdit', 'handleTabulation', 'loadPrettify');

            this.template = _.template(template);
            this.render();

            this.model.on('change', this.render);
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
            this.model.set('code', newCode);
        },

        render: function() {
            this.$el.html(
                this.template({
                    snippet: this.model, 
                })
            );
            if(this.prettifyLoaded === false) {
                this.loadPrettify();
            }
            else {
                PR.prettyPrint();
            }
        }, 

        /**
        *   Loads the prettify script (syntaxic coloration) when needed
        */
        loadPrettify: function() {
            if(this.prettifyLoading === true) return;
            var prettifyUrl = "http://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?autoload=true&skin="+this.model.get('skin');

            this.prettifyLoading = true,
            $.getScript(prettifyUrl, $.proxy(function() {
                this.prettifyLoaded = true;
            }, this));
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
