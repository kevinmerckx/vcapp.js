WebApp.makeModalViewController = function (options, that) {
	'use strict';
	
	that = WebApp.makeViewController(options, that);

	that.open = that.options.open || function() {};
	that.close = that.options.close || function() {};

	that.willOpen = that.options.willOpen || function() {};
	that.didOpen = that.options.didOpen || function() {};

	that.willClose = that.options.willClose || function() {};
	that.didClose = that.options.didClose || function() {};
	
	return that;
};
