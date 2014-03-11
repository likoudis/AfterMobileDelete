(function (global) {
    app = global.app = global.app || {};
    var TimetrackModel;

    TimetrackModel = kendo.data.ObservableObject.extend({
        timeTrackDataSource : null,
		currentPrjName : null,

        init: function() {
            var that = this,
            dataSource,
			stopRefreshIntervalId;

            kendo.data.ObservableObject.fn.init.apply(that, []);

			dataSource = new kendo.data.DataSource({
				data: app.prjSSPairs,
                sort: { field: "start", dir: "desc" }
				//autoSync: true,
/*				transport: {
					create: function(options){
						var localData = JSON.parse(localStorage["prjTrackData"]);
						var pairId = localData.length ;
						localData.splice(0,0,{pairId: pairId, start: "", stop: ""});
						localData[0].start = options.data.start;
						localData[0].stop  = options.data.stop;
						localStorage["prjTrackData"] = JSON.stringify(localData);
						options.success([]);
					},
					read: function(options){
						//var localData = JSON.parse(localStorage["prjTrackData"]); 
						options.success(localData);
					},
					update: function(options){
						var localData = JSON.parse(localStorage["prjTrackData"]); 
						localData[0].stop  = options.data.stop;
						localStorage["prjTrackData"] = JSON.stringify(localData);
						options.success([]);
					},
					destroy: function(options){ 
						var localData = JSON.parse(localStorage["prjTrackData"]); 
						localData.splice(0,1);
						localStorage["prjTrackData"] = JSON.stringify(localData); 
						options.success([]);
					},
				},
				schema: {
					model: { 
						id: "id",
						fields: {
							"id":       {type: "number"},
							"listName": {type: "string"},
							"start":    {type: "string"},
							"stop":     {type: "string"}
						}
					}
				//},
				//change: function(e) {
				}
*/
			});

            this.set("timeTrackDataSource", dataSource);
        },
        
		toHHHmmss: function (t) {
			// This is correct only for less than 24h...
			var h=t.getUTCHours();
			var m=t.getUTCMinutes();
			var s=t.getUTCSeconds();

			h= h>10 ? h : "0" + h;
			m= m<10 ? "0" + m : m;
			s= s<10 ? "0" + s : s;
			return (h+" : "+m+" : "+s);
		},
	
		onStart: function(e) {
			var today= new Date();

			app.dataHandler.addItem(app.prjSSPairs, {listName: "prjSSPairs", start: today, stop: "nice"});
			app.currentSSPair = app.prjSSPairs[app.prjSSPairs.length-1];
			this.timeTrackDataSource.read();
			this.stopRefreshIntervalId = setInterval(this.refreshStop, 1000);
        },
		
		refreshStop: function () {
			var today= new Date();
			
			var duration = today.getTime() - app.currentSSPair.start.getTime();
			duration = new Date(duration);
			duration = app.timetrackService.viewModel.toHHHmmss(duration);
			
			app.timetrackService.viewModel.timeTrackDataSource.at(
			  app.timetrackService.viewModel.timeTrackDataSource.data().length -1 ).stop = duration;
			$("#listview-prjSSPairs").data("kendoMobileListView").refresh()
        },

		onStop: function(e) {
			clearInterval(this.stopRefreshIntervalId);
			var today= new Date();
			
			var duration = today.getTime() - app.currentSSPair.start.getTime();
			duration = new Date(duration);
			duration = app.timetrackService.viewModel.toHHHmmss(duration);

			app.currentSSPair.stop = duration;
			app.dataHandler.changeItem(app.prjSSPairs, app.currentSSPair);
			this.timeTrackDataSource.read();
		},

       onDelete: function(e) {
		   app.dataHandler.deleteItem(app.prjSSPairs, app.prjSSPairs.length - 1);
		   this.timeTrackDataSource.read();
		},
	});

	app.timetrackService = {
        initTimeTrack: function () {
			var that = app.timetrackService.viewModel;
			that.set("currentPrjName", app.currentPrj.name);
			//that.timeTrackDataSource.fetch();

			$("#startButton").show();
			$("#stopButton").hide();
		},
        startClick: function(e) {
			app.timetrackService.viewModel.onStart(e);
			$("#startButton").hide();
			$("#stopButton").show();
		},
        stopClick: function(e) {
			app.timetrackService.viewModel.onStop(e);
			$("#startButton").show();
			$("#stopButton").hide();
		},
        delClick: function(e) {
			app.timetrackService.viewModel.onDelete(e);
			$("#startButton").show();
			$("#stopButton").hide();
		},
        
        viewModel: new TimetrackModel()
    };
    
}) (window);