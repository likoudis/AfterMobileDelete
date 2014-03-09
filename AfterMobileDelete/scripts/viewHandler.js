(function (global) {
	var app = global.app = global.app || {};
	
	app.viewHandler = {

		init: function () {
 		},

		changePrj: function (newProjectName) {
// logic to change current project
			var currentPrjName = app.dataHandler.changePrj(newProjectName);

			app.timetrackService.viewModel.set("currentPrjName", currentPrjName); 
			
			return currentPrjName;
		}
		
	};
}) (window);