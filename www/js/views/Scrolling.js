define(['app', 
		'text!/templates/Scrolling.jst',
		'backbone'], function(app, Template) {
	return Backbone.View.extend({
		lastPosition: {}, 
		currentPosition: {},

		lastScrollCheck: -1,

		horizontalScrollSpeed: 0, 
		verticalScrollSpeed: 0,

		events: {
			'mouseover #left-scroller': 'scrollLeft', 
			'mouseover #right-scroller': 'scrollRight', 
			'mouseover #top-scroller': 'scrollTop', 
			'mouseover #bottom-scroller': 'scrollBottom',
			'mouseout .scroller': 'stopScroll'
		},

		initialize: function() {

			if(!app) app = require('app');

			_.bindAll(this, 'updateScrollSpeed', 'onScroll', 'scrollLeft', 'scrollRight', 'scrollTop', 'scrollBottom', 
				'stopScroll', 'scrollTo', 'trackMouse', 'trackMove', 'untrackMouse');

			$(window).scroll(this.onScroll);
			$(window).resize(this.updateScrollSpeed);
			this.updateScrollSpeed();

			this.$el.on('mousedown', this.trackMouse);

			

			this.template = _.template(Template);
		},

		updateScrollSpeed: function() {
		    this.horizontalScrollSpeed = $(window).width()/100;
		    this.verticalScrollSpeed = $(window).height()/100;
		}, 

		onScroll: function(event) {
		    /* Only checks every 200ms */
		    var currentTime = new Date().getTime();
		    if ( !(this.lastScrollCheck === -1 || new Date().getTime() - this.lastScrollCheck >= 200)) return;

		    var scrollTop = $(document).scrollTop()
		      , scrollLeft = $(document).scrollLeft()
		      , $el       = this.$el;

		    var inViewportTags = app.tags.find(function(tag) {
		        return (tag.get('x') >= scrollTop && tag.get('x') <= scrollLeft + $(window).width())
		            && (tag.get('y') >= scrollTop && tag.get('y') <= scrollTop + $(window).height())
		    });

		    // If there is a tag in the viewport, we tag it in the url
		    if(typeof(inViewportTags) !== 'undefined') {
		        app.router.navigate("!"+inViewportTags.get('name'), false);
		    }
		    // Else, if there is a tag in the url but it's not in the viewport, we 
		    // remove it from the url
		    else if(Backbone.history.fragment.charAt(0) === '!') {
		    	window.location.hash = '/';
		    }
		    this.lastScrollCheck = currentTime;
		},

		scrollLeft: function(event) {
		    this.scrollingInterval = setInterval($.proxy(function() {
		        $(document).scrollLeft($(document).scrollLeft()-this.horizontalScrollSpeed);
		    }, this), 10);
		},

		scrollRight: function(event) {
		    this.scrollingInterval = setInterval($.proxy(function() {
		        $(document).scrollLeft($(document).scrollLeft()+this.horizontalScrollSpeed);
		    }, this), 10);
		},

		scrollTop: function(event) {
		    this.scrollingInterval = setInterval($.proxy(function() {
		        $(document).scrollTop($(document).scrollTop()-this.verticalScrollSpeed);
		    }, this), 10);
		}, 

		scrollBottom: function(event) {
		    this.scrollingInterval = setInterval($.proxy(function() {
		        $(document).scrollTop($(document).scrollTop()+this.verticalScrollSpeed);
		    }, this), 10);
		},

		stopScroll: function(event) {
		    if(typeof(this.scrollingInterval) != undefined) {
		        clearInterval(this.scrollingInterval);
		    }
		},
		
		scrollTo: function(xPos, yPos, delay) {
		    $('body, html').animate({
		        scrollTop: yPos,
		        scrollLeft: xPos
		    }, delay || 0);
		},

		trackMouse: function(event) {
		    event.stopPropagation();

		    this.$el.css('cursor', 'move');
		    this.initialPosition = {
		        left: event.clientX, 
		        top: event.clientY
		    };
		    
		    this.initialScroll = {
		        left: $(document).scrollLeft(),
		        top: $(document).scrollTop()
		    };

		    $(window).mousemove(this.trackMove).mouseup(this.untrackMouse);
		},
		
		trackMove: function(event) {
		    event.preventDefault();
		    event.stopPropagation();
		    event = event || window.event;
		    this.currentPosition = {
		        left: event.clientX, 
		        top: event.clientY
		    };
		    
		    $(document).scrollLeft(this.initialScroll.left - (this.currentPosition.left - this.initialPosition.left));
		    $(document).scrollTop(this.initialScroll.top - (this.currentPosition.top - this.initialPosition.top));

		    if (this.map) this.map.draggable.newpos();
		},

		untrackMouse: function(event) {
		    event.preventDefault();
		    event.stopPropagation();
		    $(window).unbind('mousemove', this.trackMove)
		            .unbind('mouseup', this.untrackMouse);
		    this.$el.css('cursor', 'default');
		}, 

		render: function() {
			this.$('#scrolling').html(this.template());
		}
	});
});