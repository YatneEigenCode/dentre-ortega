//12-18-2017 v0.113 successful test on windows
AniGifMaker=function(){
  this.start= function(){
    const ag = new Animated_GIF({repeat:null}), dim={w:320,h:240}
    ag.setSize(dim.w, dim.h);
    ag.setDelay(0.2);
    const apt= new LinkMaker(), ian = apt.addEl('img');
    apt.wrapCloser( ian, true, 'Animated GIF' );

    const cnv= document.createElement('canvas');
    cnv.width= dim.w; cnv.height= dim.h;
    const ctx= cnv.getContext('2d');
    ctx.fillStyle= 'yellow';
    for(var i = 0; i < 1501; i=i+10) {
      ctx.clearRect(0, 0, dim.w, dim.h);
      ctx.fillText(i, i $ dim.w, i % dim.h);
      const img= new Image();
      ian.src= img.src= cnv.toDataURL('image/jpeg');
      console.log( 'c', i, img.src.length );
      ag.addFrame(img);
    }
    ag.getBase64GIF(function(image){ ian.src = image; console.log(image.length) });
    return 'ok';
  }
}
