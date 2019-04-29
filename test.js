const fs = require('fs');
const {Parser} = require('json2csv');
const csv2 = require('csvtojson/v2');

/* Provide the path of csv file */
const csvFilePathUrl = 'node_test.csv';

/* This function will remove header of csv and return new csv */
function removeCsvHeader(headers, csv) {
    let headerStr = "";
    headers.forEach((header) => {
        headerStr = headerStr + '"' + header + '"' + ','
    });
    return csv.replace(headerStr.slice(0, -1), '');
}

/* This function will create new csv file is not exists and if exits will append new row*/
function createCSV(name, data, callback) {

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    const isPresent = fs.existsSync(name);

    if (!isPresent) {
        fs.writeFile(name, csv, (err, res) => {
            if (!err) {
                console.log('New file created...');
                callback(null, true);
            }
        });
    } else {
        const csvWithoutHeader = removeCsvHeader(Object.keys(data), csv);
        fs.appendFile(name, csvWithoutHeader, (err, res) => {
            if (!err) {
                console.log('File already available so data apended');
                callback(null, true);
            }
        });
    }
}

function getCsvData(keys, csvRow) {
    const data = JSON.parse(JSON.stringify(csvRow));
    delete data[keys[0]];
    return data;
}

/* This function will call recursively for creating and appending data to csv till csvRows length*/
function start(index, csvRows) {
    let item = csvRows[index];
    let keys = Object.keys(item);
    let fileName = item[keys[0]] + '.csv';

    createCSV(fileName, getCsvData(keys, item), (err, res) => {
        index += 1;
        if (res && index < csvRows.length) {
            start(index, csvRows);
        } else if (err) {
            console.log('error while creating file or writing the file.');
            console.log(err);
        }
    });
}



/* This function will read the csv file and return json */
csv2().fromFile(csvFilePathUrl).then((jsonObj) => {
    let index = 0;
    start(index, jsonObj);
}, (error) => {
    console.log('Please Provide the valid csv file path');
   // console.log(err);
});
