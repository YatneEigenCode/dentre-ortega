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
        this.addEl("div").style.marginBottom= "10";
        this.orders[i].displayOrder( this._ );
      }
    }
    this.isRecalcNeeded = false;
  }
  //---calculate fund distributions for all orders
  this.fundDistribution= function( isDisplay ){
    if (!this.orders) this.loadOrders();
    if (this.isRecalcNeeded) this.calcOrders( false );
    if (isDisplay) this.write( "FEE DISTRIBUTIONS: " );
    for (var i=0; i<this.orders.length; i++) {
      this.orders[i].distributeFunds( this.feeTaps );
      if (isDisplay) {
        this.addEl("div").style.marginBottom= "10";
        this.orders[i].displayFunds( this._ );
      }
    }
    if (!isDisplay) return;
    this.write( "Total distributions:" );
    var fundsTotal= new FeeTap().totalFunds( this.orders );
    for (var m in fundsTotal)
      this.writeAmt( "&nbsp;&nbsp;Fund - "+m+": ", fundsTotal[m] );
  }
  new IOBase().inherit( this, IOBase );
  this.inherit( this, IOData );
}

FeeTap= function(data){
  this.data= data;
  this.nameOther = "Other";
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
  //---distribute funds for one item into sums for the order
  this.distributeFunds= function( item, orderFunds ){
    for (var i=0,at=this.data.distributions; i<at.length; i++) {
      var amount= parseFloat(at[i].amount);
      if (amount > orderFunds[this.nameOther])
        amount= orderFunds[this.nameOther];
      this.addToFund( orderFunds, at[i].name,  amount );
      this.addToFund( orderFunds, this.nameOther, -amount );
    }
  }
  //---add to running sum of a fund by name
  this.addToFund= function( funds, name, amount ){
      if (!funds[name]) funds[name] = 0;
      funds[name] += amount;
  }
  //---merge sums of each order into cumulative sums
  this.totalFunds= function( orders ){
    var fundsTotal = {};
    for (var i=0; i<orders.length; i++)
      for (var m in orders[i].distFunds)
        this.addToFund( fundsTotal, m, orders[i].distFunds[m] );
    return fundsTotal;
  }
}

Order= function(data){
  this.data= data;
  this.distFunds= {};
  this.number= this.data.order_number;
  this.items= this.data.order_items;
  this.sp2= "&nbsp;&nbsp;";

  //---calculate fees for each item in this order
  this.calcFees= function( feeTaps ){
    this.pricedItems= [];
    for (var i=0; i<this.items.length; i++)
      this.priceItem( this.items[i], feeTaps );
  }
  //---calculate the fee for one item
  this.priceItem= function( item, feeTaps ){
    for (var i=0; i<feeTaps.length; i++) 
      if (feeTaps[i].isType(item.type))
        this.pricedItems.push( {
          type: item.type,
          amount: feeTaps[i].calcPrice(item) } );
  }
  //---get the total of calculated fees in this order
  this.getTotal= function(){
    var total= 0;
    for (var i=0; i<this.pricedItems.length; i++) 
      total += this.pricedItems[i].amount;
    return total;
  }
  //---distribute fees for each item in this order
  this.distributeFunds= function( feeTaps ){
    this.distFunds = {"Other": this.getTotal()};
    for (var i=0; i<this.pricedItems.length; i++)
      this.distItem( this.pricedItems[i], feeTaps );
  }
  //---distribute fees for one item
  this.distItem= function( item, feeTaps ){
    for (var i=0; i<feeTaps.length; i++) 
      if (feeTaps[i].isType(item.type))
        feeTaps[i].distributeFunds( item, this.distFunds )
  }
  new IOBase().inherit( this, IOBase );
  this.inherit( this, OrderDisplay );
}

//---IO methods that are data specific
OrderDisplay= function(){
  this.displayOrder= function( div ){
    this.write( "Order Number: "+this.number, div );
    for (var i=0,at=this.pricedItems; i<at.length; i++)
      this.writeAmt( this.sp2+"Order item "+at[i].type+": ", at[i].amount, div );
    this.writeAmt( this.sp2+"Order total: ", this.getTotal(), div );
  }
  this.displayFunds= function( div ){
    if (!this.distFunds) return this.write( "need calc", div );
    this.write( "Order ID: "+this.number, div );
    for (var m in this.distFunds)
      if (m != "Other")
        this.writeAmt( this.sp2+"Fund - "+m+": ", this.distFunds[m], div );
    this.writeAmt( this.sp2+"Fund - Other: ", this.distFunds["Other"], div );
  }
}

//---data loading interface
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
    this.isRecalcNeeded = true;
    var at= JSON.parse( document.getElementById("orders").value );
    for (var i=0; i<at.length; i++)
      this.orders.push( new Order(at[i]) );
  }
}

//---utility methods that are not data specific
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
