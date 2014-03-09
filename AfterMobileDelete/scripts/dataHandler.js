(function (global) {
	var app = global.app = global.app || {};
	
	var taskPrj =  {
		id: "",
		name: ""
	};
	var startStopPair = {
		id: "",
		start: "",
		stop: "",
	};

// app-wide available variables
	app.tasksPrjs = [];
	app.prjSSPairs = [];
	app.currentPrj = "app";
	
	app.dataHandler = {

		init: function() {
			//if (localStorage["tasksPrjs"] === undefined) {
				localStorage["tasksPrjs"] = JSON.stringify([
					{"id": "0", "name": "Project1"}, 
					{"id": "1", "name": "Task21"},
					{"id": "2", "name": "Task22"},
					{"id": "3", "name": "Task23"},
					{"id": "4", "name": "Task24"},
					{"id": "5", "name": "Task25"}
			]);
			//}
			app.tasksPrjs = JSON.parse(localStorage["tasksPrjs"]);
			app.currentPrj = this.getDefaultPrj();
		},
		getDefaultPrj: function() {
			return app.tasksPrjs[app.tasksPrjs.length - 1];
        },
        changePrj: function (newProjectName) {
// logic to change current project
            for(var i=0, l=app.tasksPrjs.length; i<l; i++)
                if (app.tasksPrjs[i].name === newProjectName)
                    app.currentPrj = app.tasksPrjs[i];
			return (app.currentPrj.name);
        },

		addTask: function(taskPrj) {
			//logic to add new item to the list of startstops
			taskPrjs.push(taskPrj);
		},
		changeTask: function(taskPrj) {
			//logic to add new item to the list of startstops
			taskPrjs.splice(taskPrj.id, 1, taskPrj);
		},
		deleteTask: function(taskPrjId) {
			
			tasksPrjs.splice(taskPrjId, 1)
		}
	}
}) (window);