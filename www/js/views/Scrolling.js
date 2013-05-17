define(['app', 
		'text!/templates/Scrolling.jst',
		'hoverIntent',
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

		/**
		*	Delay to wait (in milliseconds) when the mouse is
		*   on a edge scroller before beginning the scroll
		*/
		edgeScrollDelay: 350,

		/**
		*	Indicates if the user is currently scrolling.
		*	Used for arrow keys, to avoid setting timeouts too often, 
		*	for the 'keydown' event is triggered many times when a key
		*	stays pressed
		*/
		isScrolling: false,
		scrollingKey: -1,

		events: {
			'mouseout .scroller': 'stopScroll',
		},

		initialize: function() {
			// Handling circular dependencies
			if(!app) app = require('app');

			// Binding context
			_.bindAll(this, 
				'updateScrollSpeed', 'onScroll', 'stopScroll', 'scrollTo', 
				'trackMouse', 'trackMove', 'untrackMouse', 'edgeScroll', 
				'arrowsScroll', 'launchScroll', 'stopArrowsScroll');

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

			$('html').keydown(this.arrowsScroll);
			$('html').keyup(this.stopArrowsScroll);
		},

		updateScrollSpeed: function() {
		    this.horizontalScrollSpeed = $(window).width()/70;
		    this.verticalScrollSpeed = $(window).height()/70;
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
		        return (tag.get('x') >= scrollLeft && tag.get('x') <= scrollLeft + $(window).width())
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
		* Edge scrolling function.
		* Sets a timeout with a scroll increment depending
		* on which scroller the mouse is
		*/

		edgeScroll: function(event) {
			var xIncrement = 0
			  , yIncrement = 0;

			switch($(event.target).attr('data-scroll').toLowerCase()) {
				case 'left': 
					xIncrement = -this.horizontalScrollSpeed;
					break;
				case 'right': 
					xIncrement = this.horizontalScrollSpeed;
					break;
				case 'top': 
					yIncrement = -this.verticalScrollSpeed;
					break;
				case 'bottom': 
					yIncrement = this.verticalScrollSpeed;
					break;
				default: 
					return;
			}
			this.launchScroll(xIncrement, yIncrement);
		},

		arrowsScroll: function(event) {
			var keycode = event.keycode || event.which;
			if( (keycode != 40 && keycode != 38 && keycode != 37 && keycode != 39) || (this.isScrolling === true && this.scrollingKey == keycode)) return;
			//console.log(keycode);
			var xIncrement = 0
			  , yIncrement = 0;

			 switch(keycode) {
			 	case 38: // Up arrow
			 		yIncrement = -this.verticalScrollSpeed;
			 		break;
			 	case 40: // Down arrow
			 		yIncrement = this.verticalScrollSpeed;
			 		break;
			 	case 37: // Left arrow
			 		xIncrement = -this.horizontalScrollSpeed;
			 		break;
			 	case 39: // Right arrow
			 		xIncrement = this.horizontalScrollSpeed;
			 		break;
			 }
			 this.scrollingKey = keycode;
			 this.launchScroll(xIncrement, yIncrement);

		}, 

		launchScroll: function(xIncrement,  yIncrement) {
			if(typeof(xIncrement) === 'undefined' || typeof(yIncrement) === 'undefined') return;

			// If there already a scroll interval, we clear it
			this.stopScroll();

			// We define the scrolling interval
			this.scrollingInterval = setInterval($.proxy(function() {
				if(xIncrement !== 0) $(document).scrollLeft($(document).scrollLeft() + xIncrement);
				if(yIncrement !== 0) $(document).scrollTop($(document).scrollTop() + yIncrement);
			}, this), 10);
			this.isScrolling = true;
		},

		stopArrowsScroll: function(event) {
			var keycode = event.keycode || event.which;
			if( (keycode == 40 || keycode == 38 || keycode == 37 || keycode == 39)) {
				this.stopScroll();
			}
		},
		
		stopScroll: function(event) {
		    if(typeof(this.scrollingInterval) != undefined) {
		        clearInterval(this.scrollingInterval);
		    }
		    this.isScrolling = false;
		    this.scrollingKey = -1;
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
			this.$('.scroller').hoverIntent(this.edgeScroll, function(){}, this.edgeScrollDelay);
		}
	});

	return ScrollingView;
});