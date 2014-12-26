'use strict';

WebApp.TabsViewController = function (options) {
	var that = this;

	WebApp.ViewController.prototype.constructor.call(that, options);

	that.willSelect = options.willSelect || function () {};
	that.didSelect = options.didSelect || function () {};

	that.contentElement = undefined;
	that.tabs = [];
	that.selected = -1;
};

WebApp.TabsViewController.prototype = new WebApp.ViewController();
WebApp.TabsViewController.constructor = WebApp.TabsViewController;

WebApp.TabsViewController.prototype.loadView = function ($element) {
	var that = this;
	WebApp.ViewController.prototype.loadView.call(
		that, $element, function () {
			that.contentElement = $("view", that.element);
			that.contentElement = that.contentElement.length > 0 ? that.contentElement : $(that.contentElement[0]);
			$("tabs tab", that.element).each(function () {
				that.tabs.push({
					label: $(this).attr("label"),
					icon: $(this).attr("icon"),
					viewController: WebApp.createViewController($(this).attr("root")),
					container: $('<div>'),
					isLoaded: false
				});
			});
			$("tabs", that.element).remove();
		}
	);
};

WebApp.TabsViewController.prototype.select = function (idx) {
	var that = this;
	if(idx<0 && idx >= that.tabs.length && idx != that.selected) {
		return;
	}
	that.willSelect(idx);
	if(!that.tabs[idx].isLoaded) {
		that.contentElement.append(that.tabs[idx].container);
		that.tabs[idx].viewController.loadView(that.tabs[idx].container);
		that.tabs[idx].isLoaded = true;
	}
	if(that.selected >= 0) {
		that.tabs[that.selected].container.hide();
		that.tabs[idx].viewController.willAppear();
		that.tabs[idx].container.show();
		that.tabs[idx].viewController.didAppear();
	}
	that.selected = idx;
	that.didSelect(idx);
};
