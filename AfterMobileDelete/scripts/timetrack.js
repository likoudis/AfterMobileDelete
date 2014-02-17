(function (global) {
    app = global.app = global.app || {};
    var TimetrackModel;
    var starts = new Array();
    var stops = new Array();
    
    TimetrackModel = kendo.data.ObservableObject.extend({
        
        isTimetrackModelInitialized: false,
        timetrackDataSource : null,
        
        init: function() {
            var that = this,
            dataSource;
          
            alert("in model init 1");
            kendo.data.ObservableObject.fn.init.apply(that, []);
            alert("in model init 2");
            
           dataSource = new kendo.data.DataSource({
                data: [ 
                    {start: starts[0], stop: "stop 1"},
                    {start: "start 2", stop: "stop 2"}
                ]
            });
            
            alert(dataSource);
            that.set("timetrackDataSource", dataSource);
            alert("after setting datasource");
        },
        
        onStart: function(e) {
            alert("in onstart");
            starts[starts.length] = Date();
            alert("starts " + starts.length);
            alert(this.timetrackDataSource);
        },
        
        onStop: function(e) {
            alert("in onstop");
            stops[stops.length] = Date();
            alert("stop " + stops.length);
        }
    });
    
    app.timetrackService = {
        initTimeTrack: function () {
            starts = new Array();
            stops = new Array();
            app.timetrackService.viewModel.set("isTimeTrackModelInitialized", true);            
            alert("in initTimeTrack");
        },
        
        click: function(e) {
            if (e.sender.element.text() === "Start") {
                alert("in start before onstart" + " " + e.sender.element.text());
                app.timetrackService.viewModel.onStart(e);
                alert("back from onstart");
                e.sender.element.text("Stop");

            } else {
                alert("in stop before onstop");
                app.timetrackService.viewModel.onStop(e);
                e.sender.element.text("Start");
            }
        },
        
        viewModel: new TimetrackModel()
    };
    
}) (window);