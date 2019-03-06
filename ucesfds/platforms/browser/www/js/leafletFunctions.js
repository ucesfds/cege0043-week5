function addPointLinePoly() {
	// add a point
	L.marker([51.5, -0.09]).addTo(mymap).bindPopup("I am a point");
	// add a line
	var polyline = L.polyline([
		[51.508, -0.13],
        [51.503, -0.11],
        [51.5, -0.095]
        ],
        {
          color: 'red',
          opacity: 0.7,
          lineJoin: 'round'
         }).addTo(mymap).bindPopup("I am a line.");
	// add a polygon with 3 end points (i.e. a triangle)
	var myPolygon = L.polygon([
	[51.509, -0.08],
	[51.503, -0.06],
	[51.51, -0.047]
	],{
	color: 'red',
	fillColor: '#f03',
	fillOpacity: 0.5
	}).addTo(mymap).bindPopup("I am a polygon.");
}

// create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the same variable
var client;
// and a variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on
var earthquakelayer;
// global variable to get hold of the Earthquakes data
var earthquakes;
// create the code to get the Earthquakes data using an XMLHttpRequest
function getEarthquakes() {
	client = new XMLHttpRequest();
	client.open('GET','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
	client.onreadystatechange = earthquakeResponse; // note don't use earthquakeResponse() with brackets as that doesn't work
	client.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
function earthquakeResponse() {
// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) {
		// once the data is ready, process the data
		var earthquakedata = client.responseText;
		loadEarthquakelayer(earthquakedata);
	}
}
// convert the received data - which is text - to JSON format and add it to the map
function loadEarthquakelayer(earthquakedata) {
	// convert the text to JSON
	var earthquakejson = JSON.parse(earthquakedata);
	earthquakes = earthquakejson;
	// add the JSON layer onto the map - it will appear using the default icons
	earthquakelayer = L.geoJson(earthquakejson).addTo(mymap);
	// change the map zoom so that all the data is shown
	mymap.fitBounds(earthquakelayer.getBounds());
}

// create a variable that will hold the XMLHttpRequest()
var client_poi;
// and a variable that will hold the london POI layer itself 
var poilayer;
// global variable to get hold of the POI data
var poi;
// create the code to get the POI data using an XMLHttpRequest
function getPoi() {
	var url = 'http://developer.cege.ucl.ac.uk:'+ httpPortNumber + "/getGeoJSON/london_poi/geom";
	client_poi = new XMLHttpRequest();
	client_poi.open('GET', url);
	client_poi.onreadystatechange = poiResponse; 
	client_poi.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
function poiResponse() {
// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client_poi.readyState === 4) {
		if (client_poi.status == 200 && client_poi.status < 300){ // http status between 200 to 299 are all successful
			// once the data is ready, process the data
			var poidata = client_poi.responseText;
			loadPoiLayer(poidata);
		}

	}
}
// convert the received data - which is text - to JSON format and add it to the map
function loadPoiLayer(poidata) {
	// convert the text to JSON
	var poijson = JSON.parse(poidata);
	poi = poijson;
	// add the JSON layer onto the map - it will appear using the default icons
	poilayer = L.geoJson(poijson).addTo(mymap);
	// change the map zoom so that all the data is shown
	mymap.fitBounds(poilayer.getBounds());
}

/////////
var xhrFormData;

function startFormDataLoad() {
	xhrFormData = new XMLHttpRequest();
	var url = "http://developer.cege.ucl.ac.uk:"+httpPortNumber;
	url = url + "/getGeoJSON/formdata/geom/"+httpPortNumber;
	xhrFormData.open("GET", url, true);
	xhrFormData.onreadystatechange = formDataResponse;
	xhrFormData.send();
}

function formDataResponse(){
	if (xhrFormData.readyState == 4) {
		// once the data is ready, process the data
		var formData = xhrFormData.responseText;
		loadFormData(formData);
	}
}
// keep the layer global so that we can automatically pop up a
// pop-up menu on a point if necessary
// we can also use this to determine distance for the proximity alert
var formLayer;
function loadFormData(formData) {
	// convert the text received from the server to JSON
	var formJSON = JSON.parse(formData);
	// load the geoJSON layer
	formLayer = L.geoJson(formJSON,
	{
	// use point to layer to create the points
	pointToLayer: function (feature, latlng)
	{
	// in this case, we build an HTML DIV string
	// using the values in the data
	var htmlString = "<DIV id='popup'"+ feature.properties.id + "><h2>" +
	feature.properties.name + "</h2><br>";
	htmlString = htmlString + "<h3>"+feature.properties.surname +
	"</h3><br>";
	htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_1'/>"+feature.properties.module+"<br>";
	htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_2'/>"+feature.properties.language+"<br>";
	htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_3'/>"+feature.properties.lecturetime+"<br>";
	htmlString = htmlString + "<input type='radio' name='answer' id ='"+feature.properties.id+"_4'/>"+feature.properties.port_id+"<br>";
	htmlString = htmlString + "<button onclick='checkAnswer(" +
	feature.properties.id + ");return false;'>Submit Answer</button>";
	// now include a hidden element with the answer
	// in this case the answer is alwasy the first choice
	// for the assignment this will of course vary - you can use feature.properties.correct_answer
	htmlString = htmlString + "<div id=answer" + feature.properties.id + " hidden>1</div>";
	htmlString = htmlString + "</div>";
	return L.marker(latlng).bindPopup(htmlString);
	},
	}).addTo(mymap);
	mymap.fitBounds(formLayer.getBounds());
}


function checkAnswer(questionID) {
	// get the answer from the hidden div
	// NB - do this BEFORE you close the pop-up as when you close the pop-up the
	DIV is destroyed
	var answer = document.getElementById("answer"+questionID).innerHTML;
	// now check the question radio buttons
	var correctAnswer = false;
	var answerSelected = 0;
	for (var i=1; i < 5; i++) {
		if (document.getElementById(questionID+"_"+i).checked){
			answerSelected = i;
		}
		if ((document.getElementById(questionID+"_"+i).checked) && (i == answer)) {
			alert ("Well done");
			correctAnswer = true;
		}
	}
	if (correctAnswer === false) {
		// they didn't get it right
		alert("Better luck next time");
	}
	// now close the popup
	mymap.closePopup();
	// the code to upload the answer to the server would go here
	// call an AJAX routine using the data
	// the answerSelected variable holds the number of the answer
	//that the user picked
}