define(['text!/templates/tag.jst', '/js/models/Tag.js', 'backbone'], function(TagTemplate, Tag) {
	return Backbone.View.extend({
		events: {
            "mouseenter": "onMouseenter",
            "mouseleave": "onMouseleave",
            "click [data-click=destroy]": "onDestroyClick"
        },
        
        initialize: function(){
            
            _.bindAll(this, 'onMouseenter', 'onMouseleave', 'onDestroyClick', 'onModelDestroy');
            
            this.template = _.template(TagTemplate);
            
            this.model.on('destroy', this.onModelDestroy);
            
            this.render();
        },
        
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            
            this.$el.offset({
				left: this.model.get('x'), 
				top: this.model.get('y')
			});
            
            this.destroyButton = this.$('[data-click=destroy]').hide();
            this.$el.css({
                'position': 'absolute',
                'z-index': 10
            });
        },
        
        onMouseenter: function(evt){
            this.destroyButton.fadeIn({duration: 'fast'});
        },
        
        onMouseleave: function(evt){
            this.destroyButton.fadeOut({duration: 'fast'});
        },
        
        onDestroyClick: function(evt){
            evt.preventDefault();
            
            this.model.destroy();
        },
        
        onModelDestroy: function(){
            this.$el.remove();
        }
    });
});