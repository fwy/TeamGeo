app.angular
	.constant('constants', {
		// My Telerik API key for NoSQL data store
		apiKey: "kWG4XpzZl9dOVNSw",
	})

	.service("context", ["$filter", "constants", function($filter, constants) {
		// Request parameters used to retrieve data
		var shipFromRequested = null, beginDueDateRequested = null, endDueDateRequested = null;

		this.setShipFromToSelectors = function(shipFrom, beginDueDate, endDueDate) {
			// Set request parameters
			shipFromRequested = shipFrom;
			beginDueDateRequested = $filter("date")(beginDueDate, "M/d/yyyy");
			endDueDateRequested = $filter("date")(endDueDate, "M/d/yyyy");
		};

		this.getShipFromRequested = function() {
			return shipFromRequested;
		};

		this.getBeginDueDateRequested = function() {
			return beginDueDateRequested;
		};

		this.getEndDueDateRequested = function() {
			return endDueDateRequested;
		};
	}]);
