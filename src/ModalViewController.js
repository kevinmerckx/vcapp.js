'use strict';

WebApp.ModalViewController = function (options) {
	var that = this;

	that.open = options.open || function() {};
	that.close = options.close || function() {};
	
	that.willOpen = options.willOpen || function() {};
	that.didOpen = options.didOpen || function() {};
	
	that.willClose = options.willClose || function() {};
	that.didClose = options.didClose || function() {};
	
	WebApp.ViewController.prototype.constructor.call(that, options);
};

WebApp.ModalViewController.prototype = new WebApp.ViewController();
WebApp.ModalViewController.constructor = WebApp.ModalViewController;

