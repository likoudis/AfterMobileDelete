(function (global) {
    var taskPrjViewModel,
        app = global.app = global.app || {};

    
    taskPrjViewModel = kendo.data.ObservableObject.extend({
        taskPrjDataSource: null,
        currentPrj: "nothingSet",

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
        }
    });

    app.taskPrjService = {
        viewModel: new taskPrjViewModel()
    };
})(window);