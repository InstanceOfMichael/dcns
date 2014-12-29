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
    c.fillStyle="rgb(70,70,70)";
  }
  else if (t.includes('ocean','sea','lake'))
  {
    c.fillStyle="rgb(0,0,"+mt_rand(127,255)+")";
  }
  else if (t.includes('plains'))
  {
    c.fillStyle="rgb("+mt_rand(100,140)+","+mt_rand(180,220)+","+mt_rand(30,60)+")";
  }
  else if (t.includes('desert'))
  {
    c.fillStyle="rgb("+mt_rand(240,255)+","+mt_rand(215,255)+","+mt_rand(105,145)+")";
  }
  else
  {
    c.fillStyle="rgb("+mt_rand(0,30)+","+mt_rand(220,255)+","+mt_rand(0,30)+")";
  }
  
  c.beginPath();
  c.lineWidth=0.51;
  c.moveTo(x, y + p.hdft);
  c.lineTo(x + fts/2, y - p.hdft);
  c.lineTo(x + fts,   y + p.hdft);
  c.lineTo(x + fts,   y - p.hdft + fts);
  c.lineTo(x + fts/2, y + p.hdft + fts);
  c.lineTo(x, y - p.hdft + fts);
  c.closePath();
  
  c.fill();
  
  if (!false) // debug
  {
    c.save();

    c.shadowColor = "black"; // string
    c.shadowOffsetX = 0.75; // integer
    c.shadowOffsetY = 0.75; // integer
    c.shadowBlur = 1.5;

    if (coord)
    {
      c.fillStyle = "white";
      c.font = (fts*0.20)+"px monospace";
      c.fillText(coord.x+','+coord.y, x+(fts*0.2), y+fts/2);
      this.coord = coord.toJson();
    }

    if (false){
      c.fillStyle = "white";//"rgb(80,95,180)";
      c.font = (fts*0.20)+"px monospace";
      c.fillText("#"+debug_c1++ + " d:" + tile_recursion_depth, x, y+fts/4);
    }
    
    if (false){
      d = d||'o';
      if (d=='o')
      {
        c.shadowColor = "black";
        c.shadowOffsetX = 0.75; // integer
        c.shadowOffsetY = 0.75; // integer
        c.shadowBlur = 2;
        c.fillStyle = "yellow";
      }
      c.font = (fts*0.20)+"px monospace";
      c.fillText(d, x+(fts*0.25), y+fts*0.9);
      
      c.stroke();
    }
    c.restore();
  }
  c.stroke();
  
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
  
}


 */