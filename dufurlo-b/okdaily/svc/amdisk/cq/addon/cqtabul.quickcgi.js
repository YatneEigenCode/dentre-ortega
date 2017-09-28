({
	start : function(){
		this.myCookie();
		var at = this.atc = (location.search+"").split("&")[0].split(",");
		if (at[0] != "?waffle") return;
		var res = "?row0=O^^wa:waffle^^r:search";
		for (var i=1; i<at.length; i++){
			res += "&row"+i+"="+at[i]+"^^" +this.doRange(at[i]);
			if (i==1) res+="^^%3Fwaffle,{0}";
		}
		if (at.length==1) res+= "&row1=max^^%20^^%3Fwaffle,{0}";
		else res+= "&row" +at.length +"=max^^%20";		//6-24-08 JChoy
		res+= "&row" +(at.length+1) +this.doNext("f");
		res+= "&row" +(at.length+2) +this.doNext("b");
		res+= "&row" +(at.length+3) +this.doNext("bb");
		res+= "&row" +(at.length+4) +this.doNext("c");
		location = res;
	}
	, doRange : function( ati ){
		var at= (ati+"").split("-");
		this.doNext( at[0] );
		if (at.length>1)
			for (var i=at[0]; i<=at[1]; i++)
				this.atc[this.atc.length] = i;
		return ati;
	}
	, doNext : function( num ){
		if (!isNaN(num)) this.myCookie(num);
		if (!isNaN(num)) return this.lastNum = num;
		return (this.lastNum) ? this.getRange(num) : "=";	//f,b...
	}
	, getRange : function( num ){
		var ptl = parseInt(this.lastNum);
		var ranges= {f:[0,9], b:[-10,-1], bb:[-20,-11]};
		if (num=="c") return "=" +this.getCookie("tsnum") +"^^cookie^^";
		var rg = (ranges[num]) ? ranges[num] : ranges["f"];
		return "="+ (ptl+rg[0]) +"-" +(ptl+rg[1]) +"^^^^";
	}
	, myCookie : function( num ){
		var c= this.getCookie("tsnum");
		var max = (c)? parseInt(c) : 0;
		if (!num) {
			if (c) this.lastNum = c;
		} else
			if (parseInt(num)>max) this.setCookie( "tsnum", num );
	}
	, setCookie : function( n, v ){
		document.cookie= n +"=" +v +"; expires=Sat, 31 Dec 2099 12:00:00 UTC" 
	}
	, getCookie : function( s ){
		var at = document.cookie.split(';');
		for (var i=0; i<at.length; i++){
			var ap = at[i].split('=');
			if ((ap[0]==s) || (ap[0]==' '+s))
				return ap[1];
		}
		return "";
	}
}).start();


