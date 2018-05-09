var rent_data = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Rental Data Practice/rental_data.json');

/*
// Count how many times the metro is Boston
num_boston = 0;
arr = [];
rent_data.forEach(element => {
    if (element['Metro'] == "Boston"){
        num_boston++;
        var zipcode = element["RegionName"];
        console.log(zipcode);
        var tract = Findtract(zipcode);
        var obj =  {"Zipcode":zipcode,"Tract #": tract};
        arr.push(obj);
    }
});

//console.log(num_boston);
*/

var prop_data = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Rental Data Practice/property_jsons/property-assessment-fy10.json');
var prop_data2 = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Rental Data Practice/property_jsons/property-assessment-fy11.json');
var prop_data3 = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Rental Data Practice/property_jsons/property-assessment-fy14.json');
prop_filepath = '/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Rental Data Practice/PA_10.json';

function PA_data_obj(prop_file){
    var residential_codes = ['A','CD','R1','R2','R3','R4','RC','RL'];
    var allZips = {};
    var zipNvalue = {};
    prop_file.forEach(element => {
        // Check If it's a residential property
        var prop_code = element.Type;
        if (residential_codes.includes(prop_code) && element.Total_Val && element.Living_Area){
            // Find the property value per sq ft of living area
            var val_per_area = Number(parseFloat(element.Total_Val) / parseFloat(element.Living_Area)).toFixed(2);
            if (val_per_area == Infinity) {
                val_per_area = 300.00;
            }
            if (Number.isNaN(val_per_area)) {console.log('Slipped thru...!')};
            var zip = parseInt(element.ZIPCODE);
            // Check if we've seen this zipcode
            if (!zipNvalue[zip]){
                //Create new key value pair
                zipNvalue[zip] = val_per_area;
                allZips[zip] = 0;
            } else {
                // Average this with others with the same zipcode
                zipNvalue[zip] = (Number(zipNvalue[zip]) + Number(val_per_area))/2;
                allZips[zip]++;
            }
        }
    });
    return zipNvalue;

}


for (year = 10; year < 19; year++){
var path = prop_filepath.replace('10',year.toString());
var prop_dataset = require(path);
var PA_data = PA_data_obj(prop_dataset);
var name = 'PA_averaged' + year.toString() + '.json';
createJSONFile(PA_data,name);
}



//createJSONFile(arr,'ZipsNTracts.JSON');

function Findtract(zipcode){
    var ZiptoTract = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Rental Data Practice/zipConvert.json');
    var tract_num;
    ZiptoTract.forEach(element => {
        if (element['zip'] == zipcode){
            tract_num = element['tract'];
        }
    })
    return tract_num;
}

function createJSONFile(array,name){
    var jsonData = JSON.stringify(array);
    //console.log(jsonData);
    
    // Turn JSON into file
    var fs = require('fs');
    fs.writeFile(name, jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
    };