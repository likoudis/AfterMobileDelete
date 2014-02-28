(function (global) {
    app = global.app = global.app || {};
    var TimetrackModel;
	
    TimetrackModel = kendo.data.ObservableObject.extend({
        
        isTimetrackModelInitialized: false,
        timeTrackDataSource : null,
        timeTrackData: [{pairId: 1 , start: 1, stop: 1}],
        currentProject: "notsetyet",

        init: function() {
            var that = this,
            dataSource;
          
            kendo.data.ObservableObject.fn.init.apply(that, []);
			
			var temp = [
				//{pairId: 0, start: 4, stop: 4}
			];
			
			localStorage["prjTrackData"] = JSON.stringify(temp);
           
            dataSource = new kendo.data.DataSource({
                //data:  this.timeTrackData,
				autosync: true,
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
//					parameterMap: function(options, operation) {
//console.log("Fired parameterMap");
//						if (operation !== "read" && options.models) {
//							return {models: kendo.stringify(options.models)};
//						}
//					}
*/
					create: function(options){
						var localData = JSON.parse(localStorage["prjTrackData"]);
alert("Creating..." + localData.length);
						var pairId = localData.length;
						localData.push({pairId: 5, start: 5, stop: 5});
						localData[pairId].pairId = pairId;
						localData[pairId].start = options.data.start;
						localData[pairId].stop  = options.data.stop;
console.log(options);
console.log(localData[pairId]);
					
						localStorage["prjTrackData"] = JSON.stringify(localData);
//console.log(localStorage["prjTrackData"]);
						options.success({});
					},
					read: function(options){
						var localData = JSON.parse(localStorage["prjTrackData"]); 
						options.success(localData);
					},
					update: function(options){
						var updatedIdx = -1;
						var localData = JSON.parse(localStorage["prjTrackData"]); 
alert("Updating..." + localData.length);
						for(var i=0; i<localData.length; i++){
							if(localData[i].pairId === options.data.pairId){
								localData[i].start = options.data.start;
								localData[i].stop  = options.data.stop;
								updatedIdx = i;
							} 
						}
						if (updatedIdx >= 0) {
							localStorage["prjTrackData"] = JSON.stringify(localData);
							options.success({});
                        } else {
							options.error();
                        }
					},
					destroy: function(options){ 
						var localData = JSON.parse(localStorage["prjTrackData"]); 
						localData.remove(options.data.pairId);
						localStorage["prjTrackData"] = JSON.stringify(localData); 
						options.success(localData[pairId]);
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
			this.timeTrackDataSource.add({
				 start: Date(), stop: "Work in progress"});
			this.timeTrackDataSource.sync();
        },
        
        onStop: function(e) {
console.log(this.timeTrackDataSource.data().length);
			console.log(this.timeTrackDataSource.data()[this.timeTrackDataSource.data().length-1]);
			this.timeTrackDataSource.data()[this.timeTrackDataSource.data().length - 1].set("stop", Date());
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
            } else {
                app.timetrackService.viewModel.onStop(e);
                e.sender.element.text("Start");
				$("#startStopButton").kendoMobileButton({ icon: "play" });
            }
		},
    
        changeProject: function(v) {
            this.viewModel.set("currentProject",v);
        },
        
        viewModel: new TimetrackModel()
    };
    
}) (window);