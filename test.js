const fs = require('fs');
const { Parser } = require('json2csv');
const csv2 = require('csvtojson/v2')
var csvWriter = require('csv-write-stream');
const json2csv = require('json2csv').parse;

const createCsvWriter = require('csv-writer').createObjectCsvWriter;  

{
	 "csv-parser": "^2.2.0",
    "csv-write-stream": "^2.0.0",
    "csv-writer": "^1.3.0",
    "csvtojson": "^2.0.8",
    "express": "^4.16.4",
    "json2csv": "^4.5.0",
    "jsonexport": "^2.4.1"
}

function createCSV(name, data) {
	console.log('name = ' + name);
	console.log(data);

	const columns = ['Column B','Cloumn C'];
	const json2csvParser = new Parser({columns});
	const csv = json2csvParser.parse(data);
	console.log()
	console.log(csv);
	
//var writer = csvWriter();
//writer.pipe(fs.createWriteStream(name + '.csv'))
//writer.write(data)
//writer.end()

fs.stat(name + '.csv', (err, resp) => {
    if(err) {
		console.log('file creates');
		console.log(err);
        fs.writeFileSync(name + '.csv', csv);
    } else {
		console.log('file apending');
		fs.appendFile(name + '.csv', csv.replace('"Column B","Column C"',''), (err, resp) => {
        if(err) reject(err);
        else resolve();
    });
	}
});

}

function getCsvData(keys, csvRow) {
	const data = JSON.parse(JSON.stringify(csvRow));
	delete data[keys[0]];
	return data;
}

csv2().fromFile('node_test.csv').then((jsonObj)=>{
	//console.log(jsonObj);
	jsonObj.forEach((csvRow) => {
		let keys = Object.keys(csvRow);
		//console.log('printing inside parser...');
		console.log(getCsvData(keys, csvRow));
		createCSV(csvRow[keys[0]], getCsvData(keys, csvRow));
	});
});
