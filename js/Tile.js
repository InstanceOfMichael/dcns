function Tile (a)
{
    this.hydrate(a);
}
Tile.prototype.get = ModelTrait.get;
Tile.prototype.set = ModelTrait.set;
Tile.prototype.hydrate = ModelTrait.hydrate;
Tile.prototype.dump = ModelTrait.dump;
Tile.prototype.isWater = function()
{
  return this.get('t',[]).includes('ocean','shallow','lake');
};
Tile.prototype.n = function (k){//get neighbor
  if (this.get(k,0))
  {
    return this.parent.getTile(this.get(k));
  }
  return null;
};
Tile.prototype.travel = function (c1,c2){//coord1, coord2
  co = c1;
  var dest = null;
  do{
    if (c1.x > c2.x)
    {
      c1 = c1.west();
      dest = (dest||this).n('west');
    }
    else if (c1.x < c2.x)
    {
      c1 = c1.east();
      dest = (dest||this).n('east');
    }
    if (c1.y > c2.y)
    {
      c1 = c1.nw();
      dest = (dest||this).n('nw');
    }
    else if (c1.y < c2.y)
    {
      c1 = c1.se();
      dest = (dest||this).n('se');
    }
  }
  while(c1.toJson()!=c2.toJson() && dest);
  
  return dest;
};
Tile.prototype.getUnits = function(){
  return this.get('ul',[]).map(function(unit_id)
  {
    return G.map.attr.units[unit_id];
  });
}
Tile.prototype.draw = function(c,r,p,coord,d)
{
  var x = r.x;
  var y = r.y;
  var d = r.d;
  var fts = p.z*p.ts;//final tile size
  var coord = r.coord;
  var tile_recursion_depth = r.tile_recursion_depth;

  var t = this.get('t',[]);
  if (t.includes('mountain'))
  {
    c.tiles1.fillStyle="rgb(70,70,70)";
  }
  else if (t.includes('ocean','sea','lake'))
  {
    c.tiles1.fillStyle="rgb(0,0,"+mt_rand(127,255)+")";
  }
  else if (t.includes('plains'))
  {
    c.tiles1.fillStyle="rgb("+mt_rand(100,140)+","+mt_rand(180,220)+","+mt_rand(30,60)+")";
  }
  else if (t.includes('desert'))
  {
    c.tiles1.fillStyle="rgb("+mt_rand(240,255)+","+mt_rand(215,255)+","+mt_rand(105,145)+")";
  }
  else
  {
    c.tiles1.fillStyle="rgb("+mt_rand(0,30)+","+mt_rand(220,255)+","+mt_rand(0,30)+")";
  }
  
  c.tiles1.beginPath();
  c.tiles1.lineWidth=0.51;
  c.tiles1.moveTo(x, y + p.hdft);
  c.tiles1.lineTo(x + fts/2, y - p.hdft);
  c.tiles1.lineTo(x + fts,   y + p.hdft);
  c.tiles1.lineTo(x + fts,   y - p.hdft + fts);
  c.tiles1.lineTo(x + fts/2, y + p.hdft + fts);
  c.tiles1.lineTo(x, y - p.hdft + fts);
  c.tiles1.closePath();
  
  c.tiles1.fill();
  
  if (!false) // debug
  {
    c.tiles1.save();

    c.tiles1.shadowColor = "black"; // string
    c.tiles1.shadowOffsetX = 0.75; // integer
    c.tiles1.shadowOffsetY = 0.75; // integer
    c.tiles1.shadowBlur = 1.5;

    if (coord)
    {
      c.tiles1.fillStyle = "white";
      c.tiles1.font = (fts*0.20)+"px monospace";
      c.tiles1.fillText(coord.x+','+coord.y, x+(fts*0.2), y+fts/2);
      this.coord = coord.toJson();
    }

    if (false){
      c.tiles1.fillStyle = "white";//"rgb(80,95,180)";
      c.tiles1.font = (fts*0.20)+"px monospace";
      c.tiles1.fillText("#"+debug_c1++ + " d:" + tile_recursion_depth, x, y+fts/4);
    }
    
    if (false){
      d = d||'o';
      if (d=='o')
      {
        c.tiles1.shadowColor = "black";
        c.tiles1.shadowOffsetX = 0.75; // integer
        c.tiles1.shadowOffsetY = 0.75; // integer
        c.tiles1.shadowBlur = 2;
        c.tiles1.fillStyle = "yellow";
      }
      c.tiles1.font = (fts*0.20)+"px monospace";
      c.tiles1.fillText(d, x+(fts*0.25), y+fts*0.9);
      
      c.tiles1.stroke();
    }
    c.tiles1.restore();
  }
  c.tiles1.stroke();
  
  if (this.get('farm'))
  {
    c.tiles2.save();
    c.tiles2.fillStyle="rgb(127,127,0)";
    c.tiles2.font = (fts*0.20)+"px monospace";
    c.tiles2.fillText("Farm", x+(fts*0.25), y+fts*0.9);
    c.tiles2.stroke();
    c.tiles2.restore();
  }
  if (this.get('mine'))
  {
    c.tiles2.save();
    c.tiles2.fillStyle="rgb(127,127,255)";
    c.tiles2.font = (fts*0.20)+"px monospace";
    c.tiles2.fillText("Mine", x+(fts*0.25), y+fts*0.9);
    c.tiles2.stroke();
    c.tiles2.restore();
  }
  
  this.getUnits().forEach(function(e)
  {
    c.tiles3.save();
  
    c.tiles2.fillStyle="rgb(127,127,255)";
    c.tiles2.font = (fts*0.66)+"px monospace";
    c.tiles2.fillText("[:)", x+(fts*-0.1), y+(0.75*fts));
    
    c.tiles3.stroke();
    c.tiles3.restore();
  });
  
  if (this.selected)
  {
    c.tiles3.save();
    
    c.tiles3.strokeStyle="rgb(255,0,0)";
  
    c.tiles3.beginPath();
    c.tiles3.lineWidth=2;
    c.tiles3.moveTo(x, y + p.hdft);
    c.tiles3.lineTo(x + fts/2, y - p.hdft);
    c.tiles3.lineTo(x + fts,   y + p.hdft);
    c.tiles3.lineTo(x + fts,   y - p.hdft + fts);
    c.tiles3.lineTo(x + fts/2, y + p.hdft + fts);
    c.tiles3.lineTo(x, y - p.hdft + fts);
    c.tiles3.closePath();
    
    c.tiles3.stroke();
    
    c.tiles3.restore();
  }
  
  return;
};
/*
var example.attr = {
  t:[] //terra // can be "ocean","lake","shallow","atoll","bay","marsh","jungle","plains","tundra","glacier","hill","mountain","desert","oasis"
                // default is grassland, stored as empty/no array. all terrains are modifiers to grassland.
  Y:0 => 100 // trees count
  c: // current // direction of sea current
  r:"" // resource // special resource e.g. "wheat","buffalo","rats"
  i:[] // improvements // [Improvement{},Improvement{}] // e.g. road, railroad, farm, plantation
  p:0 => 100 // pollution (value is exponent of damage, also represents half-life) //☠☢
  ul:[] //unit id list

  city_id="" // if the city is the improvement
  road:0 => 100 //health/maintenance 
  farm:0 => 100
  mine:0 => 100
  plantation:0 => 100
  
}


 */