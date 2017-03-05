//3–5-17 jchoy
OrderFees= function(){
  this.start= function(){
    this.calcOrders( true );
    this.fundDistribution( true );
  }
  //---calculate totals for all orders
  this.calcOrders= function( isDisplay ){
    if (!this.orders) this.loadOrders();
    if (isDisplay) this.write( "ORDER TOTALS: " );
    for (var i=0; i<this.orders.length; i++) {
      this.orders[i].calcFees( this.feeTaps );
      if (isDisplay) {
        this.orders[i].displayOrder( this.addEl("div") );
        this._.style.marginBottom= "10";
      }
    }
    this.isDoneOrdersCalc= true;
  }
  //---calculate fund distributions for all orders
  this.fundDistribution= function( isDisplay ){
    if (!this.orders) this.loadOrders();
    if (!this.isDoneOrdersCalc) this.calcOrders( false );
    this.write( "FEE DISTRIBUTIONS: " );
    for (var i=0; i<this.orders.length; i++) {
      this.orders[i].distributeFunds( this.feeTaps );
      if (isDisplay) {
        this.orders[i].displayFunds( this.addEl("div") );
        this._.style.marginBottom= "10";
      }
    }
  }
  new IOBase().inherit( this, IOBase );
  this.inherit( this, IOData );
}

FeeTap= function(data){
  this.data= data;
  this.isType= function(itemType){
    return (this.data.order_item_type==itemType);
  }
  //---calculate the combined price of an item
  this.calcPrice= function(orderItem){
    var price= 0;
    for (var i=0,at= this.data.fees; i<at.length; i++) {
      var amount= parseFloat(at[i].amount);
      if (at[i].type=="flat") price += amount;
      if (at[i].type=="per-page") 
        price += this.calcPerPagePrice( orderItem, amount );
    }
    return price;
  }
  //---calculate the per-page portion of the price
  this.calcPerPagePrice= function(orderItem, rate){
    var pages= parseInt(orderItem.pages);
    var price = rate * (pages-1);
    return (price>0)? price : 0;
  }
  this.distributeFunds= function( item, orderFunds ){
    for (var i=0,at=this.data.distributions; i<at.length; i++) {
      var amount= parseFloat(at[i].amount);
      if (amount > orderFunds["Other"])
        amount= orderFunds["Other"];
      this.addToFund( orderFunds, at[i].name,  amount );
      this.addToFund( orderFunds, "Other", -amount );
    }
  }
  this.addToFund= function( funds, name, amount ){
      if (!funds[name]) funds[name] = 0;
      funds[name] += amount;
  }
}

Order= function(data){
  this.data= data;
  this.number= this.data.order_number;
  this.items= this.data.order_items;
  this.calcFees= function( feeTaps ){
    this.pricedItems= [];
    for (var i=0; i<this.items.length; i++)
      this.priceItem( this.items[i], feeTaps );
  }
  this.priceItem= function( item, feeTaps ){
    for (var i=0; i<feeTaps.length; i++) 
      if (feeTaps[i].isType(item.type))
        this.pricedItems.push( {
          type: item.type,
          amount: feeTaps[i].calcPrice(item) } );
  }
  this.getTotal= function(){
    var total= 0;
    for (var i=0; i<this.pricedItems.length; i++) 
      total += this.pricedItems[i].amount;
    return total;
  }
  this.displayOrder= function( div ){
    var indent= "&nbsp;&nbsp;";
    this.write( "Order Number: "+this.number, div );
    for (var i=0,at=this.pricedItems; i<at.length; i++)
      this.writeAmt( indent+"Order item "+at[i].type+": ", at[i].amount, div );
    this.writeAmt( indent+"Order total: ", this.getTotal(), div );
  }
  this.distributeFunds= function( feeTaps ){
    this.distFunds = {"Other": this.getTotal()};
    for (var i=0; i<this.pricedItems.length; i++)
      this.distItem( this.pricedItems[i], feeTaps );
  }
  this.distItem= function( item, feeTaps ){
    for (var i=0; i<feeTaps.length; i++) 
      if (feeTaps[i].isType(item.type))
        feeTaps[i].distributeFunds( item, this.distFunds )
  }
  this.displayFunds= function( div ){
    if (!this.distFunds) return this.write( "need calc" );
    for (var m in this.distFunds)
      this.writeAmt( "Fund "+m+": ", this.distFunds[m] );
  }
  new IOBase().inherit( this, IOBase );
}

IOData= function(){
  this.loadFees= function(){
    this.feeTaps= [];
    var at= JSON.parse( document.getElementById("fees").value );
    for (var i=0; i<at.length; i++)
      this.feeTaps.push( new FeeTap(at[i]) );
  }
  this.loadOrders= function(){
    if (!this.feeTaps) this.loadFees();
    this.orders= [];
    var at= JSON.parse( document.getElementById("orders").value );
    for (var i=0; i<at.length; i++)
      this.orders.push( new Order(at[i]) );
  }
}

IOBase= function(){
  this._;
  this.writeAmt= function(s, amt, el){
    this.write( s + " $"+ (amt).toFixed(2), el );
  }
  this.write= function(s, el){
    this.addEl("div",el).innerHTML= s;
  }
  this.addEl= function(tag, parent){ 
    var par= (parent)? parent : document.body;
    return this._=par.appendChild( document.createElement(tag) );
  }
  this.inherit= function( inst, cls ){
    inst.constructor= cls;
    inst.constructor();
  }
}
