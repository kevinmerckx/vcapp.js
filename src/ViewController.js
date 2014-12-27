'use strict';

WebApp.ViewController = function(options) {
    var that = this;
    
    that.options = options || {};

    that.willLoad = that.options.willLoad || function() {};
    that.didLoad = that.options.didLoad || function() {};

	that.willAppear = that.options.willAppear || function() {};
	that.didAppear = that.options.didAppear || function() {};
	
	that.willUnload = that.options.willUnload || function() {};
    that.didUnload = that.options.didUnload || function() {};

    that.element = undefined;
    
    that.uiElements = {};
}

WebApp.ViewController.prototype.loadView = function(_$element, done) {
    var that = this;
    that.element = _$element;
    that.willLoad();
    if(that.options.template) {
        that.element.load(that.options.template, function() {
            $("*[id]", that.element).each(function() {
               that.uiElements[$(this).attr("id")] = $(this);
            });
            done && done();
            that.didLoad();
        });
    } else {
        that.didLoad();
    }
}

WebApp.ViewController.prototype.unloadView = function(done) {
	var that = this;
	that.willUnload();
	that.element.remove();
	done && done();
	that.didUnload();
}

