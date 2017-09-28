//Copyright 2000 Johnston Choy, OK88 LLC 
//http://www.ok88.com http://www.okdaily.com
//License Agreement: GNU General  Public License
//11-21-01 JChoy dblsrc.js v0.52 (from menu.js)
//11-21-01 JChoy menu.js v0.56 in favor of cookie method
//2002
//3-5  JChoy v0.58 fixUrl
//3-14 " 0.59 cqPaste, reload->fix Url
function fixPluses(s){return s.split("+").join("%20");}
function cqPaste(){location="cqpaste.htm"+location.search}
function Cgi(s){
	var aT=(s+"?").split("?");
	this.locationBare= aT[0];
	this.aCgi= (aT[1]=="")? []:aT[1].split("&");
	this.id= "cgi";
	this.click= 0;
	this.value= function(s) {
		for (var i=0; i<this.aCgi.length; i++){
			var aKV= this.aCgi[i].split("=");
			if (aKV[0]==s) return unescape(fixPluses(aKV[1]));
		} return "";
	}
	this.dw= function(s){document.write(s)}
}
var cgi=new Cgi(location);

function about10(msg){
	var lsW= [window.screenX,window.screenY,window.outerWidth,window.outerHeight];
	var lsP= [lsW[0]+lsW[2]/4,lsW[1]+lsW[3]/4,lsW[2]/2,lsW[3]/2];
	var ac= "&timer=10&=Close="+escape("javascript:window.close()");
	var features= "resizable=1,scrollbars=1,location=0,width="+lsP[2]+",height="+lsP[3]+",screenX="+lsP[0]+",screenY="+lsP[1];
	window.open("cqoutofl.htm?="+escape(msg)+ac,"About",features);
}

Cgi.prototype.lastItemLoaded= function(){
	var result= ""; 
	for (var i=0; i<this.aCgi.length; i++) {
		var aKV= this.aCgi[i].split("=");
		result+= aKV[0].link(unescape(aKV[1])) +" | ";
	}
	this.dw(result);
}
Cgi.prototype.additem= function(key,val){ 
	var len= parseInt(document.links[this.markerId].href.split(":")[2]);
	this.aCgi[this.aCgi.length]= key +"="+ escape(val);
	if (this.aCgi.length>len) {
		document.links[this.markerId].href= this.marker+this.aCgi.length;
	} else if (this.aCgi.length==len) {
		this.lastItemLoaded();
	}
}
//detect last data line
Cgi.prototype.doubleSource= function() {
	this.marker= "javascript:about:";
	this.markerId= document.links.length-1;
	var hasMarker= (this.markerId>0);
	hasMarker &= hasMarker= (document.links[this.markerId].href.substring(0,17)==this.marker);
	if (!hasMarker) {
		this.dw("".link(this.marker+"0"));
		this.markerId++;
	}
}
Cgi.prototype.padLocation= function() {
	var dls= location.search;
	if (!dls) return escape(location);
	return escape(location+"&.htm");
}
var dat=new Cgi("");
dat.doubleSource();
dat.additem("Home","javascript:home()");
dat.additem("Menu","menu.html");
//dat.additem("Save","cqoutofl.htm?=To%20save%20changes%20to%20CQ%20documents%2C%20just%20create%20a%20bookmark%20or%20drag%20icon%20into%20folder.&timer=10&=Back=javascript:history.back()");
//temp list
dat.additem("Temp Save","tempsave.htm?title="+escape(document.title)+"&url="+dat.padLocation());
dat.additem("cq Paste","javascript:cqPaste()");
dat.additem("Reload","javascript:location=fixPluses(''+location)");
dat.additem("Back","javascript:history.back()");
dat.additem("About","javascript:about()");
