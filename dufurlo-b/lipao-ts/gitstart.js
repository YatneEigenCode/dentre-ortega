//8-31-2017 jchoy test alternate source of behavior
CmdGitstart= function(){
  new AppTool().inherit( CmdAutoStart );
  this.start= function(ce){
    this.cfg= {sl:new StoLog('gitstart.log'), nc:'gitstart'};
    var st= this.cfg.sl.cfg.st, nc=this.cfg.nc, pl;
    if (!st.isOk) return;
    if (pl= st.lo.getItem(nc)) this.parse(ce, pl);
  }
}
new Sto().lo.setItem('gitstart','link . gitstart $date')
new CmdGitstart().start($ce); 