app.angular
	.controller("mapController", ["$scope", "constants", "context", function($scope, constants, context) {

		var shipFromDataSource = new kendo.data.DataSource({
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
			error: function(e) {
				console.log("map: Ship-from access error: " + e.status);
			},
//			change: function(e) {
//				scaleAndPositionMap();
//		},
//			requestStart: function(e) {
//				console.log("map: Ship-from data source request started for ship-from " + context.getShipFromRequested());
//			},
//			requestEnd: function(e) {
//				console.log("map: Ship-from data source request ended for ship-from " + context.getShipFromRequested());
//			},
		});

		var shipToDataSource = new kendo.data.DataSource({
			transport: {
				read: {
					url: "http://api.everlive.com/v1/" + constants.apiKey + "/SalesOrderLines",
					dataType: "json",
					data: function() {
						// Build the filter to query the data source
						if (context.getShipFromRequested())
							return {
								filter: '{"$and": [{"sod_site": "' + context.getShipFromRequested() + '"}, ' +
									'{"sod_due_date": {"$gte": "' + context.getBeginDueDateRequested() + '"}}, ' +
									'{"sod_due_date": {"$lte": "' + context.getEndDueDateRequested() + '"}}]}',
						};
						// Ensure an empty result is returned if ship-from not specified
						else return {
								filter: '{"sod_site": ""}',
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
			change: function(e) {
				$scope.linkShipFromToPoints();
				scaleAndPositionMap();
			},
			requestStart: function(e) {
				console.log("map: Ship-to data source request started for ship-from " + context.getShipFromRequested() +
						", due date range " + context.getBeginDueDateRequested() +
						" to " + context.getEndDueDateRequested());
			},
			requestEnd: function(e) {
				console.log("map: Ship-to data source request ended for ship-from " + context.getShipFromRequested() +
						", due date range " + context.getBeginDueDateRequested() +
						" to " + context.getEndDueDateRequested());
			},
		});

		var tileLayerOptions = {
				type: "tile",
		};

		var shipFromMarkerLayerOptions = {
				type: "marker",
				shape: "pinTarget",
				dataSource: shipFromDataSource,
				tooltip: {
					template: "<span>Ship-from: #=marker.dataItem.addressCode#<br/>" +
						"#=marker.dataItem.addressName#</span>",
				},
		};

		var shipToMarkerLayerOptions = {
				type: "marker",
				shape: "pin",
				dataSource: shipToDataSource,
				tooltip: {
					template: "<span>Ship-to: #=marker.dataItem.so_ship#<br/>" +
						"#=marker.dataItem.ad_name_dest#</span>",
//					template: "<span>Ship-to: #=marker.dataItem.so_ship#<br/>" +
//						"#=marker.dataItem.ad_name_dest#<br/>" +
//						"Order line: #=marker.dataItem.so_nbr# #=marker.dataItem.sod_line#<br/>" +
//						"Due date: #=marker.dataItem.sod_due_date#<br/>" +
//						"Total amount: #=kendo.toString(marker.dataItem.extendedPrice, 'c')#</span>",
				},
		};

		var shapeLayerOptions = {
				type: "shape",
		};

		var bubbleLayerOptions = {
				type: "bubble",
				// TODO
		};

//		$scope.title = "Map Test";

		$scope.layerDefaults = {
				tile: {
					urlTemplate: "http://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
					subdomains: ["a", "b", "c"],
					attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap contributors</a>.",
				},
				marker: {
				},
				shape: {
				},
				bubble: {
				},
		};

		$scope.layers = [
			tileLayerOptions,
			shipFromMarkerLayerOptions,
			shipToMarkerLayerOptions,
			shapeLayerOptions,
			bubbleLayerOptions,
		];

		// Connect ship-from and ship-to locations
		$scope.linkShipFromToPoints = function(e) {
			if ($scope.map) {
				var shipFroms = $scope.map.layers[1].dataSource.view();
				var shipTos = $scope.map.layers[2].dataSource.view();

				if (shipFroms.length > 0 && shipTos.length > 0) {
					// Convert first ship-from location to screen coordinates
					var shipFrom = shipFroms[0];
					var shipFromLocation = new kendo.dataviz.map.Location(shipFrom.location[0], shipFrom.location[1]);
					var from = $scope.map.locationToView(shipFromLocation);

					// Convert all ship-to locations to screen coordinates
					for (var i = 0; i < shipTos.length; i++) {
						var shipTo = shipTos[i];
						var shipToLocation = new kendo.dataviz.map.Location(shipTo.destLatitude, shipTo.destLongitude);
						var to = $scope.map.locationToView(shipToLocation);

						// Draw path from shipFrom to shipTo
						var line = new kendo.dataviz.drawing.Path({
							stroke: {
								color: "#e15613", // Same color as marker
								width: 2,
								lineCap: "round",
							}
						});
						line.moveTo(from).lineTo(to);
						$scope.map.layers[3].surface.draw(line);
					}
				}
			}
		};

		// Display the map to include all selected locations
		var scaleAndPositionMap = function() {
			// Set map extent to cover ship-from and ship-to locations
			var locations = [];
			var shipFromLocations = $scope.map.layers[1].dataSource.view();
			for (var i = 0; i < shipFromLocations.length; i++) {
				var shipFrom = shipFromLocations[i];
				locations.push(new kendo.dataviz.map.Location(shipFrom.location[0], shipFrom.location[1]));
			};
			var shipToLocations = $scope.map.layers[2].dataSource.view();
			for (var i = 0; i < shipToLocations.length; i++) {
				var shipTo = shipToLocations[i];
				locations.push(new kendo.dataviz.map.Location(shipTo.destLatitude, shipTo.destLongitude));
			}
			if (locations.length > 0) {
	            var extent = null;
				// Include each location in extent
				for (var i = 0; i < locations.length; i++) {
		            if (!extent) {
		                extent = new kendo.dataviz.map.Extent(locations[i], locations[i]);
		            } else {
		                extent.include(locations[i]);
		            }
		        }

				$scope.map.extent(extent);
			}

			// Default zoom level for a single location
			if (locations.length == 1) $scope.map.zoom(5);
		};

		// On each display of the view
		$scope.showView = function(e) {
			// Re-attach data sources
			$scope.map.layers[1].setDataSource(shipFromDataSource);
			$scope.map.layers[2].setDataSource(shipToDataSource);

			// Read ship-from location
			$scope.map.layers[1].dataSource.filter({
				field: "addressCode",
				operator: "eq",
				value: context.getShipFromRequested(),
			});

			// Read ship-to locations and order lines
			$scope.map.layers[2].dataSource.filter({
				// No filter needed
			});
		};

		// On first-time initialization of all widgets in the view
		$scope.initView = function(e){
			var view = e.sender;

			// TODO
		};
	}]);
