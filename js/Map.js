function Map (a)
{
  this.attr = {
    tiles:{},
    units:{}
  };
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
    if (typeof this.attr.tiles[tile_id].hydrate != 'function')
    {
      this.attr.tiles[tile_id] = new Tile(this.attr.tiles[tile_id]);
    }
    this.attr.tiles[tile_id].parent = this;
  }
}
Map.prototype.dump = function(){
  var a = ModelTrait.dump.call(this);

  var tiles = [];
  for(var tile_id in this.attr.tiles)
  {
    var tile = this.attr.tiles[tile_id];
    if (typeof tile.dump == 'function')
    {
      tile = tile.dump();
    }
    tiles.push(tile);
  }
  a.tiles = tiles;
  delete a.draw_params;//this should be stored in the user data or not stored
  
  return a;
};
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
Map.prototype.getFinalTileSize = function(){
  return this.get('draw_params').ts * this.get('draw_params').z;
}
Map.prototype.draw = function(p){ //params
  var c = this.canvas;
  var tile = null;
  var coord = this.render_from_coord||XY(0,0);
  this.drawn_tiles = {};
  this.drawn_tiles_coords = [];
  
  debug_c1 = 0; // global!


  // new parameters
  p = assoc_merge(this.get('draw_params'),{
    tile_id:this.render_from_tile_id||null //tile to consider home/zero
  },p);
  this.set('draw_params',p);
  
  var max_tile_recursion_depth = parseInt((p.cw*p.ch)/(p.ts*p.ts));

  //blank background
  for(var k in c)
  {
    c[k].clearRect(0, 0, p.cw, p.ch);
    c[k].beginPath(); // this fixes a bug where ghost lines appear
  }
  
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
      x: (0.5*p.cw*(1-p.z)) + p.z * (coord.x * p.ts + p.ox) + (p.ts * p.z * (coord.y)*0.5),
      y: (0.5*p.ch*(1-p.z)) + p.z * (coord.y * p.ts + p.oy),
      coord:coord,
      d:d,
      tile_recursion_depth:tile_recursion_depth
    };
    if (map.render_from_tile_id == tile.get('id'))
    {
      //console.log({p:p,r:r});
    }
    
    if (r.x + fts < 0 || r.x > p.cw || r.y + p.hdft + fts < 0 || r.y - p.hdft > p.ch)
    {
      if (map.render_from_tile_id == tile.get('id'))
      {
        var nTile = tile;
        var nCoord = new Coordinate(coord)
        if (r.y - p.hdft > p.ch && nTile.n('ne'))
        {
          nTile = nTile.n('ne');
          nCoord = nCoord.ne();
          if (nTile.n('nw'))
          {
            nTile = nTile.n('nw');
            nCoord = nCoord.nw();
          }
        }
        if (r.y + p.hdft + fts < 0 && nTile.n('sw'))
        {
          nTile = nTile.n('sw');
          nCoord = nCoord.sw();
          if (nTile.n('se'))
          {
            nTile = nTile.n('se');
            nCoord = nCoord.se();
          }
        }
        if (r.x + fts < 0 && nTile.n('east').n('east'))
        {
          nTile = nTile.n('east').n('east');
          nCoord = nCoord.east().east();
        }
        if (r.x > p.cw && nTile.n('west').n('west'))
        {
          nTile = nTile.n('west').n('west');
          nCoord = nCoord.west().west();
        }
        
        if (nTile.get('id')!=tile.get('id'))
        {
          map.setRenderFromTile(nTile);
          map.render_from_coord = nCoord;//.wrapX(map); //p.ox probably needs to be changed to use this
          //console.log(nCoord.toJson()+nCoord.wrapX(map).toJson());
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
        //return; // cancel draw, but some neighbors still need to be queued, so dont return here
      }
    }
    else
    {
      tile.draw(
        c,
        r,
        p
      );
    }
    
    // dont recursively queue neighbors that wont show up.
    if (r.x + fts + p.ch < 0 || r.x > p.cw + p.cw || r.y + p.hdft + p.cw + fts < 0 || r.y - p.hdft > p.ch + p.cw)
    {
      return;
    }
    
    if (sub_dir && sub_dir.length > 3) sub_dir = null;
    
    sub_dir = sub_dir||generate_sub_direction_arr(d);
    //var sub_dir = dir;
    
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
        without_opposite_dir(sub_dir,sub_dir[y])
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
    dir
  );
  c.ui1.rect(0, 0, p.cw, p.ch); c.ui1.stroke();
  
  return;
};
var debug_c1;
Map.prototype.getTileFromMouseEvent = function(mu){//mouse up event

  var p = this.get('draw_params',{});
  var coord = XY(
    (((mu.coord.x - (0.5*p.cw*(1-p.z)))/p.z) - p.ox)/p.ts,
    (((mu.coord.y - (0.5*p.ch*(1-p.z)))/p.z) - p.oy)/p.ts
  );
  coord.x = coord.x - (Math.floor(coord.y)*0.5);
  
  coord.x = Math.floor(coord.x);
  coord.y = Math.floor(coord.y);
  
  var h = {
    tile:  this.attr.tiles[this.render_from_tile_id]||null,
    coord: this.render_from_coord ? new Coordinate(this.render_from_coord) : XY(0,0) //home coordinate
  };
  
  if (h.coord.toJson()==coord.toJson()) return h.tile;
  
  return h.tile.travel(h.coord,coord);
}
Map.prototype.unselectAll = function(){
  this.selected = this.selected.filter(function(s){
    s.unselect(); return false;
  });
  return this;
}