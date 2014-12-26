'use strict';

$(function() {
	var idApp = $("body").attr("app");
	$("body").removeAttr("app");
	var constructor = WebApp.apps[idApp].constructor;
	var wa = new constructor(WebApp.apps[idApp].options);
	WebApp.app = wa;
	wa.launch();
});

var WebApp = {
	app: undefined,
	apps: {},
	viewControllers: {}
};

WebApp.registerApp = function(id, app, options) {
	this.apps[id] = {
		constructor: app,
		options: options
	};
}

WebApp.registerViewController = function(id, vc, options) {
	this.viewControllers[id] = {
		constructor: vc,
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
		return new (this.viewControllers[id].constructor)(fullOpts);
	}
}

WebApp.Application = function(options) {
	var that = this;
	options = options || {};

	var rootViewController;

	that.willLaunch = options.willLaunch || function() {};
	that.didLaunch = options.didLaunch || function() {};

	that.launch = function() {
		that.willLaunch();
		if(options.rootViewController && WebApp.viewControllers[options.rootViewController]) {
			that.setRootViewController(WebApp.createViewController(options.rootViewController));
		} else {
			that.setRootViewController(new ViewController());
		}
		that.didLaunch();
	}

	that.setRootViewController = function(vc) {
		rootViewController = vc;
		rootViewController && rootViewController.willUnload();
		$("body").empty();
		rootViewController && rootViewController.didUnload();
		rootViewController.loadView($("body"));
	}
}
