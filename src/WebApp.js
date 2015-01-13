'use strict';

var WebApp = {
	app: undefined,
	apps: {},
	viewControllers: {}
};

WebApp.registerApp = function(id, app, options) {
	this.apps[id] = {
		maker: app,
		options: options
	};
}

WebApp.registerViewController = function(id, vc, options) {
	this.viewControllers[id] = {
		maker: vc,
		options: options
	};
}

WebApp.createViewController = function(id, options) {
	if(this.viewControllers[id]) {
		var fullOpts = {};
		for(var key in this.viewControllers[id].options) {
			fullOpts[key] = this.viewControllers[id].options[key];
		}
		for(var key in options) {
			fullOpts[key] = options[key];
		}
		return (this.viewControllers[id].maker)(fullOpts);
	}
}
