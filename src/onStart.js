'use strict';

document.addEventListener(
	"DOMContentLoaded",
	function() {
		var idApp = document.querySelector("body").getAttribute("app");
		document.querySelector("body").removeAttribute("app");
		var constructor = WebApp.apps[idApp].constructor;
		var wa = new constructor(WebApp.apps[idApp].options);
		WebApp.app = wa;
		wa.launch();
	}
);
