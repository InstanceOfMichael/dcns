function Unit (a)
{
    this.hydrate(a);
}
Unit.prototype.get = ModelTrait.get;
Unit.prototype.set = ModelTrait.set;
Unit.prototype.hydrate = ModelTrait.hydrate;
Unit.prototype.dump = ModelTrait.dump;
