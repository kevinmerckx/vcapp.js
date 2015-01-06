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
	}
}

/* This function looks for the elements defined by the selector inside the current DOM element and apply the f function for each of them */
HTMLElement.prototype.forEach = function(selector, f) {
	var els = this.querySelectorAll(selector);
	Array.prototype.slice.call(els).forEach(f);
}