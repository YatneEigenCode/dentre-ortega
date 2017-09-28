//cgi.js 1-6-00 JChoy
//2-6-00  JChoy  use #
//-----
function Cgi() {
	this.version = '0.52'
	var sCgi = ''+document.location
	var aCgi = sCgi.split('?')
	//var sCgi = ''+ document.location.split('?')[1]
	this.locationBare = ''+aCgi[0]
	this.locationCgi = ''+aCgi[1]
	if (this.locationCgi=='undefined') {
		var aCgi = sCgi.split('#')
		this.locationCgi = ''+aCgi[1]
	}
	this.arrayCgi = this.locationCgi.split('&')
}
//-----
function cgiValue(key) {
	for (var i=0; i<this.arrayCgi.length; i++){
	  if (this.arrayCgi[i].split('=')[0] == key) { 
	    return unescape(this.arrayCgi[i].split('=')[1])
	  }
	}
	return('')
}
//-----
function cgiKey(i) {
	return unescape(this.arrayCgi[i].split('=')[0]) 
}
//-----
function cgiLength() {
	return this.arrayCgi.length
}
cgi = new Cgi()
Cgi.prototype.value = cgiValue
Cgi.prototype.key = cgiKey
Cgi.prototype.length = cgiLength
//-----END
