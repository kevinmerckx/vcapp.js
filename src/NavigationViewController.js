WebApp.makeNavigationViewController = function(options, that) {
	'use strict';
	
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
				that.contentElement = that.element.querySelector("view");
				var top = that.contentElement.getAttribute("top");
				if(top) {
					that.push(WebApp.createViewController(top));
				}
				that.contentElement.removeAttribute("top");
			}
		);
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
		vc.navigationViewController = that;

		that.willPush(vc);
		that.willChangeTop();
		vc.willAppear();

		that.history.push(vc);
		var div = document.createElement('div');
		vc.loadView(div, function() {
			that.contentElement.appendChild(div);
			that.didPush(vc);
			that.didChangeTop();
			vc.didAppear();
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
}
