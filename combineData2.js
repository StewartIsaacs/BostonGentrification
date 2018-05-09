var filename = '/Users/stewartisaacs/Documents/MIT Classwork/1.001/Final Project/Compile Datasets/Data/Economic JSON Files/economic_10.json';
var economic = require(filename);
var actual_names = ['Id2','Estimate; INCOME AND BENEFITS (IN 2010 INFLATION-ADJUSTED DOLLARS) - Total households',
    'Estimate; INCOME AND BENEFITS (IN 2010 INFLATION-ADJUSTED DOLLARS) - Nonfamily households',
    'Estimate; INCOME AND BENEFITS (IN 2010 INFLATION-ADJUSTED DOLLARS) - Per capita income (dollars)',
    'Percent; PERCENTAGE OF FAMILIES AND PEOPLE WHOSE INCOME IN THE PAST 12 MONTHS IS BELOW THE POVERTY LEVEL - All families',
    'Estimate; COMMUTING TO WORK - Mean travel time to work (minutes)',
    'Percent; EMPLOYMENT STATUS - In labor force - Civilian labor force - Unemployed'];
var easy_names = ['Geo ID','Tot Households','Nonfamily Households','Per Capita Income','Poverty %',
                    'Mean travel time to work (mins)','Unemployment %'];

// Look through the first entry of economic
// Find the keys that match the actual name
//Save the key
function getAllKeys(actual_names,filename){
    var economic = require(filename);
    var obj = economic[0];
    var keys_econ = [];
    var allKeys = Object.keys(obj);
    //console.log(allKeys.length)
    actual_names.forEach(census => {
        // Compare the element to all the string values in the object
        allKeys.forEach(key => {
            //console.log(obj[key]);
            if (obj[key] === census){
                keys_econ.push(key);
            }
        });
    });



    return keys_econ;
}

function replaceNames(actual_names,year){
    if (year != 2010){
        var newNames = actual_names.map(element => {
            if (element.includes("2010")){
                element = element.replace("2010",year);
            }
            if (element.includes("Numb")){
        
            }
            return element;
        })

    } else {
        newNames = actual_names;
    }
    return newNames;
}

function FileToArray (file,keys,values){
    // Array
    arr = []
    // Go through each object in the economic array and store into an object
    file.forEach( function (element,index) {
        var obj = {};
        for (i = 0;i < keys.length; i++){
            obj[values[i]] = element[keys[i]];
            arr.push(obj);
        }
    });
    return arr;
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

function cleanCombine(arr1,arr2){
    // Get rid of duplicates
    var combined = {};
    for(var i=0;i<arr1.length;i++){
        var data = arr1[i];
        combined[data['Geo ID']] = data;
    }

    // Add data from arr2 to the object
    for(var i=0;i<arr2.length;i++){
        var data = arr2[i];
        // Add all the properties from arr2
        var allprops = Object.keys(data);
        allprops.forEach(property => {
            combined[data['Geo ID']][property] = data[property];
        })

    }
    // Convert from object back into an array
    var combinedArray = []
    for(var objectProperty in combined){
        combinedArray.push(combined[objectProperty]);
    }

    return combinedArray;

}

function addPAData(arr,year){
      // Add the associated PA data if possible
      doneArr = [];
      arr.forEach(obj =>{
        var assoc_zip = getZipcode(obj['Geo ID']);
        var prop_file = '/Users/stewartisaacs/Documents/MIT Classwork/1.001/Final Project/Compile Datasets/Property Data/PA_averaged10.json';
        var prop_data = require(prop_file.replace('10',year.toString().slice(2)));
        if(Object.keys(prop_data).includes(assoc_zip.toString())){
            obj['Val per sq Ft.'] = prop_data[assoc_zip];
            doneArr.push(obj);
        };
      })

    return doneArr;
}

function getZipcode(tract_num){
    var zipConv = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/Final Project/Compile Datasets/zipConvert.json');
   var num = 0;
    zipConv.forEach(thing =>{
        if (thing.tract == tract_num){
            //console.log('Zip is: ' + obj.zip);
            //console.log(Number(obj.zip));
            num = thing.zip;
        }
    })
    return Number(num);

}

// Go through all relevant years
var year = 2010;
console.log('Entering loop');
for (year=2010;year<2017;year++){
    // Replace the names in actual names if necessary
    if (year != 2010){ 
        var oldYear = year - 1;
        filename = filename.replace(oldYear.toString().slice(2),year.toString().slice(2))};
    //console.log(filename);
    
    var newNames = replaceNames(actual_names,year);
   //console.log(newNames);
    // Get all the keys for the new file
    var allKeys = getAllKeys(newNames,filename);

    // Turn into an array of arrays
    var econ_file = require(filename);
    var econ_arr = FileToArray (econ_file,allKeys,easy_names);
    //console.log(econ_arr);

    // Clean and combine datasets
    var dem_file = '/Users/stewartisaacs/Documents/MIT Classwork/1.001/Final Project/Compile Datasets/Clean Demos for Appending/demo_10.json';
    if (year != 2010){ 
        var oldYear = year - 1;
        dem_file = dem_file.replace(oldYear.toString().slice(2),year.toString().slice(2))};
    var dem_arr = require(dem_file);
    var combinedArr = cleanCombine(dem_arr,econ_arr);
    console.log('Now to add PA data...');
    var completeArr = addPAData(combinedArr,year);

    // Save the array as a JSON file
   var name = 'complete_' + year.toString().slice(2) + '.json'
   createJSONFile(combinedArr,name);

}

