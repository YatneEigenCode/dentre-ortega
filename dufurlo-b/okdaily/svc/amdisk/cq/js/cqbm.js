//mailmerg.htm JChoy 1/9/00
//uses CQ (Client Side Cgi Query Processing) technology
//4-12-00  JChoy  v0.52 http/edit
//4-16-00  JChoy  v0.53 no alert
//5-09-00  JChoy  v0.54 object, default noEdit
//9-25-00  JChoy  v0.56 multiline
//12-8-00  JChoy  v0.57 ie compatibility for noCR
//5-15-01  JChoy  v0.58 strip oksumbit (was needed for multiline)
//11-17-01 JChoy  v1.21 focus
//3-5-02  JChoy  v1.23 changed stripPlus to preserver real pluses
function dw(s){ document.write(s) }
//----------
//object container to hold common variables
function FieldControl() {
	this.inputsize= 50
	this.fieldNames= new Array()
	this.displayType= 'data'	//data,link,both
	this.editText= '<FONT SIZE=-1><I>(click here to make changes)</I></FONT>'
	this.editBothText= '<FONT SIZE=-1>edit</FONT>'
}
//----------
//finish the job for unescape()
String.prototype.myReplace= function(old,nu){return this.split(old).join(nu);}
//----------
//Convert http links to dataEdit links 
//This is deprecated--prefer to use displayType='link' or 'edit'
function convert2Edit(){
	for (var i=0; i<fieldControl.fieldNames.length; i++){
		document.links[i].href=cgi.locationBare + '?showform='+fieldControl.fieldNames[i] +'&'+cgi.locationCgi 
	}
	//alert( 'Click on any link to EDIT it.' )
}
//----------
//create a named cq field
function field(s) {
	var sOut = cgi.value(s)
	fieldControl.fieldNames[fieldControl.fieldNames.length]=s
	if (sOut=='') {
		//empty field
		dw( '<A HREF='+ cgi.locationBare + '?showform='+s +'&'+cgi.locationCgi +'>' )
		dw( fieldControl.editText +'</A>' )
	} else if (fieldControl.displayType=='link'){
		dw( '<A HREF='+sOut+'>' )
		dw( sOut +'</A>' )
	} else if (fieldControl.displayType=='data'){
		dw( '<A HREF='+cgi.locationBare + '?showform='+s +'&'+cgi.locationCgi )
		dw( '>' +sOut +'</A>' )
	} else if (fieldControl.displayType=='both'){
		dw( '<A HREF='+sOut+'>' )
		dw( sOut +'</A>' )
		dw( ' <A HREF='+cgi.locationBare + '?showform='+s +'&'+cgi.locationCgi )
		dw( '>'+fieldControl.editBothText+'</A>' )
	}
}

//----------
function showForm(){
  var editField = cgi.value('showform') 
  var arrayFields= cgi.arrayCgi
  if (editField != '') {
	dw( '<FORM NAME=cqbm ONSUBMIT=return(this.okSubmit.value=="OK")>' )
	var fieldValue= ''+ cgi.value(editField);
	fieldValue= fieldValue.myReplace('"','\'') 
	if (editField.charAt(0)=='_') {
	  dw( '<BR>' +editField +': <BR><TEXTAREA NAME="'+ editField )
	  dw( '" COLS=' +fieldControl.inputsize )
	  dw( ' WRAP=virtual ROWS=6>' +fieldValue +'</TEXTAREA>' )
	} else {
	  dw( '<BR>' +editField +': <INPUT NAME="'+ editField )
	  dw( '" SIZE=' +fieldControl.inputsize +' VALUE="' )
	  dw( fieldValue +'">' )
	}

	for (var i=0; i<arrayFields.length; i++) {
	  var aPair= unescape(arrayFields[i]).split('=')
	  if (aPair[0]=='showform') {
	  } else if (aPair[0]=='undefined') {
	  } else if (aPair[0]=='okSubmit') {
	  } else if (aPair[0]==editField) {
	  } else {
	    dw( '<INPUT TYPE=hidden NAME="'+ aPair[0] +'" VALUE="' )
	    dw( cgi.value(aPair[0]).myReplace('"','\'') +'">' )
	  }
	}
	dw( '<INPUT TYPE=hidden NAME=okSubmit>' )
	dw( '<BR><INPUT TYPE=button VALUE=Submit ONCLICK="this.form.okSubmit.value=\'OK\';this.form.submit()">' )
	dw( ' <INPUT TYPE=reset >' )
	dw( '</FORM><HR>' )
	onload= function(){ document.cqbm.elements[0].focus() }
  }
}
//-----
//create a page that can be saved to disk
//this is deprecated, use tellafriend.js instead (save to email)
function dosave(){
	w=window.open(cgi.locationBare,"")
	var sout = '';
	sout+= '<TITLE>Save CQ Document</TITLE>'
	sout+= '<A HREF="'+document.location +'">View/Edit '
	sout+= document.title +'</A><BR>'
	sout+= 'Click File-Save to save this document to hard disk.<BR>'
	w.document.writeln( sout )
	w.document.close()
	w.document.writeln( sout )
	w.document.close()
}
var fieldControl= new FieldControl()
if (cgi.locationCgi.indexOf("+")>=0)
 for (var i=0; i<cgi.arrayCgi.length; i++) {
	cgi.arrayCgi[i]= cgi.arrayCgi[i].myReplace("+","%20");
 }
showForm()
