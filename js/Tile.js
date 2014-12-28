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
Tile.prototype.draw = function(c,x,y,p,coord,d)
{
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
  
  if (false)
  {
    c.fillRect(x,y,ts,ts);
  }
  else
  {
    
    c.beginPath();
    c.moveTo(x, y + p.hdft);
    c.lineTo(x + p.ts/2, y - p.hdft);
    c.lineTo(x + p.ts,   y + p.hdft);
    c.lineTo(x + p.ts,   y - p.hdft + p.ts);
    c.lineTo(x + p.ts/2, y + p.hdft + p.ts);
    c.lineTo(x, y - p.hdft + p.ts);
    c.closePath();
    
    c.fill();
  
  }
  
  if (coord)
  {
    c.fillStyle = "purple";
    c.font = (p.ts*0.33)+"px monospace";
    c.fillText(coord.x+','+coord.y, x, y+p.ts/2);
    this.coord = coord.toJson();
  }
  
  c.fillStyle = "cyan";
  c.font = (p.ts*0.33)+"px monospace";
  c.fillText(debug_c1++, x, y+p.ts/4);
  
  c.fillStyle = "cyan"; d = d||'c';
  c.font = (p.ts*0.25)+"px monospace";
  c.fillText(d, x+(p.ts*0.25), y+p.ts*0.9);
  
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