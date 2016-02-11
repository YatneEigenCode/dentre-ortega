//2-10-2016 JChoy PsdbJob_107.js v0.152 catch when failed writing non-ascii
//copies ts data into dropbox psdb folder

// if (this.counter.data.check % 2 == 0)  //120
//     this.runPsdbJob( "107" );

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
    this.arPath = "d:\\write\\ar\\awos\\";
    this.ajax= new Ajax();
    var pt= this;
    this.ajax.write= function(s){ pt.writeFile(s) }
    this.lw = new LogWriter( this.psdbPath+"logs\\" );
    this.pw = new PsdbWriter( this.arPath );
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
 if (this.numList.length>120) this.numList.length=120;   // *****
      this.goWebGet();
   }
   this.goWebGet= function(){ 
      if (this.numList.length <= 0) return;
      this.cNum = this.numList.pop();
      if (!this.cNum) return;
      this.fn = this.cNum+".txt";  //not needed
      var url= this.tsUrl +"?f=text&i="+this.cNum;
      this.ajax.webGet( url );
    }
    this.writeFile= function(s){
      if (!pt.fn) return;
      pt.lw.write( "writing "+s.length+" bytes to "+pt.cNum+"\n" );
      try {
        pt.pw.write( pt.cNum, s );
      } catch (e) {
        pt.lw.write( "FAILED "+s.length+" bytes to "+pt.cNum+"\n" );
      }
      pt.goWebGet();
    }
}
