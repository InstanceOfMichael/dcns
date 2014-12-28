function Building (a)
{
    this.hydrate(a);
}
Building.prototype.get= ModelTrait.get;
Building.prototype.set= ModelTrait.set;
Building.prototype.hydrate= ModelTrait.hydrate;
Building.prototype.dump= ModelTrait.dump;
