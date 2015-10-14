// GeoCoder utility to populate geographical coordinates of sales order lines
// by calling the Gisgraphy geocoding web service.
//
// Run using node executable on Windows command line:
//
// node <this script name>

// TODO This utility does not work with Gisgraphy, as it seems all HTTP
// requests sent from outside a web browser return 503 errors.  Consider
// switching to another geocode service, as it appears that Gisgraphy
// may disallow and even blackball attempts to bulk-geocode
// data outside of a browser client.
//
// After some investigation, I found that Nominatim (OpenStreetMap) has
// the same issues as Gisgraphy and returns lower-quality results.  Other
// candidates are MapQuest, Google, and Bing, but all of them require accounts
// and meter and/or limit usage.

// Core nodejs modules
var fs = require('fs');
var http = require('http');

// Locally installed modules
var prompt = require('prompt');
var async = require('async');

var gisgraphyPathBase = "/geocoding/geocode?format=json";
var salesOrderLines = [];

// Get geocode values for address
// var getGeocodeForAddress = function(address) {
//     console.log("address = " + address);
//     var gisgraphyOptions = {
//         host: "services.gisgraphy.com",
//         port: 80,
//         path: gisgraphyPathBase + encodeURI(address)
//     };

//     var geocodedData = {};
//     http.request(gisgraphyOptions, function(res) {
//         console.log("Got response: " + res.statusCode);
//         var body = '';
//         res.on('data', function(chunk) {
//             console.log("Got chunk: " + chunk);
//             body += chunk;
//         });
//         res.on('end', function() {
//             console.log("Geocode data for address = " + body);
//             geocodedData = JSON.parse(body);
//         });
//     }).on('error', function(err) {
//         console.log("Error: " + err.message);
//     });
// };

// Set geocode values for sales order line
var setGeocodesForOrderLine = function(soLine, i, soLines) {
    var gisgraphyOptions = {
        host: "services.gisgraphy.com",
        // headers: {
            // "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
        // }
    };

    async.series([
        function(){
            // Get source address location
            var gisgraphyAddress = "&address=" + soLine.srcAddress;
            var gisgraphyCountry = "&country=" + soLine.srcIsoCountry;
            gisgraphyOptions.path = gisgraphyPathBase + encodeURI(gisgraphyAddress + gisgraphyCountry);
            console.log("path = " + gisgraphyOptions.path);
            // var srcRequestUrl = "http://" + gisgraphyOptions.host + gisgraphyOptions.path;
            // console.log("srcRequestUrl = " + srcRequestUrl);
            // http.get(srcRequestUrl, function(res) {
            http.get(gisgraphyOptions, function(res) {
                console.log("Got response: " + res.statusCode);
                var body = "";
                res.on('data', function(chunk) {
                    console.log("Got chunk: " + chunk);
                    body += chunk;
                });
                res.on('end', function() {
                    console.log("Geocoded data for src address = " + body);
                    var geocodedData = JSON.parse(body);
                    soLines[i].srcLongitude = geocodedData.result[0].lng;
                    soLines[i].srcLatitude = geocodedData.result[0].lat;
                });
            }).on('error', function(err) {
                console.log("Error: " + err.message);
            });
            // var srcGeocodeData = getGeocodeForAddress(soLine.srcAddress);
            // soLines[i].srcLongitude = srcGeocodeData.result[0].lng;
            // soLines[i].srcLatitude = srcGeocodeData.result[0].lat;
         },
        function(){
            // Get destination address location
            var gisgraphyAddress = "&address=" + soLine.destAddress;
            var gisgraphyCountry = "&country=" + soLine.destIsoCountry;
            gisgraphyOptions.path = gisgraphyPathBase + encodeURI(gisgraphyAddress + gisgraphyCountry);
            console.log("path = " + gisgraphyOptions.path);
            // var destRequestUrl = "http://" + gisgraphyOptions.host + gisgraphyOptions.path;
            // console.log("destRequestUrl = " + destRequestUrl);
            // http.get(destRequestUrl, function(res) {
            http.get(gisgraphyOptions, function(res) {
                console.log("Got response: " + res.statusCode);
                var body = "";
                res.on('data', function(chunk) {
                    console.log("Got chunk: " + chunk);
                    body += chunk;
                });
                res.on('end', function() {
                    console.log("Geocoded data for dest address = " + body);
                    var geocodedData = JSON.parse(body);
                    soLines[i].destLongitude = geocodedData.result[0].lng;
                    soLines[i].destLatitude = geocodedData.result[0].lat;
                });
            }).on('error', function(err) {
                console.log("Error: " + err.message);
            });
            // var destGeocodeData = getGeocodeForAddress(soLine.destAddress);
            // soLines[i].destLongitude = destGeocodeData.result[0].lng;
            // soLines[i].destLatitude = destGeocodeData.result[0].lat;
        }
    ]);
};

// Read and process JSON input file
var processInputFile = function(inFile, outFile) {
    fs.readFile(inFile, function(err, data) {
        if (err) throw err;
        console.log("Processing input file " + inFile + " ...");
        salesOrderLines = JSON.parse(data);
        // salesOrderLines.forEach(setGeocodesForOrderLine);
    
        // TODO For testing only
        async.series([
            // Set geocodes for first order line
            function() {
                setGeocodesForOrderLine(salesOrderLines[0], 0, salesOrderLines);
            },
            // Write output file
            function() {
                fs.writeFile(outFile, function(err) {
                    if (err) throw err;
                    console.log("Wrote output file " + outFile);
                });
            },
        ]);
    
        // TODO For testing only
        // var lineCnt = salesOrderLines.length;
        // console.log("# entries: " + lineCnt);
        // console.log("First entry: " + JSON.stringify(salesOrderLines[0]));
        // console.log("Last entry: " + JSON.stringify(salesOrderLines[lineCnt - 1]));
        // fs.writeFile(process.env.home + '/Desktop/so-line-src-dest-mod-test.json', JSON.stringify(salesOrderLines), function(err) {
        //     if (err) throw err;
        // });
    });
};


// Prompt for input, output file paths
var defaultInputFilePath = process.env.home + '\\Desktop\\so-line-src-dest-mod.json';
var defaultOutputFilePath = process.env.home + '\\Desktop\\so-line-src-dest-geocoded.json';

prompt.message = "";
prompt.delimiter = "";
var prompts = {
    properties: {
        inputFilePath: {
            description: "Enter JSON input file path:",
            default: defaultInputFilePath
        },
        outputFilePath: {
            description: "Enter JSON output file path:",
            default: defaultOutputFilePath
        }
    }
};

console.log("\n\n***** GeoCoder utility *****\n");
prompt.start();
prompt.get(prompts, function(err, result) {
    if (err) throw err;
    // console.log("prompt result = " + JSON.stringify(result));
    processInputFile(result.inputFilePath, result.outputFilePath);
});

