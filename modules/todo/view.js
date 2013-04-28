
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
            "click [data-role=text]": "onStartEdit",
            "submit #tasks-list": "addItem",
            "click #tasks li a ": "deleteItem", 
            "change .todolist_element>input[type=checkbox]": "checkItem"

        },
        
        
        
        initialize: function(){
            if(!this.model){
                console.log("User created a new todo list");
                this.model = new Model();
            }
            
            this.template = _.template(template);

            _.bindAll(this, 'render', 'addItem', 'deleteItem');
            
        },

        checkItem: function(event) {
            console.log("Checking item");
            this.model.checkItem($(event.target).attr('data-name'));
            $(event.target).css('text-decoration', 'strike');
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