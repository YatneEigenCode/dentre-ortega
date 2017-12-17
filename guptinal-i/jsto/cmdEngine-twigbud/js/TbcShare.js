//12-17-2017 CETB addon
TbcShare=function(){
  this.start= function(at){
    if (at[1]=='/cfg') return this.updateCfg(at);
    for (var i=1;i<at.length; i++) this.exec(at[i])
    return (at.length>1)?'ok':'missing param'
  }
  this.exec= function(ci){
    let fr, apt= new LinkMaker();
    (fr=apt.addEl('iframe')).src= config_TbcShare['url']+ci;
    apt.wrapCloser(fr,true,ci);
  }
  this.updateCfg= function(at){
    if (at.length>=4) this.updateConfig( at[2], at[3] );
  }
  this.updateConfig= function(k,v){ config_TbcShare[k]=v; }
}
config_TbcShare={ 'url':'http://localhost:3000/v/' }
