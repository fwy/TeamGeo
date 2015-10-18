app.angular
	.controller("homeController", ["$scope", "constants", "context", function($scope, constants, context) {
		$scope.shipFromLocations = new kendo.data.DataSource({
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

		// Set default low and high dates where there is order activity
		$scope.lowDueDate = new Date(2015, 0, 1);
		$scope.highDueDate = new Date(2015, 11, 31);

		// Adjust begin due date range to ensure that no date after the end due date may be selected
		$scope.resetBeginDateRange = function(e) {
			var endDueDatePicker = e.sender;
			var endDueDateSelected = endDueDatePicker.value();
			if (endDueDateSelected) {
				$scope.beginDueDatePicker.max(endDueDateSelected);
			}
		};

		// Adjust end due date range to ensure that no date before the begin due date may be selected
		$scope.resetEndDateRange = function(e) {
			var beginDueDatePicker = e.sender;
			var beginDueDateSelected = beginDueDatePicker.value();
			if (beginDueDateSelected) {
				$scope.endDueDatePicker.min(beginDueDateSelected);
			}
		};

		// Accept and process search input
		$scope.processSearchRequest = function(e) {
			console.log("home: Selected ship-from: " + $scope.shipFromDropDown.value());
			console.log("home: Selected due date from: " + $scope.beginDueDatePicker.value());
			console.log("home: Selected due date to: " + $scope.endDueDatePicker.value());

			// Set parameters for data retrieval
			context.setShipFromToSelectors($scope.shipFromDropDown.value(),
					$scope.beginDueDatePicker.value(), $scope.endDueDatePicker.value());
		};
 	}]);
