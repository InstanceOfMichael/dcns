function RandomMap(io) // x, y, percent land, land seeds
{
  // lets get some configs and variables
  var o = {
    land_ratio: 0.7,
    land_seeds: 8,
    width: 32,
    height: 24,
    tile_size:24
  };
  for(var k in io)
  {
    o[k] = (typeof io[k] !== 'function') ? io[k] : io[k](o,k,io);
  }
  this.attr = o;
  
  var land_seeds = []; land_seeds.length = this.get('land_seeds',1) || 1;
  
  this.tiles_hash = {};
  this.tiles_xy = {};
  
  //  generate locations for the first continent seeds.
  for(var x = 0; x < land_seeds.length; x++)
  {
    var is_unique;
    do{
      land_seeds[x] = XY(mt_rand(0,this.get('width')-1),mt_rand(0,this.get('height')-1));
      is_unique = !land_seeds.slice(0,x).filter(function(e){ return e.toJson()==land_seeds[x].toJson(); }).length;
    }
    while(!is_unique);
     
    this.tiles_xy[land_seeds[x].toJson()] = new Tile({
      id:make_id(this.tiles_hash),
      t:['mountain']
    });
  }
  
  var ls_debug = land_seeds.map(function(e){ return e.toJson(); });

  // fill in ocean/mountain/grassland/desert until water:land ratio is satisfied
  var ratio=0,land_tiles_count,land_tile_probability;
  do
  {
    if (ratio > this.get('land_ratio'))
    {
      land_tile_probability = ((ratio - this.get('land_ratio'))/ratio)*100;
    }
    else
    {
      land_tile_probability = ((this.get('land_ratio')-ratio)/this.get('land_ratio'))*100;
    }
    
    for(var k in this.tiles_xy)
    {
      var ct = this.tiles_xy[k];
      var coord = new Coordinate(k);
      for(var y = 0; y < dir.length; y++)
      {
        var xy_index = coord[dir[y]]().wrapX(this);
        if (typeof this.tiles_xy[xy_index.toJson()] != 'undefined') continue;
        if (!xy_index.isInGrid(this)) continue;
        
        // make the random simple tile
        // there will be another randomization "pass" later.
        this.tiles_xy[xy_index.toJson()] = MakeRandomSimpleTile(this,ct,xy_index,land_tile_probability);
        if (!this.tiles_xy[xy_index.toJson()]) console.error("Invalid MakeRandomSimpleTile!");
      }
    }
    
    land_tiles_count = 0;
    for(var k in this.tiles_xy)
    {
      if (!this.tiles_xy[k].isWater()) land_tiles_count++;
    }
    ratio = land_tiles_count/(this.get('height')*this.get('width'));
  }
  while(Object.keys(this.tiles_hash).length < this.get('height')*this.get('width'));
  
  for(var k in this.tiles_xy)
  {
    if (!this.tiles_xy[k].get('id')) continue;
    var id = this.tiles_xy[k].get('id');
    var coord = new Coordinate(k);
    
    this.tiles_hash[this.tiles_xy[k].get('id')] = this.tiles_xy[k];

    for(var y = 0; y < dir.length; y++)
    {
      var index = coord[dir[y]]().wrapX(this);
      if (typeof this.tiles_xy[index.toJson()] == 'undefined') continue;
      
      this.tiles_hash[id].set(dir[y],this.tiles_xy[index.toJson()].get('id'));
    }
  }

  this.attr.tiles = this.tiles_hash;
  
  delete this.attr.land_ratio;
  delete this.attr.land_seeds;
  
  return new Map(this.attr);
}
RandomMap.prototype.get = ModelTrait.get;
RandomMap.prototype.set = ModelTrait.set;
RandomMap.prototype.hydrate = ModelTrait.hydrate;
RandomMap.prototype.dump = ModelTrait.dump;

function MakeRandomSimpleTile(o,ct,coord,land_tile_probability)
{
  t = new Tile({
    id:make_id(o.tiles_hash),
    t:[]
  });
  
  if (mt_rand(0,100) > land_tile_probability || (ct.isWater() && mt_rand(0,100) > 0.25*land_tile_probability))
  {
    t.set('t',['ocean']);
  }
  else if (mt_rand(0,o.get('height')) > 0.33*Math.pow(Math.abs((2*coord.y)-o.get('height')),2) || ((ct.isWater()||ct.get('t',[]).includes('desert')) && prob(0.4)))
  {
    t.set('t',['desert']);
  }
  else if (prob(0.08) || (ct.get('t',[]).includes('mountain') && prob(0.16) ))
  {
    t.set('t',['mountain']);
  }
  else
  {
    t.set('Y',mt_rand(0,mt_rand(15,100)));//forests
    
    if (prob(0.15))
    {
      t.set('farm',100);
    }
    else if (prob(0.16))
    {
      t.set('mine',100);
    }
  }
  if (!t) console.error("Tile is null!!");
  return t;
}
