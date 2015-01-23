define([], function () {
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
	};

	WebApp.registerViewController = function(id, vc, options) {
		this.viewControllers[id] = {
			maker: vc,
			options: options
		};
	};

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
	};

	WebApp.makeApplication = function(options, that) {
		that = that || {};
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
				that.setRootViewController(new WebApp.ViewController());
			}
			that.didLaunch();
		};

		that.getRootViewController = function() {
			return rootViewController;
		};

		that.setRootViewController = function(vc) {
			/**
			* 1. Unload the view of the previous root view controller if any
			* 2. Warns the delegate of the view controller that the view will appear
			* 3. Load the view into <body>
			* 4. When done, warns the delegate that the view appeared
			*/
			rootViewController && rootViewController.willUnappear();
			rootViewController && rootViewController.unloadView();
			rootViewController && rootViewController.didUnappear();
			rootViewController = vc;
			vc && vc.willAppear();
			vc && vc.loadView(document.querySelector("body"), function() {
				vc && vc.didAppear();
			});
		};

		return that;
	};

	WebApp.makeViewController = function(options, that) {

		that = that || {};

		that.options = options || {};

		that.willLoad = that.options.willLoad || function() {};
		that.didLoad = that.options.didLoad || function() {};

		that.willUnload = that.options.willUnload || function() {};
		that.didUnload = that.options.didUnload || function() {};

		that.willAppear = that.options.willAppear || function() {};
		that.didAppear = that.options.didAppear || function() {};

		that.willUnappear = that.options.willUnappear || function() {};
		that.didUnappear = that.options.didUnappear || function() {};

		that.element = undefined;

		that.uiElements = {};

		that.isLoaded = false;
		that.loadView = function(element, done) {
			/**
			* 1. Warn the delegate that the view will load
			* 2. If a template is given, go to step 4, otherwise go to step 3
			* 3. Nothing to load, warn the delegate the view did load
			* 4. Load the template into the element
			* 5. When done, look for every element with an "id" attribute
			* and store them into this.uiElements
			* 6. Call the callback "done" if any
			* 7. Warn the delegate that the view did load
			*/
			that.element = element;
			that.willLoad();
			if(that.options.template) {
				WebApp.loadTemplate(that.options.template).into(that.element, function() {
					that.isLoaded = true;
					Array.prototype.slice.call(that.element.querySelectorAll("*[id]")).forEach(function(el) {
						that.uiElements[el.getAttribute("id")] = el;
					});
					done && done();
					that.didLoad();
				});
			} else {
				that.didLoad();
			}
		};

		that.unloadView = function(done) {
			/**
			* 1. Warn the delegate that the view will unload
			* 2. Remove the element from the DOM
			* 3. Call the done callback
			* 4. Warn the delegate that the view did unload
			*/
			that.isLoaded = false;
			that.willUnload();
			done && done();
			that.didUnload();
		};

		return that;
	};

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

	WebApp.makeNavigationViewController = function(options, that) {

		that = WebApp.makeViewController(options, that);

		that.timeBeforeUnloadingView = that.options.timeBeforeUnloadingView || 100;

		that.willChangeTop = that.options.willChangeTop || function() {};
		that.didChangeTop = that.options.didChangeTop || function() {};
		that.willPush = that.options.willPush || function() {};
		that.didPush = that.options.didPush || function() {};
		that.willPop = that.options.willPop || function() {};
		that.didPop = that.options.didPop || function() {};

		that.contentElement;
		that.history = [];

		var superLoadView = that.loadView;
		that.loadView = function(element) {
			/**
			* When it loads the view, it looks at the "top" attribute of the "view" element.
			* Inside this attribute should be a view controller: we push this view controller.
			*/
			superLoadView.call(
				that, 
				element, 
				function() {
					that.contentElement = that.getContentElement();
					var top = that.getTopViewController();
					if(top) {
						that.push(WebApp.createViewController(top));
					}
				}
			);
		};

		var superUnloadView = that.unloadView;
		that.unloadView = function () {
			that.history.forEach(function (vc) {
				vc.willUnappear();
				vc.willUnload();
			});
			superUnloadView.call(
				that, 
				function () {
					that.history.forEach(function (vc) {
						vc.didUnappear();
						vc.didUnload();
					});
				});
		};

		/* default implementation */
		that.getContentElement = function () {
			return that.element.querySelector("view");
		};

		/* default implementation */
		that.getTopViewController = function () {
			var top = that.element.querySelector("view").getAttribute("top");
			that.contentElement.removeAttribute("top");
			return top;
		};

		that.push = function(vc) {
			/**
			* 1. Warn the delegate that a view controller will be pushed
			* 2. Warn the delegate that the top view controller will change
			* 3. Warn the pushed view controller that it will appear
			* 4. Create a div, load the view controller inside it
			* 5. Append this div to this.contentElement
			* 6. Warn the delegate that a view controller was pushed
			* 7. Warn the delegate that the top view controller has changed
			* 8. Warn the pushed view controller that it appeared
			*/
			var currentTop = that.top();
			vc.navigationViewController = that;

			that.willPush(vc);
			that.willChangeTop();
			vc.willAppear();
			currentTop && currentTop.willUnappear();

			that.history.push(vc);
			var div = document.createElement('div');
			vc.loadView(div, function() {
				that.contentElement.appendChild(div);
				that.didPush(vc);
				that.didChangeTop();
				vc.didAppear();
				currentTop && currentTop.didUnappear();
			});
		};

		that.pop = function() {
			/**
			* 1. Warn the delegate that the top view controller will be popped
			* 2. Warn the delegate that the top view controller will change
			* 3. Warn the next top view controller that it will appear
			* 4. Warn the delegate that the top view controller did pop
			* 5. Warn the delegate that the top view controller did change
			* 6. Warn the next top view controller that it did appear
			* 7. Wait "some time", warn the top view controller will unload
			* 8. Remove the top view from the DOM
			* 9. Warn the top view controller did unload
			*/
			var vc =  that.top();

			if(!vc) return;

			that.willPop(vc);
			that.willChangeTop();

			that.history.pop();

			var nextVC = that.top();

			nextVC && nextVC.willAppear();

			that.didPop(vc);
			that.didChangeTop();

			nextVC && nextVC.didAppear();

			setTimeout(function() {
				vc.willUnload();
				vc.element.remove();
				vc.didUnload();
			}, that.timeBeforeUnloadingView);
		};

		that.top = function() {
			if(that.history.length === 0) return;
			return that.history[that.history.length-1];
		};

		return that;
	};

	WebApp.makePopupViewController = function (options, that) {

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

	WebApp.makeTabsViewController = function (options, that) {

		that = WebApp.makeViewController(options, that);

		that.willSelect = options.willSelect || function () {};
		that.didSelect = options.didSelect || function () {};
		that.willUnselect = options.willUnselect || function () {};
		that.didUnselect = options.didUnselect || function () {};

		that.contentElement = undefined;
		that.tabs = [];
		that.selected = -1;

		var superLoadView = that.loadView;
		that.loadView = function (element) {
			/**
			* 1. Load the view
			* 2. Look for the <view> inside the element, it is the contentElement
			* 3. Look for the <tab> inside the <tabs> inside the element and
			* for each, create the corresponding view controller, container, get icon and label
			* 4. Remove the <tabs>
			*/
			superLoadView.call(
				that, element, function () {
					that.contentElement = that.element.querySelector("view");
					that.element.forEach("tabs tab", function(el) {
						that.tabs.push({
							label: el.getAttribute("label"),
							icon: el.getAttribute("icon"),
							viewController: WebApp.createViewController(el.getAttribute("root")),
							container: document.createElement('div'),
							isLoaded: false
						});
					});
					that.element.forEach("tabs", function(el) {
						el.remove();
					});
				}
			);
		};

		var superUnloadView = that.unloadView;
		that.unloadView = function () {
			that.tabs.forEach(function (t) {
				t.viewController.willUnappear();
				t.viewController.willUnload();
			});
			superUnloadView.call(
				that, 
				function () {
					that.tabs.forEach(function (t) {
						t.viewController.didUnappear();
						t.viewController.didUnload();
					});
				});
		};
		
		that.select = function (idx) {
			/**
			* 1. Warn the delegate that we will unselect the current tab
			* 2. Warn the delegate that we will select a tab
			* 3. Warn the view controller of the newly selected tab that its view will appear
			* 4. Load the view inside the tab container if necessary
			* 5. append the container of the tab it to the contentElement if necessary
			* 6. Warn the delegate that we did unselect the current tab
			* 7. Warn the delegate that we did select a tab
			* 8. Warn the view controller of the newly selected tab that its view did appear
			*/
			var previouslySelected = that.selected;
			if(idx<0 && idx >= that.tabs.length && idx != that.selected) {
				return;
			}
			previouslySelected >=0 && that.willUnselect(previouslySelected);
			that.willSelect(idx);
			that.tabs[idx].viewController.willAppear();
			previouslySelected >=0 && that.tabs[previouslySelected].viewController.willUnappear();
			if(!that.tabs[idx].isLoaded) {
				that.contentElement.appendChild(that.tabs[idx].container);
				that.tabs[idx].viewController.loadView(that.tabs[idx].container);
				that.tabs[idx].isLoaded = true;
			}

			previouslySelected >=0 && that.didUnselect(previouslySelected);
			that.selected = idx;
			that.didSelect(idx);
			that.tabs[idx].viewController.didAppear();
			previouslySelected >=0 && that.tabs[previouslySelected].viewController.didUnappear();
		};

		return that;
	};

	/* This function replaces the purpose of $.load */
	WebApp.loadTemplate = function(template) {
		return {
			into: function(element, done) {
				var req = new XMLHttpRequest();
				req.onload = function() {
					element.innerHTML = this.responseText;
					done && done();
				}
				req.open("get", template, true);
				req.send();
			}
		};
	};

	/* This function looks for the elements defined by the selector inside the current DOM element and apply the f function for each of them */
	HTMLElement.prototype.forEach = function(selector, f) {
		var els = this.querySelectorAll(selector);
		Array.prototype.slice.call(els).forEach(f);
	};

	return WebApp;
});

