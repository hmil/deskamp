
define(["Session", "./model.js", "text!./template.jst", 'backbone'], 
    function(Session, Model, template){
    
    return Backbone.View.extend({
        
        /* Define these to attributes for the core to know how to layout your widget. */
        resizable: true,
        
        defaultSize: {
            width: 200,
            height: 300
        },
        
        /* Good old backbone code */
        
        events: {
            "click [data-role=text]": "onStartEdit",
            "click #tasks li a ": "deleteItem", 
            "change .todolist_element>input[type=checkbox]": "checkItem",
            "click .tdtitle": "editTitle", 
            "focusout .todo_title_editbox": "finishEditTitle", 
            "click .todolist_remove_item": "removeItem", 
            "keydown .todo_title_editbox": "checkEditEnd",
            "submit [data-action=addItem]": "onAddItemSubmit"
        },
        
        initialize: function() {
            
            this.template = _.template(template);

            _.bindAll(this, 'render', "editTitle", 
                "finishEditTitle", "removeItem", "checkEditEnd", "onAddItemSubmit");
            
            // This is dirty, consider changing
            this.model.on('change', this.render);
        },

        removeItem: function(event) {
            var $el = $(event.target);
            console.log($el.attr('data-name'));
            this.model.removeItem($el.attr('data-name'));
        },

        editTitle: function() {
            var $title = this.$('.tdtitle');
            var $editbox = this.$('.todo_title_editbox');
            
            $title.hide();
            $editbox.val($title.html());
            this.$('.todo_title_edit').show();
            $editbox.focus();
            if($editbox.val() == this.model.defaults.title) {
                $editbox.select();
            }
        },

        checkEditEnd: function(event) {
            var keycode = event.keycode || event.which;
            if(keycode == 13) {
                this.finishEditTitle();
            }
        }, 

        finishEditTitle: function() {
            this.$('.todo_title_edit').hide();
            var newTitle = this.$('.todo_title_editbox').val();
            this.$('.tdtitle').html(newTitle).show();
            this.model.set('title', newTitle);
        },

        checkItem: function(event) {
            var $el = $(event.target);
            if($el.is(':checked')) {
                this.model.checkItem($el.attr('data-name'));
            }
            else {
                this.model.uncheckItem($el.attr('data-name'));
            }
        },
        
        onAddItemSubmit: function(event){
            event.preventDefault();
            event.stopPropagation();
            
            this.model.addItem(this.addTaskNameInput.val());
        },

        render: function(){
            this.$el.html(
                this.template({
                    todo: this.model.toJSON(), 
                    parse: this.parse
                })
            );
            
            this.addTaskNameInput = this.$('[data-addTask=name]');
            this.addTaskNameInput.focus();
        }, 

        parse: function(c) {
            return c
                .replace(/#([a-zA-Z0-9.-]+)/gi, '<a href="#!$1">$1</a>')
                .replace(/\n/gi, '<br />');
        }
    });

});