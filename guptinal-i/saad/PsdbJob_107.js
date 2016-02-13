//2-10-2016 JChoy PsdbJob_107.js v0.318 save maxNum to trak
//copies ts data into dropbox psdb folder
//TODO: fix bug that occurs after many loads

// if (this.counter.data.check % 2 == 0)  //120
//     this.runPsdbJob( "107" );

//-----
function PsdbJob_107(){
    this.trak= [[2300,2310,29]
               ,[2200,2299,20]
               ,[2000,2199,14]
               ,[1800,1999,10]
               ,[1500,1799,7]
               ,[1000,1499,5]
               ,[500,999,4]
               ,[1,499,3]];
    this.msf = new MSFeatures();
    if (PageAppCfg) new PageAppCfg().config(this);
    //this.path = "c:\\Users\\choy\\Dropbox\\Public\\jsondata\\psdb\\ape\\tssrc\\";
    this.arPath = "d:\\write\\ar\\awos\\";
    this.ajax= new Ajax();
    var pt= this;
    this.MaxNonZero= function(seed){
      this.maxNum= seed;
      this.pad= 5;
      this.check= function(num){
        return (num<(this.maxNum+this.pad));
      }
      this.set= function(num,byteCount){
        if (byteCount<=0) return;
        if (num>this.maxNum)  this.maxNum= num;
      }
    }
    this.ajax.write= function(s){ pt.writeFile(s) }
    this.lw = new LogWriter( this.psdbPath+"logs\\" );
    this.pw = new PsdbWriter( this.arPath );
    this.start= function(){
      if (document.psdbJob_107_trak) this.trak= document.psdbJob_107_trak;
      this.mnz= new this.MaxNonZero(this.trak[0][1]);
      var k=0,sum=-89;
      for (var i=0,at=this.trak; i<at.length-1; sum+= at[i++][2])
        if ((at[i][2]/at[i+1][2]) > 1.5) k=i+1;
      this.trak[k][2]++;
      this.lw.write(sum+" ar "+this.trak[k]+" "+new Date()+"\n");
      document.psdbJob_107_trak = this.trak;

      this.loopCount = 0;
      var tnl = this.numList = [];
      for (var i=this.trak[k][0]; i<=this.trak[k][1]; i++)
        this.numList.push(i);
   if (tnl.length>100) tnl.length=100;   // *****
      tnl.unshift(tnl[tnl.length-1]);
      this.goWebGet();
   }
   this.goWebGet= function(){ 
      if (this.numList.length <= 1) {
        this.trak[0][1]= this.mnz.maxNum+5;
        return this.lw.write(new Date()+" Finished numlist\n");
      }
      this.cNum = this.numList.pop();
      if (!this.cNum) return;
      if (!this.mnz.check(this.cNum))
        return this.goWebGet();
      this.fn = this.cNum+".txt";  //not needed
      this.url= this.tsUrl +"?f=text&i="+this.cNum;
      this.loopCount++;
      this.ajax.webGet( this.url );
    }
    this.writeFile= function(s){
      if (!pt.fn) return;
      if (s.length==15)
        pt.lw.write( this.url+"\n" );
      if ((pt.loopCount<=3) || (pt.numList.length<5))
        pt.lw.write( pt.loopCount+" writing "+s.length
          +" bytes to "+pt.cNum+"/"+pt.mnz.maxNum+"\n" );
      try {
        pt.pw.write( pt.cNum, s );
      } catch (e) {
        pt.lw.write( "FAILED "+s.length+" bytes to "+pt.cNum+"\n" );
      }
      pt.mnz.set( pt.cNum, s.length );
      pt.goWebGet();
    }
}
