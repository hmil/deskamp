
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
            "submit #tasks-list": "addItem",
            "click #tasks li a ": "deleteItem", 
            "change .todolist_element>input[type=checkbox]": "checkItem",
            "click .tdtitle": "editTitle", 
            "focusout .todo_title_editbox": "finishEditTitle", 
            "click .todolist_remove_item": "removeItem"
        },
        
        initialize: function() {
            this.model = new Model(this.model);
            
            this.template = _.template(template);

            _.bindAll(this, 'render', 'addItem', 'deleteItem', "editTitle", "finishEditTitle", "removeItem");
            
        },

        removeItem: function(event) {
            var $el = $(event.target);
            console.log($el.attr('data-name'));
            this.model.removeItem($el.attr('data-name'));
            this.render();
        },

        editTitle: function() {
            var title = this.$('.tdtitle');
            title.hide();
            this.$('.todo_title_editbox').val(title.html());
            this.$('.todo_title_edit').show();
        },

        finishEditTitle: function() {
            this.$('.todo_title_edit').hide();
            var newTitle = this.$('.todo_title_editbox').val();
            this.$('.tdtitle').html(newTitle).show();
            this.model.set('title', newTitle);
        },

        checkItem: function(event) {
            console.log("Checking item");
            var $el = $(event.target);
            if($el.is(':checked')) {
                this.model.checkItem($el.attr('data-name'));
            }
            else {
                this.model.uncheckItem($el.attr('data-name'));
            }
            this.render();
        }, 

        addItem: function(event){
            if(this.$('.add_task') == '') return false;

            event.preventDefault();
            event.stopPropagation();

            this.model.addItem({
                name: this.$('.add_task').val(),
                done: false
            });

            this.$('.add_task').val('').focus();

            this.render();

            return false;
        },

        deleteItem: function() {
            console.log("Deleting");
        },
        
        render: function(){
            console.log(this.model.toJSON());
            this.$el.html(
                this.template({
                    todo: this.model.toJSON()
                })
            );
        }
    });

});