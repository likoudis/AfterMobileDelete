(function (global) {
    app = global.app = global.app || {};
    var TimetrackModel;
	
    TimetrackModel = kendo.data.ObservableObject.extend({
        
        isTimetrackModelInitialized: false,
        timeTrackDataSource : null,
        //timeTrackData: [{pairId: 1 , start: 1, stop: 1}],
        currentProject: "notsetyet",

        init: function() {
            var that = this,
            dataSource;
          
            kendo.data.ObservableObject.fn.init.apply(that, []);
			
			if (localStorage["prjTrackData"] === undefined) {
				localStorage["prjTrackData"] = JSON.stringify([]);
			}

            dataSource = new kendo.data.DataSource({
                //data:  this.timeTrackData,
				//autosync: true,
				transport: {
/*
					create: {
						url: "data/prjDataStore.json",
						dataType: "json"
					},
					read: {
						url: "data/prjDataStore.json",
						dataType: "json"
					},
					update: {
						url: "data/prjDataStore.json",
						dataType: "json"
					},
*/
					create: function(options){
						var localData = JSON.parse(localStorage["prjTrackData"]);
						var pairId = localData.length ;
						localData.push({pairId: pairId, start: "", stop: ""});
						localData[pairId].start = options.data.start;
						localData[pairId].stop  = options.data.stop;
					
						localData = localStorage["prjTrackData"] = JSON.stringify(localData);
						options.success([]);
					},
					read: function(options){
						var localData = JSON.parse(localStorage["prjTrackData"]); 
						options.success(localData);
					},
					update: function(options){
						var localData = JSON.parse(localStorage["prjTrackData"]); 
						var pairId = localData.length - 1;
						localData[pairId].stop  = options.data.stop;
						localStorage["prjTrackData"] = JSON.stringify(localData);
						options.success([]);
					},
					destroy: function(options){ 
						var localData = JSON.parse(localStorage["prjTrackData"]); 
						localData.pop();
						localStorage["prjTrackData"] = JSON.stringify(localData); 
						options.success([]);
					},
				},
				schema: {
					model: { 
						id: "pairId",
						fields: {
							"pairId": {type: "number"},
							"start":  {type: "string"},
							"stop":   {type: "string"}
						}
					}
				//},
				//change: function(e) {
				}
            });

            this.set("timeTrackDataSource", dataSource);
        },
        
        onStart: function(e) {
			var today= new Date();
			var h=today.getHours();
			var m=today.getMinutes();
			var s=today.getSeconds();
			m= m<10 ? "0" + m : m;
			s= s<10 ? "0" + s : s;

			this.timeTrackDataSource.add({
				 start: h+" : "+m+" : "+s, stop: "Work in progress"});
			this.timeTrackDataSource.sync();
        },
        
        onStop: function(e) {
			var today= new Date();
			var h=today.getHours();
			var m=today.getMinutes();
			var s=today.getSeconds();
			m= m<10 ? "0" + m : m;
			s= s<10 ? "0" + s : s;

			this.timeTrackDataSource.data()[
				this.timeTrackDataSource.data().length - 1
			].set("stop", h+" : "+m+" : "+s);
			this.timeTrackDataSource.sync();
		},

       onDelete: function(e) {
		   this.timeTrackDataSource.remove(
				this.timeTrackDataSource.data()[
					this.timeTrackDataSource.data().length - 1]);
			this.timeTrackDataSource.sync();
		},
	});
    
    app.timetrackService = {
        initTimeTrack: function () {
            app.timetrackService.viewModel.set("isTimetrackModelInitialized", true); 
        },
        
        click: function(e) {
			if (e.sender.element.text().trim() === "Start") {
                app.timetrackService.viewModel.onStart(e);
                e.sender.element.text("Stop");
				$("#startStopButton").kendoMobileButton({ icon: "stop" });
            } else if (e.sender.element.text().trim() === "Stop") {
                app.timetrackService.viewModel.onStop(e);
                e.sender.element.text("Start");
				$("#startStopButton").kendoMobileButton({ icon: "play" });
            } else {
                app.timetrackService.viewModel.onDelete(e);
			}
			var temp = app.timetrackService.viewModel.timeTrackDataSource.data().length - 23
			if (temp > 0) {
				$("#tmeTrkScroller").data("kendoMobileScroller").scrollTo(
					0, -40 * temp);
			}
		},
    
        changeProject: function(v) {
            this.viewModel.set("currentProject",v);
        },
        
        viewModel: new TimetrackModel()
    };
    
}) (window);