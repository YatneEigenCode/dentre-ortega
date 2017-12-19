//12-18-2017 v0.121 older browsers error on let
TbcShare=function(){
  this.start= function(at){
    if (at[1]=='/cfg') return this.updateCfg(at);
    for (var i=1;i<at.length; i++) this.exec(at[i])
    return (at.length>1)?'ok':'missing param'
  }
  this.exec= function(ci){
    var fr, apt= new LinkMaker();
    (fr=apt.addEl('iframe')).src= config_TbcShare['url']+ci;
    apt.wrapCloser(fr,true,ci);
  }
  this.updateCfg= function(at){
    if (at.length<4) return 'missing params';
    return [this.updateConfig( at[2], at[3] ),'ok-config'][1]
  }
  this.updateConfig= function(k,v){ config_TbcShare[k]=v; }
}
config_TbcShare={ 'url':'http://localhost:3000/v/' }
