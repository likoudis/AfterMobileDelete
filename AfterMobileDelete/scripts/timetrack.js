(function (global) {
	app = global.app = global.app || {};
	var TimetrackModel;

    TimetrackModel = kendo.data.ObservableObject.extend({
		timeTrackDataSource : null,
		currentPrjName : null,
		stopRefreshIntervalId : null,
		
		init: function() {
			var that = this,
			dataSource;

			kendo.data.ObservableObject.fn.init.apply(that, []);

			dataSource = new kendo.data.DataSource({
				data: app.prjSSPairs,
				sort: { field: "start", dir: "desc" }
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

			app.dataHandler.addItem(app.prjSSPairs, {listName: "prjSSPairs" + app.currentPrj.id, start: today, stop: "Started..."});
			app.currentSSPair = app.prjSSPairs[app.prjSSPairs.length-1];
			this.timeTrackDataSource.data(app.prjSSPairs);
			this.stopRefreshIntervalId = setInterval(this.refreshStop, 1000);
		},
		
		refreshStop: function () {
			clearInterval(this.stopRefreshIntervalId);
			var today= new Date();
			
			var duration = today.getTime() - app.currentSSPair.start.getTime();
			duration = new Date(duration);
			duration = app.timetrackService.viewModel.toHHHmmss(duration);
			
			app.timetrackService.viewModel.timeTrackDataSource.at(
			  app.timetrackService.viewModel.timeTrackDataSource.data().length -1 ).stop = duration;
			$("#listview-prjSSPairs").data("kendoMobileListView").refresh()
			this.stopRefreshIntervalId = setInterval(this.refreshStop, 1000);
		},

		onStop: function(e) {
			clearInterval(this.stopRefreshIntervalId);
			var today= new Date();
			
			var duration = today.getTime() - app.currentSSPair.start.getTime();
			duration = new Date(duration);
			duration = app.timetrackService.viewModel.toHHHmmss(duration);

			app.currentSSPair.stop = duration;
			app.dataHandler.changeItem(app.prjSSPairs, app.currentSSPair);
			this.timeTrackDataSource.data(app.prjSSPairs);
		},

		onDelete: function(e) {
			if (this.stopRefreshIntervalId !== null)
				clearInterval(this.stopRefreshIntervalId);
			if (app.currentSSPair !== undefined)
    			app.dataHandler.deleteItem(app.prjSSPairs, app.currentSSPair);
			this.timeTrackDataSource.data(app.prjSSPairs);
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
	    test: function (e) {
//alert("data-before-show");
            app.timetrackService.viewModel.timeTrackDataSource.data(app.prjSSPairs);
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