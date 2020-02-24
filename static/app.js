// Function to autocomplete and build plots
function autoCompleteandBuild() {

    var bt = []

    //D3 for getting the town, county and state
    d3.json("/towncountystate").then(cts => {

        cts.forEach(e => {
            bt.push(`${e.town}, ${e.county}, ${e.state}`)

        });


    });

    //button event listener and retreival of city/state and county data
    var button = d3.select("#real-estate-button");
    button.on("click", () => {
        console.log('Im clicking!')

        // Select the input element and get the raw HTML node
        var inputElement = d3.select("#real-estate-form-input");
        // Get the value property of the input element
        var inputValue = inputElement.property("value");
        // Check that not a blank input


        if (inputValue == "") {
            alert("Name must be filled out");
            return false;
        }


        $(() => {

            $("#real-estate-form-input").autocomplete({
                source: bt
            });
            console.log(bt)
        });


        //Array split to get town/county nd state and append to URL
        var tcsArr = inputValue.split(",")

        var url = `/town=/${tcsArr[0]}/county=/${tcsArr[1]}/state=/${tcsArr[2]}`;

        //D3 to get specified data from flask
        d3.json(url).then(response => {

            let date = []
            let soldavlp = []
            let soldavdom = []
            var town
            var county
            var state
            let avlp = []
            let activenum = []
            let soldnum = []
            let sp_lp = []

            response.forEach(e => {
                date.push(e.date)
                soldavlp.push(e.soldavlp)
                town = e.town
                county = e.county
                state = e.state
                avlp.push(e.avlp)
                activenum.push(e.activenum)
                soldavdom.push(e.soldavdom)
                soldnum.push(e.soldnum)
                sp_lp.push(e.sp_lp)
            });
            
            let reverseSoldnum = soldnum.reverse()
            let reverseDate = date.reverse()
            let reverseSoldavdom =soldavdom.reverse() 
            let reverseSp_lp =sp_lp.reverse() 
            console.log(reverseSoldavdom)
             //----------------------------------------------

             var trace1 = {
                x: reverseDate,
                y: avlp,
                name: 'Average List Price',
                marker: {color: 'rgb(55, 83, 109)'},
                type: 'bar'
              };
              
              var trace2 = {
                x: reverseDate,
                y: soldavlp,
                name: 'Average Sold Price',
                marker: {color: 'rgb(26, 118, 255)'},
                type: 'bar'
              };
              
              var data = [trace1, trace2];
              
              var layout = {
                title: town+","+county+","+state+" Average List Price vs. Sold Price Comparison",
                xaxis: {tickfont: {
                    size: 14,
                    color: 'rgb(107, 107, 107)',
                    
                  }},
                yaxis: {
                  title: 'USD',
                  titlefont: {
                    size: 16,
                    color: 'rgb(107, 107, 107)'
                  },
                  tickfont: {
                    size: 14,
                    color: 'rgb(107, 107, 107)'
                  }
                },
                legend: {
                  x: 0,
                  y: 1.0,
                  bgcolor: 'rgba(255, 255, 255, 0)',
                  bordercolor: 'rgba(255, 255, 255, 0)'
                },
                barmode: 'group',
                bargap: 0.15,
                bargroupgap: 0.1
              };
              
              Plotly.newPlot('bar', data, layout);

            //----------------------------------------------

            var trace3 = {
                x: reverseDate,
                y: activenum,
                mode: 'lines+markers',
                line: {
                    color: 'rgb(0,128,128)',
                    width: 3
                  }
              };
            var data1 = [ trace3 ];
              
              var layout1 = {
                title: town+','+county+','+state+'  Number of Houses on the Market per Month'
              };
              
              Plotly.newPlot('line', data1, layout1);

            //----------------------------------------------
            var trace4 = {
                x: reverseDate,
                y: reverseSoldavdom,
                mode: 'lines+markers',
                line: {
                    color: 'rgb(0,128,128)',
                    width: 3
                  }
              };
              
            var data2 = [ trace4 ];
              
              var layout2 = {
                title:town+','+county+','+state+ ' Average Days on the Market'
              };
              
              Plotly.newPlot('line2', data2, layout2);
            //----------------------------------------------
            var trace5 = {
                x: reverseDate,
                y: reverseSoldnum,
                mode: 'lines+markers',
                line: {
                    color: 'rgb(0,128,128)',
                    width: 3
                  }
              };
              
            var data3 = [ trace5 ];
              
              var layout3 = {
                title:town+','+county+','+state+ ' Number of Units Sold'
              };
              
              Plotly.newPlot('line3', data3, layout3);
               //----------------------------------------------
            var trace6 = {
                x: reverseDate,
                y: reverseSp_lp,
                mode: 'lines+markers',
                line: {
                    color: 'rgb(0,128,128)',
                    width: 3
                  }
              };
              
            var data4 = [ trace6 ];
              
              var layout4 = {
                title:town+','+county+','+state+ ' Sales Price to List Price Ratio',

                yaxis: { title: "Percentage (%)"
                }
              };
              
              Plotly.newPlot('line4', data4, layout4);

        });

    });
}


autoCompleteandBuild()


















