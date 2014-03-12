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
                data: app.projects,
                sort: { field: "name", dir: "asc" }
            });

			that.set("taskPrjDataSource", dataSource);
        },
// Invoked by tapping an item of the project listview
        projectSelect: function (e) {
            app.viewHandler.setCurrentPrj(e.item.text().trim());
			this.set("currentPrjName", app.currentPrj.name);
        },
// Invoked by hitting enter when typing in the input box
        checkEnter: function (e) {
// Enter acts as Insert
			if (e.keyCode === 13) {
				$(e.target).blur();
				currentPrjName = this.get("currentPrjName").trim(); // get the text from the input box
				app.viewHandler.setCurrentPrj(currentPrjName);      // tell the other view(s)
	            this.set("currentPrjName", app.currentPrj.name);    // get the app variable, may be the old one...
				//this.taskPrjDataSource.add(app.currentPrj);         // 
			}
		}
    });

    app.taskPrjService = {
        viewModel: new taskPrjViewModel(),

		initTaskPrj: function () {

			var that = app.taskPrjService.viewModel;
			that.set("currentPrjName", app.currentPrj.name);
			//$("#listview-taskPrj").data("kendoMobileListView").setDataSource()
        },

		editPrjList: function () {
			
        },

		onPrjRename: function() {
			editPrjList("rename");
        },
		onPrjInsert: function() {
			editPrjList("insert");
        },
		onPrjDelete: function() {
			editPrjList("delete");
        }

    };
})(window);