// GeoCodeLoader utility to populate cloud-based NoSQL data store
// with geo-coded sales order line data.
//
// Access to the data store was implemented in two ways:
// 1. Using the Everlive SDK and API
// 2. Using the Everlive REST services
//
// I switched from (1) to (2) in order to avoid the HTTP 503
// errors returned when attempting to bulk-load documents using the SDK.
// The errors resulted from exceeding the allowed # HTTP connections, and
// I could not find a way to configure these using the SDK.  Calling REST
// services allows use of the native nodejs http module, where the pool
// of HTTP agents can be limited and configured.
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
var apiKey = "kWG4XpzZl9dOVNSw";

// Initialize NoSQL cloud service and sales order line collection
// var everlive = new Everlive({
//     apiKey: apiKey,
//     schema: "https"
// });
// var salesOrderLinesCollection = everlive.data('SalesOrderLines');

// Everlive HTTP settings
var everliveAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 10 // TODO Configure as necessary
});
var everlivePathBase = "/v1/" + apiKey + "/SalesOrderLines/";
var everliveOptions = {
    hostname: "api.everlive.com",
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    path: everlivePathBase,
    agent: everliveAgent
};

var salesOrderLines = [];

// TODO Test connection using Everlive API
// salesOrderLinesCollection.get(null, function(data) {
//     console.log("salesOrderLines:\n" + JSON.stringify(data));
// }, function(err) {
//     console.log("Error: " + err);
// });
//
// TODO Test connection using Everlive REST service
// var soLineId = "00352760-7203-11e5-ae70-1fef05bbac00";
// everliveOptions.method = "GET";
// everlineOptions.path: everlivePathBase + soLineId;
// };
// http.get(everliveOptions, function(res) {
//     console.log("Got response: " + res.statusCode);
//     var body = "";
//     res.on('data', function(chunk) {
//         console.log("Got chunk: " + chunk);
//         body += chunk;
//     });
//     res.on('end', function() {
//         console.log("Sales order line data = " + body);
//     });
// }).on('error', function(err) {
//     console.log("Error: " + err.message);
// });

var soLineProcessedCount = 0, soLineErrorCount = 0;

// Create sales order line document in data store
var createSalesOrderLine = function(soLine, callback) {
    // Create document using Everlive API
    // salesOrderLinesCollection.create(soLine, function(res) {
    //     soLineProcessedCount++;
    //     callback(null);
    // }, function(err) {
    //     console.log("Error creating order line");
    //     soLineErrorCount++;
    //     callback(err);
    // });

    // Create document using Everlive REST service
    var req = http.request(everliveOptions, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            // console.log("Got chunk: " + chunk);
            body += chunk;
        });
        res.on('end', function() {
            // console.log("Created sales order line: " + body);
        });
        soLineProcessedCount++;
        callback(null);
    });
    req.on("error", function(err) {
        console.log("Error creating order line");
        soLineErrorCount++;
        callback(err);
    });
    req.write(JSON.stringify(soLine));
    req.end();
};

// Read and process JSON input file
var processInputFile = function(inFile) {
    fs.readFile(inFile, function(err, data) {
        if (err) throw err;
        console.log("Processing input file " + inFile + " ...");
        // NOTE Data loaded in 1000-record batches to avoid HTTP errors
        // salesOrderLines = JSON.parse(data).slice(0, 1000);
        // salesOrderLines = JSON.parse(data).slice(1000, 2000);
        // salesOrderLines = JSON.parse(data).slice(2000, 3000);
        // salesOrderLines = JSON.parse(data).slice(3000, 4000);
        // salesOrderLines = JSON.parse(data).slice(4000, 5000);
        // salesOrderLines = JSON.parse(data).slice(5000, 6000);
        // salesOrderLines = JSON.parse(data).slice(6000, 7000);
        // salesOrderLines = JSON.parse(data).slice(7000, 8000);
        // salesOrderLines = JSON.parse(data).slice(8000, 9000);
        // salesOrderLines = JSON.parse(data).slice(9000, 10000);
        // salesOrderLines = JSON.parse(data).slice(10000, 11000);
        // salesOrderLines = JSON.parse(data).slice(11000, 12000);
        // salesOrderLines = JSON.parse(data).slice(12000, 13000);
        // salesOrderLines = JSON.parse(data).slice(13000, 14000);
        // salesOrderLines = JSON.parse(data).slice(14000);
        // TODO Uncomment the following to load a full JSON file
        // salesOrderLines = JSON.parse(data);
        async.each(salesOrderLines, createSalesOrderLine, function(err) {
            if (err) throw err;
            console.log("Lines created: " + soLineProcessedCount +
                       ", lines with errors: " + soLineErrorCount);
            everliveAgent.destroy();
        });

        // TODO For testing only
        // createSalesOrderLine(salesOrderLines[0], function(err) {
        //     if (err) throw err;
        //     console.log("Line created");
        // });
    });
};

// Prompt for input file path
var defaultInputFilePath = process.env.home + '\\Desktop\\so-line-src-dest-mod-geocoded.json';

prompt.message = "";
prompt.delimiter = "";
var prompts = {
    properties: {
        inputFilePath: {
            description: "Enter JSON input file path:",
            default: defaultInputFilePath
        }
    }
};

console.log("\n\n***** GeoCodeLoader utility *****\n");
prompt.start();
prompt.get(prompts, function(err, result) {
    if (err) throw err;
    // console.log("prompt result = " + JSON.stringify(result));
    processInputFile(result.inputFilePath, result.outputFilePath);
});

