'use strict';

WebApp.NavigationViewController = function(options) {
	var that = this;

	WebApp.ViewController.prototype.constructor.call(that, options);

	that.willChangeTop = options.willChangeTop || function() {};
	that.didChangeTop = options.didChangeTop || function() {};
	that.willPush = options.willPush || function() {};
	that.didPush = options.didPush || function() {};
	that.willPop = options.willPop || function() {};
	that.didPop = options.didPop || function() {};

	that.contentElement;
	that.history = [];
}

WebApp.NavigationViewController.prototype = new WebApp.ViewController();
WebApp.NavigationViewController.constructor = WebApp.NavigationViewController;

WebApp.NavigationViewController.prototype.loadView = function($element) {
	var that = this;
	WebApp.ViewController.prototype.loadView.call(
		that, 
		$element, 
		function() {
			that.contentElement = $("view", that.element);
			that.contentElement = that.contentElement.length>0 ? 
				that.contentElement : $(that.contentElement[0]);
			var top = that.contentElement.attr("top");
			if(top) {
				that.push(WebApp.createViewController(top));
			}
			that.contentElement.removeAttr("top");
		}
	);
}

WebApp.NavigationViewController.prototype.push = function(vc) {
	var that = this;
	vc.navigationViewController = that;

	that.willPush(vc);
	that.willChangeTop();
	vc.willAppear();
	
	that.history.push(vc);
	var $div = $('<div>');
	vc.loadView($div, function() {
		$div.appendTo(that.contentElement);
		that.didPush(vc);
		that.didChangeTop();
		vc.didAppear();
	});
}

WebApp.NavigationViewController.prototype.pop = function() {
	var that = this;

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
	}, 5000);
}

WebApp.NavigationViewController.prototype.top = function() {
	var that = this;
	if(that.history.length === 0) return;
	return that.history[that.history.length-1];
}
