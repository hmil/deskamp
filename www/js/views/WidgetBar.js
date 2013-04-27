
define([
    'text!templates/WidgetBar.jst',
    'modules',
    'backbone', 
    'jqueryUI'], function(templateString, modules){
    
    return Backbone.View.extend({
        
        initialize: function(params){
            
            this.template = _.template( templateString );
            
            this.widgets = modules;
            
            this.render();
        },
        
        render: function(){
            this.$el.html( this.template( {widgets: this.widgets} ) );
            
            console.log(this.widgets);
            this.$('[data-draggable="draggable"]').draggable({
                helper: "clone"
            });
            //change body to view 
            $('body').droppable({
                drop: function(event, ui) {
                    console.log(ui.draggable.attr("data-name"));
                    
                }
            });
        }
    
    });
});