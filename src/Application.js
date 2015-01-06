'use strict';

WebApp.Application = function(options) {
	var that = this;
	options = options || {};

	var rootViewController;

	that.willLaunch = options.willLaunch || function() {};
	that.didLaunch = options.didLaunch || function() {};
	
	that.launch = function() {
		/**
		* 1. warns the delegate that the app will launch
		* 2. If a root view controller is given, 
		* assign it to the root view controller of the app, create the view controller
		* 2.b. If no root provided, assign the defaut ViewController
		* 3. warns the delegate that the app did launch
		*/
		that.willLaunch();
		if(options.rootViewController && WebApp.viewControllers[options.rootViewController]) {
			that.setRootViewController(WebApp.createViewController(options.rootViewController));
		} else {
			that.setRootViewController(new ViewController());
		}
		that.didLaunch();
	}

	that.setRootViewController = function(vc) {
		/**
		* 1. Unload the view of the previous root view controller if any
		* 2. Warns the delegate of the view controller that the view will appear
		* 3. Load the view into <body>
		* 4. When done, warns the delegate that the view appeared
		*/
		rootViewController && rootViewController.unloadView();
		rootViewController = vc;
		vc && vc.willAppear();
		vc.loadView(document.querySelector("body"), function() {
			vc && vc.didAppear();
		});
	}
}
