app.angular
	.controller("mapController", ["$scope", "dataSources", function($scope, dataSources) {
		// Set map extent to cover all desired locations
		var centerMapOnLocations = function(locations) {
            var extent = null;
			// Include each location in extent
			for (var i = 0; i < locations.length; i++) {
	            if (!extent) {
	                extent = new kendo.dataviz.map.Extent(locations[i], locations[i]);
	            } else {
	                extent.include(locations[i]);
	            }
	        }

			$scope.testMap.extent(extent);
		};

		var tileLayer = {
				type: "tile",
		};

		var shipFromMarkerLayer = {
				type: "marker",
				shape: "pinTarget",
				dataSource: dataSources.shipFromDataSource,
				tooltip: {
					template: "<span>Ship-from: #=marker.dataItem.addressCode#<br/>" +
						"#=marker.dataItem.addressName#</span>",
				}
		};

		var shipToMarkerLayer = {
				type: "marker",
				shape: "pin",
				dataSource: dataSources.shipToDataSource,
				tooltip: {
					template: "<span>Ship-to: #=marker.dataItem.so_ship#<br/>" +
						"#=marker.dataItem.ad_name_dest#</span>",
//					template: "<span>Ship-to: #=marker.dataItem.so_ship#<br/>" +
//						"#=marker.dataItem.ad_name_dest#<br/>" +
//						"Order line: #=marker.dataItem.so_nbr# #=marker.dataItem.sod_line#<br/>" +
//						"Due date: #=marker.dataItem.sod_due_date#<br/>" +
//						"Total amount: #=kendo.toString(marker.dataItem.extendedPrice, 'c')#</span>",
				}
		};

		var shapeLayer = {
				type: "shape",
		};

		var bubbleLayer = {
				type: "bubble",
				// TODO
		};

		$scope.title = "Map Test";

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
			tileLayer,
			shipFromMarkerLayer,
			shipToMarkerLayer,
			shapeLayer,
			bubbleLayer,
		];

		// Connect ship-from and ship-to locations
		$scope.linkShipFromToPoints = function(e) {
			var map = e.sender;
			var shipFromMarkerLayer = map.layers[1];
			var shipToMarkerLayer = map.layers[2];
			var shapeLayer = map.layers[3];

			if (shipFromMarkerLayer.items.length > 0 && shipToMarkerLayer.items.length > 0) {
				var shipFromLocation = shipFromMarkerLayer.items[0].location();
				// Convert ship-from location to screen coordinates
				var from = map.locationToView(shipFromLocation);
				var shipTos = shipToMarkerLayer.items;
				for (var i = 0; i < shipTos.length; i++) {
					// Convert ship-to latitude-longitude to screen coordinates
					var shipTo = shipTos[i].dataItem;
					var shipToLocation = new kendo.dataviz.map.Location(shipTo.destLatitude, shipTo.destLongitude);
					var to = map.locationToView(shipToLocation);

					// Draw path from shipFrom to shipTo
					var line = new kendo.dataviz.drawing.Path({
						stroke: {
							color: "#e15613", // Same color as marker
							width: 2,
							lineCap: "round",
						}
					});
					line.moveTo(from).lineTo(to);
					shapeLayer.surface.draw(line);
				}
			}
		};

		// Set position and scale of map on initialization
		$scope.init = function(e){
			var view = e.sender;

			// Set map extent to cover ship-from and ship-to locations
			var locations = [];
			var shipFromData = $scope.testMap.layers[1].items;
			for (var i = 0; i < shipFromData.length; i++)  locations.push(shipFromData[i].location());
			var shipToData = $scope.testMap.layers[2].items;
			for (var i = 0; i < shipToData.length; i++)  locations.push(shipToData[i].location());
			centerMapOnLocations(locations);
		};
	}]);
