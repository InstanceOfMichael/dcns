function Game (a)
{
    this.hydrate(a);
}
Game.prototype.get = ModelTrait.get;
Game.prototype.set = ModelTrait.set;
Game.prototype.hydrate = function(a){
  ModelTrait.hydrate.call(this,a);
  if (typeof this.attr.map != 'undefined')
  {
    this.map = new Map(this.attr.map);
    delete this.attr.map;
  }
  
  return this;
};
Game.prototype.dump = function(){
  var a = ModelTrait.dump.call(this);
  a.map = this.map.dump();
  
  return a;
};
Game.prototype.draw = function(p){ //params
    this.map.draw(p);
};
