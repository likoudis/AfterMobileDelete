(function (global) {
	var mobileSkin = "",
	app = global.app = global.app || {};

	document.addEventListener('deviceready', function () {
		navigator.splashscreen.hide();
		$(document.body).height(window.innerHeight);
	}, false);

	app.dataHandler.init();
	app.viewHandler.init();

	application = new kendo.mobile.Application(document.body,
		{ transition: "fade", layout: "tabstrip-layout"});
	
	app.changeSkin = function (e) {
        if (e.sender.element.text() === "Flat") {
        	e.sender.element.text("Native");
			mobileSkin = "flat";
		}
		else {
			e.sender.element.text("Flat");
			mobileSkin = "";
		}
		app.application.skin(mobileSkin);
	};
	
})(window);