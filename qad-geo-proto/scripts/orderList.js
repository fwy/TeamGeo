app.angular
	.controller("orderListController", ["$scope", "constants", "context", function($scope, constants, context) {

		$scope.shipToDataSource = new kendo.data.DataSource({
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
				console.log("orderList: Ship-to access error: " + e.status);
			},
			requestStart: function(e) {
				console.log("orderList: Ship-to data source request started for ship-from " + context.getShipFromRequested() +
						", due date range " + context.getBeginDueDateRequested() +
						" to " + context.getEndDueDateRequested());
			},
			requestEnd: function(e) {
				console.log("orderList: Ship-to data source request ended for ship-from " + context.getShipFromRequested() +
						", due date range " + context.getBeginDueDateRequested() +
						" to " + context.getEndDueDateRequested());
			},
		});

		$scope.orderLineTemplate = "<p><i>Ship-to:</i> <b>#= so_ship #</b>    <i>Order line:</i> <b>#= so_nbr # #= sod_line #</b>    <i>Due date:</i> <b>#= sod_due_date #</b>    <i>Extended price:</i> <b>#= kendo.toString(extendedPrice, 'c') #</b></p>";
//		$scope.orderLineTemplate = "#= so_ship #  #= so_nbr #  #= sod_line #  #= sod_due_date #  #= kendo.toString(extendedPrice, 'c') #";

		// On each display of the view
		$scope.showView = function(e) {
			// Read ship-to locations and order lines
			$scope.shipToDataSource.filter({
				// No filter needed
			});
		};
	}]);
