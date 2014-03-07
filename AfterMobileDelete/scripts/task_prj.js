(function (global) {
    var taskPrjViewModel,
        app = global.app = global.app || {};
    
    taskPrjViewModel = kendo.data.ObservableObject.extend({
        taskPrjDataSource: null,
        currentPrj: app.currentPrj,

        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "data/tasks.json",
                        dataType: "json"
                    }
                },
                sort: { field: "Id", dir: "asc" }
            });

            that.set("taskPrjDataSource", dataSource);
        },
        
        projectSelect: function (e) {
            this.set("currentPrj", e.item.text().trim());
            app.timetrackService.changeProject(e.item.text().trim());
            
            app.currentPrj = this.currentPrj;
        }
    });

    app.taskPrjService = {
        viewModel: new taskPrjViewModel(),
		
		initTaskPrj: function () {
			var that = app.taskPrjService.viewModel;
			
			that.taskPrjDataSource.fetch(function(){

				var dataItem = that.taskPrjDataSource.at(0).Id;
            	app.taskPrjService.viewModel.set("currentPrj", dataItem);
				app.timetrackService.changeProject(dataItem);
			})
        },
 
    };
})(window);