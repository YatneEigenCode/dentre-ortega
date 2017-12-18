AniGifMaker=function(){
  this.start= function(){
    const ag = new Animated_GIF({repeat:null}), dim={w:320,h:240}
    ag.setSize(dim.w, dim.h);
    const apt= new LinkMaker(), ian = apt.addEl('img');
    apt.wrapCloser( ian, true, 'Animated GIF' );

    const cnv= document.createElement('canvas');
    cnv.width= dim.w; cnv.height= dim.h;
    const ctx= cnv.getContext('2d');
    ctx.fillStyle= 'blue';
    for(var i = 0; i < 21; i++) {
      ctx.fillText('Number '+i, dim.w/2, dim.h/2);
      //ctx.fillRect(0, 0, dim.w-i*5, dim.h-i*5);
      const img= new Image();
      ian.src= img.src= cnv.toDataURL('image/jpeg');
      console.log( 'c', i, img.src.length );
      ag.addFrame(img);
    }
    ag.getBase64GIF(function(image){ ian.src = image; console.log(image.length) });
    return 'ok';
  }
}
