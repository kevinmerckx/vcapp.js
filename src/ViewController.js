WebApp.makeViewController = function(options, that) {
	'use strict';
	
	that = that || {};
	
	that.options = options || {};

	that.willLoad = that.options.willLoad || function() {};
	that.didLoad = that.options.didLoad || function() {};

	that.willAppear = that.options.willAppear || function() {};
	that.didAppear = that.options.didAppear || function() {};

	that.willUnload = that.options.willUnload || function() {};
	that.didUnload = that.options.didUnload || function() {};

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
		that.element.remove();
		done && done();
		that.didUnload();
	};
	
	return that;
};
