app.angular
	.run(['dataSources', function(dataSources) {
		dataSources.init();
	}])
	.service('dataSources', function() {
		// My Telerik API key for NoSQL data store
		this.apiKey = "kWG4XpzZl9dOVNSw";

		// Initialize data sources
		this.init = function() {
//			var shipFromTestSites = [{
//				addressCode: "10-100",
//			},{
//				addressCode: "10-200",
//			},{
//				addressCode: "10-202",
//			},{
//				addressCode: "10-300",
//			},{
//				addressCode: "10-301",
//			},{
//				addressCode: "10-302",
//			},{
//				addressCode: "10-400",
//			},{
//				addressCode: "10-500",
//			}];

//			var shipFromTestData = [{
//				location: [40.82450388, -74.36265143],
//				addressCode: "10-100",
//				addressName: "QMI -USA Division",
//			}];

//			var shipToTestData = [{
//				destLatitude: 42.39951463,
//				destLongitude: -113.0124867,
//				so_ship: "10c1005",
//				ad_name_dest: "Rockland Industrial Company",
//				so_nbr: "0000000",
//				sod_line: 1,
//				sod_due_date: "2015-08-05",
//				extendedPrice: 100,
//			},{
//				destLatitude: 42.39951463,
//				destLongitude: -113.0124867,
//				so_ship: "10c1005",
//				ad_name_dest: "Rockland Industrial Company",
//				so_nbr: "0000000",
//				sod_line: 2,
//				sod_due_date: "2015-08-05",
//				extendedPrice: 0,
//			},{
//				destLatitude: 42.39951463,
//				destLongitude: -113.0124867,
//				so_ship: "10c1005",
//				ad_name_dest: "Rockland Industrial Company",
//				so_nbr: "0000000",
//				sod_line: 3,
//				sod_due_date: "2015-08-05",
//				extendedPrice: 0,
//			}];

			this.shipFromSites = new kendo.data.DataSource({
//				data: shipFromTestSites,
				transport: {
					read: {
						url: "data/shipFromLocations.json",
						dataType: "json",
					},
				},
				schema: {
					data: "data",
				},
			});
		};

			this.shipFromDataSource = new kendo.data.DataSource({
//				data: shipFromTestData,
				transport: {
					read: {
						url: "data/shipFromLocations.json",
						dataType: "json",
					},
				},
				schema: {
					data: "data",
					model: {
						id: "addressCode",
					},
				},
			});

			this.shipToDataSource = new kendo.data.DataSource({
//				data: shipToTestData,
				transport: {
					read: {
						url: "http://api.everlive.com/v1/" + this.apiKey + "/SalesOrderLines",
						dataType: "json",
						data: function() {
							// Build the filter to query the data source
							if (shipFromRequested)
								return {
									filter: {
										$and: [{
											sod_site: shipFromRequested,
										},{
											sod_due_date: {
												$gte: beginDueDateRequested,
											}
										},{
											sod_due_date: {
												$lte: endDueDateRequested,
											}
										}],
									},
							};
							// Ensure an empty result is returned if ship-from not specified
							else return {
									filter: {
										sod_site: "xxxxx",
									},
							};
						},
					},
				},
				schema: {
					total: "Count",
					data: "Result",
					model: {
						id: "Id",
					},
				},
				error: function(e) {
					console.log("Ship-to access error: " + e.status);
				},
			});

		var shipFromRequested, beginDueDateRequested, endDueDateRequested;

		// Fetch requested order data
		this.fetchOrderLines = function(shipFrom, beginDueDate, endDueDate) {
			// Set request parameters
			shipFromRequested = shipFrom;
			beginDueDateRequested = beginDueDate;
			endDueDateRequested = endDueDate;

			
		};
	});
