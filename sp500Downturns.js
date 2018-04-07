const fs = require('fs')
let price = {}; 
fs.readFile('ie_data.json', function(err, data) {
    price = JSON.parse(data);
    let differences = [];   //hold and array of objects {date1 (first date), date2(all later dates than date1), index_difference(index price of date1 - index prices of date2), normalized_index_difference (difference/date1 price)}
    for(var i of price)
    {
       for(var j of price)
       {
           
           if(j.field1>i.field1)   //if we are comparing a date and a future date. We don't care about a date and past dates because "naturally" the stock market rises
           {
                var subtract = i.field2-j.field2;    //subtract index prices
                differences.push({
                    date1: i.field1, 
                    date2: j.field1, 
                    date_difference: j.field1 - i.field1,
                    index_difference: subtract,
                    normalized_index_difference: subtract/i.field2
                    });
            }
       }
    }
    differences.sort((function(a, b) {  //sort by larger normalized differences
        return b.normalized_index_difference - a.normalized_index_difference;
      }));

    var differences_sorted_bad_years = [];
    for(var i of differences){
        if(i.index_difference > 0) //if decline between two dates, add to array
            differences_sorted_bad_years.push(i);
    }

    differences_sorted_bad_years.sort((function(a, b) { //sort by longest decrease
          return b.date_difference - a.date_difference;
      }));
    console.log('price{} length: '+ price.length);
    console.log('price{} length squared: '+price.length*price.length)
    console.log('differences[] length: ' + differences.length);
    

    for(var i = 0; i < 100; i++)
        console.log('differences['+i+']: ' + JSON.stringify( differences_sorted_bad_years[i]));
    fs.writeFile("badYears.json",JSON.stringify(differences_sorted_bad_years) , function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
  });
 
  