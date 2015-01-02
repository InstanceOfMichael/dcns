var ModelTrait = {
  get:function (key,def)
  {
    if (typeof this.attr[key] == 'undefined') return def;
    return this.attr[key];
  },
  set:function (key,value)
  {
    this.attr[key] = value;
    return this;
  },
  hydrate:function(a){
    this.attr = assoc_merge(this.attr,a);
  },
  dump:function(){
    return assoc_merge({},this.attr);
  }

};
