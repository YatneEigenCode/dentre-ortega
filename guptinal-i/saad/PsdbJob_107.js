//2-10-2016 JChoy PsdbJob_107.js v0.154 reduce logging
//copies ts data into dropbox psdb folder
//TODO: fix bug that occurs after many loads

// if (this.counter.data.check % 2 == 0)  //120
//     this.runPsdbJob( "107" );

//-----
function PsdbJob_107(){
    this.trak= [[2300,2350,61]
               ,[2200,2299,27]
               ,[2000,2199,18]
               ,[1800,1999,12]
               ,[1500,1799,8]
               ,[1000,1499,5]
               ,[500,999,3]
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

      this.numList= [this.trak[k][1]];
      for (var i=this.trak[k][0]; i<=this.trak[k][1]; i++)
        this.numList.push(i);
 if (this.numList.length>120) this.numList.length=120;   // *****
      this.goWebGet();
   }
   this.goWebGet= function(){ 
      if (this.numList.length <= 1) return;
      this.cNum = this.numList.pop();
      if (!this.cNum) return;
      this.fn = this.cNum+".txt";  //not needed
      this.url= this.tsUrl +"?f=text&i="+this.cNum;
      this.ajax.webGet( this.url );
    }
    this.writeFile= function(s){
      if (!pt.fn) return;
      if (s.length==15)
        pt.lw.write( this.url );
      if ((pt.cNum==pt.numList[0]) || (pt.numList.length<5))
        pt.lw.write( "writing "+s.length+" bytes to "+pt.cNum+"\n" );
      try {
        pt.pw.write( pt.cNum, s );
      } catch (e) {
        pt.lw.write( "FAILED "+s.length+" bytes to "+pt.cNum+"\n" );
      }
      pt.goWebGet();
    }
}
