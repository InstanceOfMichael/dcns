function Selection (a,model)
{
  this.model = model;
  this.hydrate(a);
}
Selection.prototype.get = ModelTrait.get;
Selection.prototype.set = ModelTrait.set;
Selection.prototype.hydrate = ModelTrait.hydrate;
Selection.prototype.dump = ModelTrait.dump;
