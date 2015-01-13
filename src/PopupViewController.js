WebApp.makePopupViewController = function (options, that) {
	'use strict';
	
	that = WebApp.makeViewController(options, that);

	that.parentViewController = undefined;

	that.openIn = that.options.openIn || function(parentVC) {
		that.parentViewController = parentVC;
		that.willOpen();
		// Do something
		that.didOpen();
	};

	that.close = that.options.close || function() {
		that.willClose();
		// Do something
		that.didClose();
	};

	that.willOpen = that.options.willOpen || function() {};
	that.didOpen = that.options.didOpen || function() {};

	that.willClose = that.options.willClose || function() {};
	that.didClose = that.options.didClose || function() {};
	
	return that;
};
