'use strict';

WebApp.PopupViewController = function (options) {
	var that = this;
	
	WebApp.PopupViewController.prototype.constructor.call(that, options);
	
	that.parentViewController = undefined;
	
	that.openIn = options.openIn || function(parentVC) {
		that.parentViewController = parentVC;
		that.willOpen();
		// Do something
		that.didOpen();
	};
	
	that.close = options.close || function() {
		that.willClose();
		// Do something
		that.didClose();
	};
	
	that.willOpen = options.willOpen || function() {};
	that.didOpen = options.didOpen || function() {};
	
	that.willClose = options.willClose || function() {};
	that.didClose = options.didClose || function() {};
};

WebApp.PopupViewController.prototype = new WebApp.ViewController();
