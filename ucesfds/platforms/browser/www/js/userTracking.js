var userMarker;
function trackLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(showPosition);
	}
	else {
		document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
	}
}

function showPosition(position) {
	if (userMarker){
		mymap.removeLayer(userMarker);
	}
	userMarker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap).bindPopup("<b>You were here</b>");
	getDistance();
}

function getDistance() {
	alert('getting distance');
	// getDistanceFromPoint is the function called once the distance has been found
	//navigator.geolocation.getCurrentPosition(getDistanceFromPoint);
	//navigator.geolocation.getCurrentPosition(getDistanceFromMultiplePoints);
	navigator.geolocation.getCurrentPosition(getDistanceFromForms);
}
function getDistanceFromPoint(position) {
	// find the coordinates of a point using the website
	// these are the coordinates for UCL
	var lat = 51.524616;
	var lng = -0.13818;
	// return the distance in kilometers
	var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'm');

	if (distance <= 100) {
		alert("You are " + distance +" m from UCL.")
	}
}

 function getDistanceFromMultiplePoints(position) {
 	var minDistance = 100000000000;
	var closestQuake = "";
	for(var i = 0; i < earthquakes.features.length; i++) {
		var obj = earthquakes.features[i];
		var distance = calculateDistance(position.coords.latitude,
		position.coords.longitude,obj.geometry.coordinates[0], obj.geometry.coordinates[1], 'K');
		if (distance < minDistance){
			minDistance = distance;
			closestQuake = obj.properties.place;
		}
}

alert("Earthquake: " + closestQuake + " is distance " + minDistance + "away");
 }

  function getDistanceFromForms(position) {
 	var minDistance = 100000000000;
	var closestForm = "";
	for(var i = 0; i < formJSON.features.length; i++) {
		var obj = formJSON.features[i];
		var distance = calculateDistance(position.coords.latitude,
		position.coords.longitude,obj.geometry.coordinates[0], obj.geometry.coordinates[1], 'K');
		if (distance < minDistance){
			minDistance = distance;
			closestForm = obj.properties.place;
		}
}

alert("Earthquake: " + closestQuake + " is distance " + minDistance + "away");
 }

// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
	dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
	// where radius of the earth is 3956 miles
	if (unit=="K") { dist = dist * 1.609344 ;} // convert miles to km
	if (unit=="N") { dist = dist * 0.8684 ;} // convert miles to nautical miles
	if (unit=="m") { dist = dist * 1609.344 ;} // convert miles to meters
	return dist;
}