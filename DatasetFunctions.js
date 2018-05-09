//var economic = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/Final Project/Compile Datasets/economic_12.json');
var filepath = '/Users/stewartisaacs/Documents/MIT Classwork/1.001/Final Project/Compile Datasets/Data/Demographic JSON Files/demographic_10.json';
var demographic = require(filepath);


        // Create Demographic Data Key Pairs
        var key_dem = ['GEO.id2','GEO.display-label','HC01_VC03','HC03_VC04','HC03_VC05','HC03_VC40', 'HC03_VC82',
        'HC03_VC43','HC03_VC44','HC03_VC45','HC03_VC50','HC03_VC62'];
        var pairs_dem = ['Geo ID','Tract info','Total Pop','% Males',' % Female','% 2 or more races','% Hispanic', '% White', '% Black',
                    '% Native', '% Asian', '% Pacific'];
        // Economic Data Key Pairs
        var key_econ = ['HC01_EST_VC58','HC01_EST_VC96','HC01_EST_VC70','HC01_EST_VC69','HC01_EST_VC98','HC01_EST_VC97','HC01_EST_VC111','HC01_EST_VC27','HC02_EST_VC04','HC02_EST_VC06'];
        var pairs_econ = ['Tot Family Households','Tot Nonfamily Households','Mean Family Income','Median Family Income','Mean Nonfamily income','Median Nonfamily income',
                        '% families in poverty','Mean Commute','% Civilian Employed','% Unemployed'];
        var actual_names = ['Estimate; INCOME AND BENEFITS (IN 2010 INFLATION-ADJUSTED DOLLARS) - Total households','Number; Estimate; INCOME AND BENEFITS (IN 2009 INFLATION-ADJUSTED DOLLARS) - Nonfamily households'];
    
    
// Loop through all the years we have
for (year=2010;year<2017;year++){
    // If the year is not 2009, replace the file
    if (year > 2010){
        filepath = filepath.replace("10",year.toString().slice(2));
        var demographic = require(filepath);
    }
        // Turn file into array with Demographic Data
        arr = FileToArray(demographic,key_dem,pairs_dem);
        //Clean the tract info
        cleanedArr = cleanTractInfo(arr);
        console.log(cleanedArr[987]);
        // Make a JSON
        name = "demo_" + year.toString().slice(2) + ".json";  //Example: name = "demo_12.json";
        createJSONFile(cleanedArr,name);
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

function AddToArray (arr,add,keys,values){
    // Go through the array
    arr.forEach(function(element,index){
        // Add economic info to the object
        for (i = 0;i < keys.length; i++){
            if (typeof add[index] != 'undefined'){
                element[values[i]] = add[index][keys[i]];
            }
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

function cleanTractInfo(arr){
    arr.forEach(element => {
        if (typeof element['Tract info'] != 'undefined'){
               // Break the data into three different entries
        var str = element['Tract info'].split(",");
        //Grab the Tract Number
        var tractNum = str[0].replace( /^\D+/g, ''); // replace all leading non-digits with nothing
        element['Tract Number'] = tractNum;
        // Get the county and state
        element['County'] = str[1];
        element['State'] = str[2];

        // Delete the Tract info property
        delete element['Tract info'];
        }
    
    });
    return arr;
}
// Go through the JSON file and break the Tract Info into three different data points
//var newfile = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/dem_pract.json');






    