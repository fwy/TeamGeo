// Simple utility to delete an unwanted/duplicate sales order line
// from the geocoded collection in the cloud-based NoSQL data store.
// Modify to cover any specific case.
//
// Run using node executable on Windows command line:
//
// node <this script name>

// Core nodejs modules
var fs = require('fs');
var http = require('http');

// Locally installed modules
var prompt = require('prompt');
var async = require('async');
var Everlive = require('everlive-sdk');

// Initialize NoSQL cloud service and sales order line collection
var everlive = new Everlive({
    apiKey: "kWG4XpzZl9dOVNSw",
    schema: "https"
});
var salesOrderLinesCollection = everlive.data('SalesOrderLines');

// TODO Test connection
// salesOrderLinesCollection.get(null, function(data) {
//     console.log("salesOrderLines:\n" + JSON.stringify(data));
// }, function(err) {
//     console.log("Error: " + err);
// });

// Delete sales order line document
var soLineId = "fcba4dc0-71dc-11e5-9be3-5143aa8a0996";
salesOrderLinesCollection.destroySingle({ Id: soLineId },
    function() { console.log("Line deleted"); },
    function(err) { console.log("Error deleting line: " + err); }
);

