var closeddate = []
var basement = []
var bathstotal = []
var beds = []
var domact = []
var garagecap = []
var salesprice = []
var addressURLArray = []
var daysonmarket = []
var listprice = []
var streetname = []
var streetnumber = []
var lat = []
var lng = []
var tcs
var markers
var geocodeURl = []



var myMap = L.map("map", {
    center: [40.661930, -74.211650],
    zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);



function getElementValue() {
    
    var location
    markers = L.markerClusterGroup();
    

    let inputElement = d3.select("#real-estate-form-input").property("value");
    //Split the values into an array
    tcs = inputElement.split(',')

    addressURLArray[0] = `/G_town=/${tcs[0]}/G_county=/${tcs[1]}/G_state=/${tcs[2]}`

    // console.log(addressURLArray)
    daysonmarket = []
    listprice = []
    streetname = []
    streetnumber = []
    geocodeURl = []
    closeddate = []
    basement = []
    bathstotal = []
    beds = []
    domact = []
    garagecap = []
    salesprice = []


    d3.json(addressURLArray).then((response) => {


        // console.log(response)
        response.forEach(e => {
            // console.log(e[0])
            listprice.push(e.listprice)
            streetname.push(e.streetname)
            streetnumber.push(e.streetnumber)
            daysonmarket.push(e.daysonmarket)
            closeddate.push(e.closeddate)
            basement.push(e.basement)
            bathstotal.push(e.bathstotal)
            beds.push(e.beds)
            domact.push(e.domact)
            garagecap.push(e.garagecap)
            salesprice.push(e.salesprice)

        });
        for (let i = 0; i < response.length; i++) {
            geocodeURl.push(`https://maps.googleapis.com/maps/api/geocode/json?address=${streetnumber[i]}+${streetname[i]},
            +${tcs[0]},+${tcs[2]}&key=${gkey}`)
        }

        
        
        
        for (let j = 0; j < geocodeURl.length; j++) {
            if (geocodeURl[j]) {
            d3.json(geocodeURl[j]).then((response) => {
                
                location = response.results[0].geometry.location

     

                    if (lat && lng) {
                        markers.addLayer(L.marker([location.lat, location.lng])
                            .bindPopup(`<b>${response.results[0].formatted_address}</b><hr>
                            List Price:<b>${listprice[j]}</b>
                            <br>Sales Price:<b>${salesprice[j]}</b>
                            <br>Beds:<b>${beds[j]}</b>
                            <br>Baths:<b>${bathstotal[j]}</b>
                            <br>Basement:<b>${basement[j]}</b>
                            <br>Garage Capacity:<b>${garagecap[j]}</b>
                            <br>Closed Date:<b>${closeddate[j]}</b>
                            <br>Days on Market:<b>${domact[j]}</b>`));
                        }
            
                        myMap.addLayer(markers);
            

            });
        }
        }
        
    });




}






var button = d3.select("#mybutton");
button.on('click', () => {
    document.getElementById('myModal').style.display = 'block';
    setTimeout(function() {
        myMap.invalidateSize();
    }, 100);
    
    getElementValue();


});







