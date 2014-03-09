(function (global) {
    var taskPrjViewModel,
        app = global.app = global.app || {};

    taskPrjViewModel = kendo.data.ObservableObject.extend({
        taskPrjDataSource: null,
		currentPrjName : null,

        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            dataSource = new kendo.data.DataSource({
                //data: app.tasksPrjs,
				data: [
					{"id": "0", "name": "Project1"}, 
					{"id": "1", "name": "Task21"},
					{"id": "2", "name": "Task22"},
					{"id": "3", "name": "Task23"},
					{"id": "4", "name": "Task24"},
					{"id": "5", "name": "Task25"}
			],
                sort: { field: "name", dir: "asc" }
            });

			that.set("taskPrjDataSource", dataSource);
        },

        projectSelect: function (e) {
            app.viewHandler.changePrj(e.item.text().trim())
			this.set("currentPrjName", app.currentPrj.name);
        }
    });

    app.taskPrjService = {
        viewModel: new taskPrjViewModel(),

		initTaskPrj: function () {

			var that = app.taskPrjService.viewModel;
			that.taskPrjDataSource.fetch(function(){
			});
			that.set("currentPrjName", app.dataHandler.getDefaultPrj().name);
        },
 
		pprint: function() {
alert("pprint")
			
        }
    };
})(window);