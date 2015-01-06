'use strict';

WebApp.TabsViewController = function (options) {
	var that = this;

	WebApp.ViewController.prototype.constructor.call(that, options);

	that.willSelect = options.willSelect || function () {};
	that.didSelect = options.didSelect || function () {};
	that.willUnselect = options.willUnselect || function () {};
	that.didUnselect = options.didUnselect || function () {};

	that.contentElement = undefined;
	that.tabs = [];
	that.selected = -1;
};

WebApp.TabsViewController.prototype = new WebApp.ViewController();
WebApp.TabsViewController.constructor = WebApp.TabsViewController;

WebApp.TabsViewController.prototype.loadView = function (element) {
	var that = this;
	WebApp.ViewController.prototype.loadView.call(
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

WebApp.TabsViewController.prototype.select = function (idx) {
	var that = this;
	if(idx<0 && idx >= that.tabs.length && idx != that.selected) {
		return;
	}
	that.selected>=0 && that.willUnselect(that.selected);
	that.willSelect(idx);
	that.tabs[idx].viewController.willAppear();
	if(!that.tabs[idx].isLoaded) {
		that.contentElement.appendChild(that.tabs[idx].container);
		that.tabs[idx].viewController.loadView(that.tabs[idx].container);
		that.tabs[idx].isLoaded = true;
	}
	
	that.selected>=0 && that.didUnselect(that.selected);
	that.selected = idx;
	that.didSelect(idx);
	that.tabs[idx].viewController.didAppear();
};
