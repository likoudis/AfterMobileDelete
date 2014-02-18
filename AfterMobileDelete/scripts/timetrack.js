(function (global) {
    app = global.app = global.app || {};
    var TimetrackModel;
    
    TimetrackModel = kendo.data.ObservableObject.extend({
        
        isTimetrackModelInitialized: false,
        timeTrackDataSource : null,
        timeTrackData: [],

        init: function() {
            var that = this,
            dataSource;
          
            kendo.data.ObservableObject.fn.init.apply(that, []);
            
            dataSource = new kendo.data.DataSource({
                data:  this.timeTrackData
            });

            that.set("timeTrackDataSource", dataSource);
            //that.set("timeTrackData", []);
        },
        
        onStart: function(e) {
             this.timeTrackDataSource.add({start: Date(), stop: "NothingYet"});
        },
        
        onStop: function(e) {
            var temp;
            
            temp = this.timeTrackDataSource.data().length -1 ;
            this.timeTrackDataSource.data()[temp].set("stop", Date());
        }
    });
    
    app.timetrackService = {
        initTimeTrack: function () {
            starts = new Array();
            stops = new Array();
            app.timetrackService.viewModel.set("isTimetrackModelInitialized", true);            
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