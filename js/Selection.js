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
Game.prototype.drawSelectInfoBox = function()
{
  var c = this.map.canvas;
  var p = this.map.get('draw_params',{});
  var collection = this.map.selected||[];
  c.selectInfo.clearRect(0,0,p.cw,p.ch);
  
  if (collection.length)
  {
    c.selectInfo.save();
    var text_arr = ["selected:"];
    
    text_arr = text_arr.concat(collection.map(function(s)
    {
      return s.model.getSelectInfoBoxText();
    }));
    
    var yΔ = 0;

    c.selectInfo.fillStyle="rgba(100,100,100,0.44)";
    c.selectInfo.fillRect(0, p.ch-80,240,80);
    c.selectInfo.fillStyle="rgb(255,255,255)";
    c.selectInfo.shadowColor = "black"; // string
    c.selectInfo.shadowOffsetX = 0.75; // integer
    c.selectInfo.shadowOffsetY = 0.75; // integer
    c.selectInfo.shadowBlur = 1.5;
    c.selectInfo.fillStyle = "white";
    c.selectInfo.font = "14px monospace";
    
    console.log(text_arr);
    
    text_arr.forEach(function(text)
    {
      c.selectInfo.fillText(text,0+10, p.ch-80+20+yΔ);
      yΔ+=20;
    });

    c.selectInfo.restore();
  }
};