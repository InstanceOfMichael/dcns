function Unit (a)
{
    this.hydrate(a);
    this.set('m',2);
}
Unit.prototype.get = ModelTrait.get;
Unit.prototype.set = ModelTrait.set;
Unit.prototype.hydrate = ModelTrait.hydrate;
Unit.prototype.dump = ModelTrait.dump;
Unit.prototype.isLand  = function(){ return this.get('d','l')=='l'; };
Unit.prototype.isSea   = function(){ return this.get('d','l')=='w'; };
Unit.prototype.isAir   = function(){ return this.get('d','l')=='a'; };
Unit.prototype.isSpace = function(){ return this.get('d','l')=='s'; };
Unit.prototype.getToolTipName = function(){ return 'unit_name'; };
Unit.prototype.getSelectInfoBoxText = function(){
  return "Unit "+this.get('m',0)+" moves left.";
}
Unit.prototype.drawMovableTileLines = function(c,r,p,tile)//canvas, r, p
{
  var coord = r.coord;// map coord
  console.info([c,r,p,coord]);
  
  var movetoable = [];
  
  var fn = function(/*unit*/ unit,
             /*origin tile*/ oTile,
   /*tile in consideration*/ cTile,
           /*this function*/ fn,
   /*move points remaining*/ mpr
   ){
    console.log([unit,oTile,fn,mpr]);
    var nts = tile.allNeighbors();
    
    for(var x = 0;x < nts.length; x++)
    {
      if (mpr)
      {
        fn(unit,oTile,nts[x],fn,mpr-1);
      }
    }
  
  }
  
  fn(this,tile,null,fn,this.get('m',0));
  
}
/*
var example.attr = {
  b:[] //badge id list
  m:  // movement points remaining
  d:"land"//  domain// can be "l":land,"w":water,"a":air,"s":space
  a:// alt:0 // altitude relative to sealevel/surfacelevel // used to determine submerged property of submarine and height of aircrafts
  x:0 // experience
  i:[] // items
  f:"flag_id"
  o:"owner_id"
  p:"player_id"
  h:100 // health
  t:"tile_id"
}
 */