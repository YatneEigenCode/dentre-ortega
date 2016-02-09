//2-8-2016 JChoy PsdbJob_106.js 5 items on numList
//copies ts source code into dropbox tssrc folder
//-----
function PsdbJob_106(){
    this.msf = new MSFeatures();
    if (PageAppCfg) new PageAppCfg().config(this);
    this.path = "c:\\Users\\choy\\Dropbox\\Public\\jsondata\\psdb\\ape\\tssrc\\";
    this.ajax= new Ajax();
    var pt= this;
    this.ajax.write= function(s){ pt.writeFile(s) }
    this.numList= [2327,2326,2329,2331,2332];
    this.start= function(){
      if (this.numList.length <= 0) return;
      this.cNum = this.numList.pop();
      this.fn = this.cNum+".txt";
      var url= this.tsUrl +"?f=text&i="+this.cNum;
      this.ajax.webGet( url );
    }
    this.writeFile= function(s){
      if (!pt.fn) return;
      var fo = this.msf.fso.openTextFile( pt.path+pt.fn, 2, true );
      fo.write( s );
      fo.close();
      pt.start();
    }
}
