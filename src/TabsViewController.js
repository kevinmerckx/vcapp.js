WebApp.makeTabsViewController = function (options, that) {
	'use strict';
	
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
	
	return that;
};

