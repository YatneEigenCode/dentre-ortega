//2-9-2016 JChoy PsdbJob_107.js dev
//copies ts data into dropbox psdb folder
//-----
function PsdbJob_107(){
    this.trak= [[2300,2350,3]
               ,[2200,2299,2]
               ,[2000,2199,2]
               ,[1800,1999,2]
               ,[1500,1799,2]
               ,[1000,1499,2]
               ,[500,999,2]
               ,[1,499,2]];
    this.msf = new MSFeatures();
    if (PageAppCfg) new PageAppCfg().config(this);
    //this.path = "c:\\Users\\choy\\Dropbox\\Public\\jsondata\\psdb\\ape\\tssrc\\";
    //this.path = "d:\\16data\\archiveRip\\psdb\\ar\\";
    this.ajax= new Ajax();
    var pt= this;
    this.ajax.write= function(s){ pt.writeFile(s) }
    this.lw = new LogWriter( this.psdbPath+"logs\\" );
    this.pw = new PsdbWriter( this.psdbPath+"psdb\\" );
    this.start= function(){
      if (document.psdbJob_107_trak) this.trak= document.psdbJob_107_trak;
      var k=0,sum=-12;
      for (var i=0,at=this.trak; i<at.length-1; sum+= at[i++][2])
        if ((at[i][2]/at[i+1][2]) > 1.5) k=i+1;
      this.trak[k][2]++;
      this.lw.write(sum+" xar "+this.trak[k]+"\n");
      document.psdbJob_107_trak = this.trak;

      this.numList= [];
      for (var i=this.trak[k][0]; i<=this.trak[k][1]; i++)
        this.numList.push(i);
   this.numList.length=3;
      if (this.numList.length <= 0) return;
      this.cNum = this.numList.pop();
      this.fn = this.cNum+".txt";
      var url= this.tsUrl +"?f=text&i="+this.cNum;
      this.ajax.webGet( url );
    }
    this.writeFile= function(s){
      if (!pt.fn) return;
      var fo = pt.pw.write( pt.fn, s );
      pt.lw.write( "wrote to "+pt.fn+"\n" );
      pt.start();
    }
}
