function Selection (a,model)
{
  if (typeof a == 'string') a = {index:a};
  this.model = model;
  this.hydrate(a);
}
Selection.prototype.get = ModelTrait.get;
Selection.prototype.set = ModelTrait.set;
Selection.prototype.hydrate = ModelTrait.hydrate;
Selection.prototype.dump = ModelTrait.dump;
Selection.prototype.unselect = function(){
  this.model.selected = null;
};
/*
var example.attr = {
  index:"" // map index e.g. "tiles","units"
};
*/