
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
            "submit #tasks-list": "onSub",
            "click #tasks li a ": "del"

        },
        
        
        
        initialize: function(){
            if(!this.model){
                console.log("User created a new sticky");
                this.model = new Model();
            }
            
            this.template = _.template(template);
            
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
        },

        onSub: function(){
            var i= 0;
            console.log("onSub");
            if (  $("#task").val() != "" ) {

                var task = $("#task").val();
                console.log($("#task").val());
                $("#tasks").append("<li id='task-"+i+"'>"+ task +" <a href='#'>x</a></li>");
                $("#task").val("");
                i++;
            }
        return false;
        },

        del: function() {
            console.log($(this));
            $(this).hide();


        }
    });

});