(function (global) {
	var app = global.app = global.app || {};
	
	app.viewHandler = {

		init: function () {
//alert("viewHandler init");

 		},

		setCurrentPrj: function (newProjectName) {
			var currentPrjName = app.dataHandler.setCurrentPrj(newProjectName);

			app.timetrackService.viewModel.set("currentPrjName", currentPrjName); 
			
			return currentPrjName;
        }
		
	};
}) (window);