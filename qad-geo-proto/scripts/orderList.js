app.angular
	.controller("orderListController", ["$scope", "dataSources", function($scope, dataSources) {
		$scope.dataSources = dataSources;

		$scope.orderLineTemplate = "<p>Order line: <b>#= orderNbr # #= orderLine #</b>    Due date: <b>#= orderLineDueDate #</b>    Extended price: <b>#= kendo.toString(orderLineExtPrice, 'c') #</b></p>";
//		$scope.orderLineTemplate = "#= orderNbr #  #= orderLine #  #= orderLineDueDate #  #= kendo.toString(orderLineExtPrice, 'c') #";
	}]);
