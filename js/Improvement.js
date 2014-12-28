function Improvement (a)
{
    this.hydrate(a);
}
Improvement.prototype.get = ModelTrait.get;
Improvement.prototype.set = ModelTrait.set;
Improvement.prototype.hydrate = ModelTrait.hydrate;
Improvement.prototype.dump = ModelTrait.dump;