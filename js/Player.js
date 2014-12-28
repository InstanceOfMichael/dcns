function Player (a)
{
    this.hydrate(a);
}
Player.prototype.get = ModelTrait.get;
Player.prototype.set = ModelTrait.set;
Player.prototype.hydrate = ModelTrait.hydrate;
Player.prototype.dump = ModelTrait.dump;
