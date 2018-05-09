var score_gen = function(year1, year2){

    //Fetch %age white people in 1st year
    white_1 =[] 
    year1.forEach(function(entry){
        white_1.push(entry['% White'])
    })
    
    //Fetch %age white people in 2nd year
    white_2 =[] 
    year2.forEach(function(entry){
        white_2.push(entry['% White'])
    })
    
    
    //Calculate change in proportion of white people
    
    white_delta=[]
    
    for (i=1;i<1479;i++){
        result = (Number(white_2[i])-Number(white_1[i])).toFixed(1)
       white_delta.push(Number(result))
       console.log(result);
    }
    
    
    //console.log(white_delta)
    
    //Fetch avg income in 1st year
    income_1 =[] 
    year1.forEach(function(entry){
        income_1.push(entry['Per Capita Income'])
    })
    //Fetch avg income in 2nd year
    income_2 =[] 
    year2.forEach(function(entry){
       income_2.push(entry['Per Capita Income'])
    })
    
    
    //Calculate change in avg income
    income_delta=[]
    
    for (i=1;i<1479;i++){
        result = (Number(income_2[i])-Number(income_1[i]))/(0.01*Number(income_1[i]))
        income_delta.push(Number(result.toFixed(2)))
    }


    // Get prop data for each year
    prop_1 = [];
    year1.forEach(element =>{
        if (element['Val per sq Ft.']){
            prop_1.push(element['Val per sq Ft.']);
        } else {
            prop_1.push(0);
        }
    });
    prop_2 = [];
    year2.forEach(element =>{
        if (element['Val per sq Ft.']){
            prop_2.push(element['Val per sq Ft.']);
        } else {
            prop_2.push(0);
        }
    });

    //Calculate change in prop values
    prop_delta=[];
    
    for (i=1;i<1479;i++){
        result = (Number(prop_2[i])-Number(prop_1[i]));
        prop_delta.push(Number(result.toFixed(2)))
        //console.log(result);
    }

    
    //Calculate score using specified weights
    scores =[]
    for (i=1;i<1479;i++){
        res =(0.42*income_delta[i]+0.42*white_delta[i]+0.16*prop_delta[i])
        //score.push(Number(res.toFixed(2)))
        small_arr = [];
        small_arr.push(year2[i]["Tract Number"]);
        var num = Number(res.toFixed(2));
        small_arr.push(num);
        if (! Number.isNaN(num)){
            scores.push(small_arr);
        }
    }
    
    //console.log(score)
    
    return scores
    }

    function convertToJSON(arr,name,num1,num2){
        var jsonData = JSON.stringify(arr);
        // Turn JSON into file
        var varName = 'var full_' + num1.toString() + num2.toString() + ' = ';
        jsonData = jsonData.replace (/^/,varName);
        //console.log(jsonData);
        var fs = require('fs');
        fs.writeFile(name, jsonData, function(err) {
            if (err) {
                console.log(err);
            }
        });
        
    }

    var data10 = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Colored Map Practice/complete_10.json');
    var data11 = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Colored Map Practice/complete_11.json');
    var data12 = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Colored Map Practice/complete_12.json');
    var data13 = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Colored Map Practice/complete_13.json');
    var data14 = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Colored Map Practice/complete_14.json');
    var data15 = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Colored Map Practice/complete_15.json');
    var data16 = require('/Users/stewartisaacs/Documents/MIT Classwork/1.001/project-practice/Colored Map Practice/complete_16.json');

    var dataArr = [data10,data11,data12,data13,data14,data15,data16];

    // Loop through all the data we have
    var score = score_gen(data10,data16);
    convertToJSON(score,'complete_scoresV2_1016.js',10,16);
/*
    for (j = 0; j < dataArr.length - 1;j++) {
        var score = score_gen(dataArr[j],dataArr[j+1]);
        var num1 = 10+j;
        var num2 = 11+j;
        var name = 'complete_scoresV2_' + num1.toString() + num2.toString()+ '.js';
        console.log(name);
        convertToJSON(score,name,num1,num2);
    }
    //var score_1011 = score_gen(data10, data11);
    //convertToJSON(score_1011,'scores_1011.json');
    //console.log(score_1011);
    
    /*
    score_1112 = score_gen(data11, data12)
    score_1213 = score_gen(data12, data13)
    score_1314 = score_gen(data13, data14)
    score_1415 = score_gen(data14, data15)
    score_1516 = score_gen(data15, data16)
    */
    
    