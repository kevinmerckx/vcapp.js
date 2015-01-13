'use strict';

document.addEventListener(
	"DOMContentLoaded",
	function() {
		var idApp = document.querySelector("body").getAttribute("app");
		document.querySelector("body").removeAttribute("app");
		var maker = WebApp.apps[idApp].maker;
		var wa = maker(WebApp.apps[idApp].options);
		WebApp.app = wa;
		wa.launch();
	}
);
