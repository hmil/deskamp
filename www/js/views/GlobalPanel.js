
define (
    ['text!templates/GlobalPanel.jst',
     'backbone'],
    function(templateString){
            return Backbone.View.extend({

                intialize : function(){

                    this.template = _.template(templateString);

                    this.render();
                },

                render : function(){
                    this.$el.html( this.template() );


                }

            })
    }
);