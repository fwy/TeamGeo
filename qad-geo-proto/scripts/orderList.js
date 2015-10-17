app.angular
	.controller("orderListController", ["$scope", "dataSources", function($scope, dataSources) {
		$scope.dataSources = dataSources;

		$scope.orderLineTemplate = "<p>Order line: <b>#= so_nbr # #= sod_line #</b>    Due date: <b>#= sod_due_date #</b>    Extended price: <b>#= kendo.toString(extendedPrice, 'c') #</b></p>";
//		$scope.orderLineTemplate = "#= so_nbr #  #= sod_line #  #= sod_due_date #  #= kendo.toString(extendedPrice, 'c') #";
	}]);
