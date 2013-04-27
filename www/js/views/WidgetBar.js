
define(['text!templates/WidgetBar.jst', 'backbone', 'jqueryUI'], function(templateString){
    
    return Backbone.View.extend({
        
        initialize: function(params){
        
            this.template = _.template( templateString );
            
            this.widgets = params.widgets;
            
            this.render();
        },
        
        render: function(){
            
            console.log(this.widgets);
            this.$el.html( this.template( {widgets: this.widgets} ) );
            
            this.$('[data-draggable="draggable"]').draggable();
        }
    
    });
});