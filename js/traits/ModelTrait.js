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
    this.attr = this.attr||{};
    for(var k in a) this.attr[k] = a[k];
  },
  dump:function(){
    return this.attr;
  }

};
