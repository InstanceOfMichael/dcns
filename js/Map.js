function Map (a)
{
  this.hydrate(a);
  this.selected = [];
  //this.draw_count = 0;
  
  this.set('draw_params',{
    ox:0, //offset x
    oy:0, //offset y
    z:1,  //zoom 1 = 100%
    ts:16, //tile size
    hdft:4, //height diff for tile
    cw:800, // canvas width
    ch:480, // canvas height
    tile_id:null //tile to consider home/zero
  });
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
  this.zero_tile_id = tile.get('id')||tile;
  return this;
};
Map.prototype.setRenderFromTile = function(tile){
  this.render_from_tile_id = tile.get('id')||tile;
  return this;
};
Map.prototype.getTile = function(id){
  return this.attr.tiles[id]||null;
};
Map.prototype.draw = function(p){ //params
  var c = this.canvas;
  var tile = null;
  var coord = this.render_from_coord||XY(0,0);
  this.drawn_tiles = {};
  this.drawn_tiles_coords = [];
  
  var max_tile_recursion_depth = 10;
  
  debug_c1 = 0; // global!


  // new parameters
  p = assoc_merge(this.get('draw_params'),{
    tile_id:this.render_from_tile_id||null //tile to consider home/zero
  },p);
  this.set('draw_params',p);
  
  console.info("Map.render()")
  console.log(this);
  console.log(p);
  
  //this.draw_count++;

  //blank background
  c.clearRect(200+0, 120+0, p.cw, p.ch);
  
  tile = this.attr.tiles[p.tile_id];
  
  if (!tile) throw "zero tile";
  
  var fn = function(c,map,tile,coord,p,fn,tile_recursion_depth,d,sub_dir)
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
    if (tile_recursion_depth > max_tile_recursion_depth)
    {
      //console.log("max iteration reached cancelling "+coord.toJson()+" id: "+tile.get('id','invalid_id'));
      return;
    }
    tile_recursion_depth++;
    map.drawn_tiles[tile.get('id')] = 1;
    map.drawn_tiles_coords.push({
      id:tile.get('id'),
      coord:coord,
      json:coord.toJson()
    });
    
    var fts = p.ts * p.z; // final tile size
    var r = {
      x: p.ox + p.ts * p.z * (coord.x) + (p.ts * p.z * (coord.y)*0.5),
      y: p.oy + p.ts * p.z * (coord.y),
      coord:coord,
      d:d,
      tile_recursion_depth:tile_recursion_depth
    };
    
    //console.log({r:r,p:p});
    if (r.x + fts < 0 || r.x > p.cw || r.y + p.hdft + fts < 0 || r.y - p.hdft > p.ch)
    {
      if (map.render_from_tile_id == tile.get('id'))
      {
        console.info('render_from_tile: Not Inside drawable area: '+tile.get('id'));
        var nTile = tile;
        var nCoord = new Coordinate(coord)
        if (r.y - p.hdft > p.ch && nTile.n('ne'))
        {
          console.log('moving ne...');
          nTile = nTile.n('ne');
          nCoord = nCoord.ne();
          if (nTile.n('nw'))
          {
            console.log('then moving nw...');
            nTile = nTile.n('nw');
            nCoord = nCoord.nw();
          }
        }
        if (r.y + p.hdft + fts < 0 && nTile.n('sw'))
        {
          console.log('moving sw...');
          nTile = nTile.n('sw');
          nCoord = nCoord.sw();
          if (nTile.n('se'))
          {
            console.log('then moving se...');
            nTile = nTile.n('se');
            nCoord = nCoord.se();
          }
        }
        if (r.x + fts < 0 && nTile.n('east').n('east'))
        {
          console.log('moving 2 east...');
          nTile = nTile.n('east').n('east');
          nCoord = nCoord.east().east();
        }
        if (r.x > p.cw && nTile.n('west').n('west'))
        {
          console.log('moving 2 west...');
          nTile = nTile.n('west').n('west');
          nCoord = nCoord.west().west();
        }
        
        if (nTile.get('id')!=tile.get('id'))
        {
          console.info('render_from_tile: selecting replacement: '+nTile.get('id')+' from: '+coord.toJson()+' to: '+nCoord.toJson());
          map.setRenderFromTile(nTile);
          map.render_from_coord = nCoord;
          return fn(c,map,nTile,nCoord,p,fn,0,null,null);
        }
        else
        {
          console.error('render_from_tile: no sutable replacement');
          return;
        }
      }
      else
      {
        return;
      }
    }
    
    tile.draw(
      c,
      r,
      p
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
        tile_recursion_depth,
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
    0,
    null,
    null
  );
  c.rect(200+0, 120+0, p.cw, p.ch); c.stroke();
  
  return;
};
var debug_c1;
