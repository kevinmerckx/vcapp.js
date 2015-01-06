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
	}
}

HTMLElement.prototype.forEach = function(selector, f) {
	var els = this.querySelectorAll(selector);
	Array.prototype.slice.call(els).forEach(f);
}