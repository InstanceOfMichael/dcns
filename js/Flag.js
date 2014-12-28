function Flag (a)
{
    this.hydrate(a);
}
Flag.prototype.get = ModelTrait.get;
Flag.prototype.set = ModelTrait.set;
Flag.prototype.hydrate = ModelTrait.hydrate;
Flag.prototype.dump = ModelTrait.dump;
