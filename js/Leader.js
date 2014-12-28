function Leader (a)
{
    this.hydrate(a);
}
Leader.prototype.get = ModelTrait.get;
Leader.prototype.set = ModelTrait.set;
Leader.prototype.hydrate = ModelTrait.hydrate;
Leader.prototype.dump = ModelTrait.dump;
