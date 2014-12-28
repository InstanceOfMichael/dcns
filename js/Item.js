function Item (a)
{
    this.hydrate(a);
}
Item.prototype.get = ModelTrait.get;
Item.prototype.set = ModelTrait.set;
Item.prototype.hydrate = ModelTrait.hydrate;
Item.prototype.dump = ModelTrait.dump;
