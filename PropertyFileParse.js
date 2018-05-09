var fs = require('fs');
var parse = require('csv-parse');

var parser = parse({delimiter: ','}, function(err, data){
	// check length of data array
	var length = data.length;
	console.log('length: ' + length);

	// create array of listing objects
	var listings = [];
	var listing;
	for(var i=1; i<length; i++){
		listing = {};
        listing.Type 			= data[i][8];
        listing.ZIPCODE 			= data[i][6];
        listing.Total_Val       =data[i][16];
        listing.Living_Area       =data[i][22];
	
		listings.push(listing);
	}

	// check size of listings array
	console.log('listings.length:' + listings.length);

	// write listings to file
	fs.writeFile(fileName, JSON.stringify(listings), function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	}); 
});

var fileName = 'PA_10.json';
var csvName = 'property-assessment-fy10.csv';
for (year = 18; year < 19; year++){
    if (year != 10){
        csvName = csvName.replace('10',year.toString());
        fileName = fileName.replace('10',year.toString());
    }
    console.log(csvName);
    console.log(fileName);
    fs.createReadStream(csvName).pipe(parser);
    }
