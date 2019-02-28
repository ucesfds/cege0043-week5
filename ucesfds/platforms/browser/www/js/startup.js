function startup() {
	document.addEventListener('DOMContentLoaded',
	function() {
		trackAndPoly ();
	}, false);
}

function trackAndPoly() {
	trackLocation();
	addPointLinePoly();
	getEarthquakes();
}