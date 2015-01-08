'use strict';

WebApp.ModalViewController = function (options) {
	var that = this;

	WebApp.ModalViewController.prototype.constructor.call(that, options);

	that.open = that.options.open || function() {};
	that.close = that.options.close || function() {};
	
	that.willOpen = that.options.willOpen || function() {};
	that.didOpen = that.options.didOpen || function() {};
	
	that.willClose = that.options.willClose || function() {};
	that.didClose = that.options.didClose || function() {};
};

WebApp.ModalViewController.prototype = new WebApp.ViewController();
