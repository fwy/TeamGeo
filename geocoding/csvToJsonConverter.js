// Utility to convert CSV file into JSON file using the csvtojson library.
// Used to turn manually updated Excel CSV files into JSON for loading
// into the NoSQL data store.
//
// Run using node executable on Windows command line:
//
// node <this script name>

// Core nodejs modules
var fs = require('fs');

// Locally installed modules
var csvtojson = require('csvtojson');
var prompt = require('prompt');

var csvConverter = new csvtojson.Converter({
    constructResult: false,
    toArrayString: true,
});

// csvConverter.on("end_parsed", function(jsonArray) {
//     console.log("CSV file converted and written");
// });

// Prompt for input, output file paths
var defaultInputFilePath = process.env.home + '\\Desktop\\so-line-src-dest-mod-geocoded.csv';
var defaultOutputFilePath = process.env.home + '\\Desktop\\so-line-src-dest-mod-geocoded.json';

prompt.message = "";
prompt.delimiter = "";
var prompts = {
    properties: {
        inputFilePath: {
            description: "Enter CSV input file path:",
            default: defaultInputFilePath
        },
        outputFilePath: {
            description: "Enter JSON output file path:",
            default: defaultOutputFilePath
        }
    }
};

console.log("\n\n***** CsvToJsonConverter utility *****\n");
prompt.start();
prompt.get(prompts, function(err, result) {
    if (err) throw err;
    // console.log("prompt result = " + JSON.stringify(result));
    // Process input file
    var readStream = fs.createReadStream(result.inputFilePath);
    var writeStream = fs.createWriteStream(result.outputFilePath);
    readStream.on("end", function() {
        console.log("CSV file " + result.inputFilePath + " processed");
    });
    writeStream.on("end", function() {
        console.log("JSON file " + result.outputFilePath + " written");
        writeStream.end();
    });
    // Convert CSV input to JSON output
    readStream.pipe(csvConverter).pipe(writeStream);
});


