function startup() {
	document.addEventListener('DOMContentLoaded',
	function() {
		getPort();
		trackAndPoly ();
	}, false);
}

function trackAndPoly() {
	trackLocation();
	addPointLinePoly();
	getEarthquakes();
}