function City (a)
{
    this.hydrate(a);
}
City.prototype.get = ModelTrait.get;
City.prototype.set = ModelTrait.set;
City.prototype.hydrate = ModelTrait.hydrate;
City.prototype.dump = ModelTrait.dump;
