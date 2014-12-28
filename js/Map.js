function Map (a)
{
  this.hydrate(a);
  
  //this.draw_count = 0;
}
Map.prototype.get = ModelTrait.get;
Map.prototype.set = ModelTrait.set;
Map.prototype.hydrate = function(a){
  //fun.call(thisArg[, arg1[, arg2[, ...]]])
  ModelTrait.hydrate.call(this,a);
  
  for(var tile_id in this.attr.tiles)
  {
    if (!this.attr.tiles[tile_id])
    {
      console.error("tile \""+tile_id+"\" should never be a null index");
      console.log(this.attr.tiles[tile_id]);
      continue;
    }
    this.attr.tiles[tile_id].parent = this;
  }
}
Map.prototype.dump = ModelTrait.dump;
Map.prototype.setZeroTile = function(tile){
  //console.log(tile);
  //console.log(tile.get('id'));
  this.zero_tile_id = tile.get('id')||tile;
  //console.log(this.zero_tile_id);
  return this;
};
Map.prototype.getTile = function(id){
  return this.attr.tiles[id]||null;
};
Map.prototype.draw = function(c,p){ // canvas //params

  var tile = null;
  var coord = XY(0,0);
  this.drawn_tiles = {};
  this.drawn_tiles_coords = [];

  p = assoc_merge({
    ox:0, //offset x
    oy:0, //offset y
    z:1,  //zoom 1 = 100%
    ts:24, //tile size
    hdft:4, //height diff for tile
    cw:640, // canvas width
    ch:480, // canvas height
    tile_id:this.zero_tile_id||null //tile to consider home/zero
  },p);
  
  //this.draw_count++;

  //blank background
  c.rect(0,0,p.cw,p.ch);
  c.fillStyle="white";
  c.fill();
  
  tile = this.attr.tiles[p.tile_id];
  
  if (!tile) throw "zero tile";
  
  var fn = function(c,map,tile,coord,p,fn,max_iterations,d,sub_dir)
  {
    if (!tile)
    {
      //console.info("no tile here "+coord.toJson());
      return;
    }
    //console.log("attempting to draw tile: "+tile.get('id','invalid_id')+ " at "+coord.toJson());
    if (typeof map.drawn_tiles[tile.get('id')] != 'undefined')
    {
      //console.info("already drawn "+coord.toJson()+" id: "+tile.get('id','invalid_id'));
      return;
    }
    if (!max_iterations) 
    {
      //console.log("max iteration reached cancelling "+coord.toJson()+" id: "+tile.get('id','invalid_id'));
      return;
    }
    max_iterations--;
    map.drawn_tiles[tile.get('id')] = 1;
    map.drawn_tiles_coords.push({
      id:tile.get('id'),
      coord:coord,
      json:coord.toJson()
    });
    
    var r = {
      x: p.ox + p.ts * p.z * (coord.x) + (p.ts * p.z * (coord.y)*0.5),
      y: p.oy + p.ts * p.z * (coord.y)
    };
    
    if (r.x + p.ts * p.z < -5 || r.x > p.width + 5 || r.y + p.ts * p.z < -5 - p.hdft || r.x > p.height + 5 + p.hdft)
    {
      //console.log("tile offscreen cancelling draw+procedurals "+coord.toJson()+" id: "+tile.get('id','invalid_id'));
      return;
    }
    
    tile.draw(
      c,
      r.x,
      r.y,
      p,
      coord,
      d
    );
    
    if (sub_dir && sub_dir.length > 3) sub_dir = null;
    
    sub_dir = sub_dir||generate_sub_direction_arr(d);
    
    for(var y = 0; y < sub_dir.length; y++)
    {
      var nTile = tile.n(sub_dir[y]);
      
      fn(
        c,
        map,
        nTile,
        coord[sub_dir[y]](),
        p,
        fn,
        max_iterations,
        sub_dir[y],
        sub_dir
      );
    }
    return true;
  };
  
  fn(
    c,
    this,
    tile,
    coord,
    p,
    fn,
    parseInt(1.1*p.cw/p.ts),
    null,
    null
  );
  
  return;
};
var debug_c1 = 0;