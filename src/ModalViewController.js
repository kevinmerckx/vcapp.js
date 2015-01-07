'use strict';

WebApp.ModalViewController = function (options) {
	var that = this;

	WebApp.ModalViewController.prototype.constructor.call(that, options);

	that.open = options.open || function() {};
	that.close = options.close || function() {};
	
	that.willOpen = options.willOpen || function() {};
	that.didOpen = options.didOpen || function() {};
	
	that.willClose = options.willClose || function() {};
	that.didClose = options.didClose || function() {};
};

WebApp.ModalViewController.prototype = new WebApp.ViewController();
