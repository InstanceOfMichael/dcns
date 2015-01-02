function Unit (a)
{
    this.hydrate(a);
}
Unit.prototype.get = ModelTrait.get;
Unit.prototype.set = ModelTrait.set;
Unit.prototype.hydrate = ModelTrait.hydrate;
Unit.prototype.dump = ModelTrait.dump;
Unit.prototype.isLand  = function(){ return this.get('d','l')=='l'; };
Unit.prototype.isSea   = function(){ return this.get('d','l')=='w'; };
Unit.prototype.isAit   = function(){ return this.get('d','l')=='a'; };
Unit.prototype.isSpace = function(){ return this.get('d','l')=='s'; };
Unit.prototype.getToolTipName = function(){ return 'unit_name'; };
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