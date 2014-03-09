(function (global) {
    app = global.app = global.app || {};
    var TimetrackModel;

    TimetrackModel = kendo.data.ObservableObject.extend({
        timeTrackDataSource : null,
		currentPrjName : null,

        init: function() {
            var that = this,
            dataSource;
          
            kendo.data.ObservableObject.fn.init.apply(that, []);

			dataSource = new kendo.data.DataSource({
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
*/
			});

            this.set("timeTrackDataSource", dataSource);
        },
        
		toHHHmmss: function (t, p) {
			var h=t.getHours();
			var m=t.getMinutes();
			var s=t.getSeconds();
		
			if (p) {
				h= h>10 ? h>100 ? h : "0" + h : "00"+ h;
        	} else {
				h= h>10 ? h : "0" + h;
        	}
			m= m<10 ? "0" + m : m;
			s= s<10 ? "0" + s : s;
			return (h+" : "+m+" : "+s);
		},
	
       onStart: function(e) {
			var today= new Date();
			var now = this.toHHHmmss(today, false);

			this.timeTrackDataSource.insert(0,{
				 start: now, stop: "Work in progress"});
			this.timeTrackDataSource.sync();
        },
        
        onStop: function(e) {
			var today= new Date();
			
			var duration = this.timeTrackDataSource.data()[0].get("start") - today;

			this.timeTrackDataSource.data()[0].set(
				"stop",duration);
			this.timeTrackDataSource.sync();
		},

       onDelete: function(e) {
		   this.timeTrackDataSource.remove(
				this.timeTrackDataSource.data()[0]
		   );
			this.timeTrackDataSource.sync();
		},
	});

	app.timetrackService = {
        initTimeTrack: function () {
			var that = app.timetrackService.viewModel;

			that.set("currentPrjName", app.dataHandler.getDefaultPrj().name);
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