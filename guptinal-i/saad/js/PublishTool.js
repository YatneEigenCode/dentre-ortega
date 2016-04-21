//4-20-2016 JChoy MyPageApp
//-----
function MyPageApp(){
	(function(t,c){t.c=c,t.c()})(this, AnyPageApp);
	this.onButtonClick= function(){
		if (this.value=="Go") this.form.helper.specialTest();
		if (this.value=="Publish") this.form.helper.publishApp();
		if (this.value=="Test") {
			new NotificationBob().i0.notifyPeer(this.value);
		} else new RedButton().start( this.value );
		this.form.helper.addEl("div", this.form).innerHTML=this.value;
	}
	this.publishApp= function(){
		var dt=new Date();
		var fldr= "publish"+(dt.getMonth()+1)+dt.toString().replace(/[^0-9]/g,'');
		var res= "cmd /c md {0}\\js |copy js\\* {0}\\js";
		res+= "|md {0}\\fsu |copy fsu\\* {0}\\fsu";
		res+= "|copy sandbox.hta {0}";
		res+= "|copy sandbox.html {0}";
		new FsoUtil_hta().runCmd( res.replace(/\{0\}/g,fldr) );
	}
	this.specialTest= function(){
		var plm= new PortalsLayout().getPortalsMgr();
		plm.addPortal( new QuikNote().start(plm.getAvailCell(), "qn2.txt" ) );
	}
}