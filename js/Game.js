function Game (a)
{
    this.hydrate(a);
}
Game.prototype.get = ModelTrait.get;
Game.prototype.set = ModelTrait.set;
Game.prototype.hydrate = ModelTrait.hydrate;
Game.prototype.dump = ModelTrait.dump;
Game.prototype.draw = function(p){ //params
    this.map.draw(p);
};
