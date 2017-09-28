//2-26-08 JKC works with cqtabulofl
//2-26-08 JKC getFullYear; row and cell specific; use header cfg
//2-28-08 JKC v0.53 quickLink, search, movie, baseAddon
//2-28-08 JKC v0.54 mozilla -innerText
//3-2-08  JKC v0.56 nextAddon
//3-21-08 JKC v0.57 moved baseAddon to addon1.js
//3-24-08 JKC v0.58 {1}
//todo: work in subtables
function QuickLink(cfg0){
	baseAddon.mold( this, baseAddon );
	this.mold( this.cfg={}, (cfg0)? cfg0 : baseAddon.cfg );
	this.setLinkText= function( el, s ){
		var at= "innerHTML,innerText".split(",");
		for (var i=0; i<at.length; i++)
			if (typeof(el[at[i]]) != "undefined") el[at[i]] = s; 
	}
	this.addItemToCell = function( cell, row, col ){
		var el = this.createEl( "a", "rcNum", [row,col] );
		var c0 = this.getValueFromCgi( row, 0, "na" );
		var c1 = this.getValueFromCgi( row, 1, "na" );
		this.setLinkText( el, this.cfg.key+" - "+ c0 );
		var urltpl = this.cfg.urltemplate;
		if (!urltpl) {
			if (row<this.startRow) { return cell.innerHTML= "";}
			urltpl = this.getValueFromCgi( 1, col, "http://www.google.com/search?q={0}" );
		}
		el.href= (urltpl+"").replace(/\{0\}/g, c0 ).replace(/\{1\}/g, c1 );
		cell.appendChild( el );
	}
}
search = new QuickLink( {key : ":search"} );
movie = new QuickLink( {key : ":movie"
	, urltemplate : "http://movies.yahoo.com/mv/search?p={0}"
} );
//http://www.amazon.com/s/?url=search-alias%3Daps&field-keywords={0}
//http://search.about.com/fullsearch.htm?terms={0}
//http://www.ask.com/web?qsrc=0&o=0&l=dir&q={0}

search.init();
movie.init();
search.nextAddon();
