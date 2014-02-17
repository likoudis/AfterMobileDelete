(function (global) {
    app = global.app = global.app || {};
    var TimetrackModel;
    var starts = new Array();
    var stops  = new Array();
    
    TimetrackModel = kendo.data.ObservableObject.extend({
        
        isTimetrackModelInitialized: false,
        timetrackDataSource : null,
        timetrackData: [],

        init: function() {
            var that = this,
            dataSource;
          
            kendo.data.ObservableObject.fn.init.apply(that, []);
            
            dataSource = new kendo.data.DataSource({
                data: [ 
                    {start: starts[0], stop: "stop 1"},
                    {start: "start 2", stop: "stop 2"}
                ]
            });
            
            that.set("timetrackDataSource", dataSource);
            that.set("timeTrackData", []);
        },
        
        onStart: function(e) {
            var temp = [];
            var that = this;
            
            temp = that.get("timeTrackData");
            temp.push({start: Date(), stop: ""});
            that.set("timeTrackData", temp);
        },
        
        onStop: function(e) {
            var temp = [];
            var that = this;
            
            temp = that.get("timeTrackData");
            //temp[temp.length - 1].start = "shit";
            temp.push({start: "", stop: Date()});
            that.set("timeTrackData", temp);
        }
    });
    
    app.timetrackService = {
        initTimeTrack: function () {
            starts = new Array();
            stops = new Array();
            app.timetrackService.viewModel.set("isTimeTrackModelInitialized", true);            
        },
        
        click: function(e) {
            if (e.sender.element.text() === "Start") {
                app.timetrackService.viewModel.onStart(e);
                e.sender.element.text("Stop");
            } else {
                app.timetrackService.viewModel.onStop(e);
                e.sender.element.text("Start");
            }
        },
        
        viewModel: new TimetrackModel()
    };
    
}) (window);