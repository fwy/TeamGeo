app.angular
	.run(['dataSources', function(dataSources) {
		dataSources.init();
	}])
	.service('dataSources', function() {
		this.init = function() {
			var shipFromTestData = [{
				location: [40.82450388, -74.36265143],
				addressCode: "10-100",
				addressName: "QMI -USA Division",
//				orderNbr: "0000000",
//				orderLine: 1,
//				orderLineDueDate: "2015-08-05",
//				orderLineExtPrice: 100,
			}];

			var shipToTestData = [{
				location: [42.39951463, -113.0124867],
				addressCode: "10c1005",
				addressName: "Rockland Industrial Company",
				orderNbr: "0000000",
				orderLine: 1,
				orderLineDueDate: "2015-08-05",
				orderLineExtPrice: 100,
			},{
				location: [42.39951463, -113.0124867],
				addressCode: "10c1005",
				addressName: "Rockland Industrial Company",
				orderNbr: "0000000",
				orderLine: 2,
				orderLineDueDate: "2015-08-05",
				orderLineExtPrice: 0,
			},{
				location: [42.39951463, -113.0124867],
				addressCode: "10c1005",
				addressName: "Rockland Industrial Company",
				orderNbr: "0000000",
				orderLine: 3,
				orderLineDueDate: "2015-08-05",
				orderLineExtPrice: 0,
			}];

			var shipFromTestSites = [{
				siteCode: "10-100",
			},{
				siteCode: "10-200",
			},{
				siteCode: "10-202",
			},{
				siteCode: "10-300",
			},{
				siteCode: "10-301",
			},{
				siteCode: "10-302",
			},{
				siteCode: "10-400",
			},{
				siteCode: "10-500",
			}];

			this.shipFromDataSource = new kendo.data.DataSource({
				data: shipFromTestData,
			});

			this.shipToDataSource = new kendo.data.DataSource({
				data: shipToTestData,
			});

			this.shipFromSites = new kendo.data.DataSource({
				data: shipFromTestSites
			});
		};
	});
