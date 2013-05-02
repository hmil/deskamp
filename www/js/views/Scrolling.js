define(['app', 
		'text!/templates/Scrolling.jst',
		'backbone'], function(app, Template) {
	/**
	* Module representing the scroll features. All scroll-related
	* functions (edge scroll, click scroll, ...) are there
	*/

	var ScrollingView = Backbone.View.extend({
		/**
			@lends module:views/Scrolling~ScrollingView.prototype
		*/

		/**
		*	The last scroll position detected
		*/
		lastPosition: {}, 

		/**
		*	The current position of the scroll
		*/ 
		currentPosition: {},

		/**
		*	The last time the view checked if a tag was present
		*	in the viewport (in order to update the URL)
		*/
		lastScrollCheck: -1,

		/**
		*	Horizontal & vertical scroll speeds
		*	(fitting to the viewport size)
		*/
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
			// Handling circular dependencies
			if(!app) app = require('app');

			// Binding context
			_.bindAll(this, 
				'updateScrollSpeed', 'onScroll', 'scrollLeft', 'scrollRight', 
				'scrollTop', 'scrollBottom', 'stopScroll', 'scrollTo', 
				'trackMouse', 'trackMove', 'untrackMouse');

			/** 
			* When the window is scrolled, call onScroll method so
			* it can detect if a tag is present in the viewport 
			*/
			$(window).scroll(this.onScroll);

			// When the window is resized, we update the scroll speed 
			$(window).resize(this.updateScrollSpeed);

			// We also need to initialize it
			this.updateScrollSpeed();

			// Track mouse position when panel is clicked, to handle click scroll
			this.$el.on('mousedown', this.trackMouse);

			// Initializing template
			this.template = _.template(Template);
		},

		updateScrollSpeed: function() {
		    this.horizontalScrollSpeed = $(window).width()/100;
		    this.verticalScrollSpeed = $(window).height()/100;
		}, 

		onScroll: function(event) {
		    /* Only checks every 200ms */
		    var currentTime = new Date().getTime();
		    if ( !(this.lastScrollCheck === -1 || new Date().getTime() - this.lastScrollCheck >= 200)) {
		    	return;
		    }

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

		/**
		* Edge scrolling functions.
		* Each of these work the same way : when mouse is detected on a edge scroller, 
		* set an interval to update the scrollLeft / scrollTop of the map. 
		* This interval is cleared as soon as the mouse is not on a scroller anymore.
		*/
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

		/**
		*	Scrolls to (xPos, yPos) within a certain delay if specified, or immediatly
		* 	@param {double} xPos: the x position of the point to scroll to
		*	@param {double} yPos: the y position of the point to scroll to
		*   @param {double} delay: (optionnal) animation delay, in milliseconds. 0 if not specified
		*/
		scrollTo: function(xPos, yPos, delay) {
		    $('body, html').animate({
		        scrollTop: yPos,
		        scrollLeft: xPos
		    }, delay || 0);
		},

		/**
		*	Enable mouse move tracking when the mouse button is down
		*/
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

		    $(window)
		    	.mousemove(this.trackMove)
				.mouseup(this.untrackMouse);
		},
		
		/**
		*	Tracks the mouse move when the mouse button is down, to handle mouse scrolling
		*/
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

		/**
		*	Untracks the mouse move, when the mouse button is back up
		*/
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

	return ScrollingView;
});