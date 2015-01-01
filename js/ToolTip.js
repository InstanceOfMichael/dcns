function ToolTip()
{

}
ToolTip.prototype.draw = function(c,map,model,r_coord)
{
  var p = map.get('draw_params',{});
  var map_coord = r_coord.toMapCoord(p);
  c.tooltip.clearRect(0,0,p.cw,p.ch);
  if (!model)
  {
    return;
  }
  if (model.constructor.name == 'Tile')
  {
    c.tooltip.save();
    
    c.tooltip.fillStyle="rgba(100,100,100,0.44)";
    c.tooltip.fillRect(p.cw-240, p.ch-80,240,80);
    c.tooltip.fillStyle="rgb(255,255,255)";
    
    var text = model.get('t',[]).join(', ')||'grassland';
    
    if (model.get('mine',0))
    {
      text+=', mine';
      if (model.get('mine',0)!==100)
      {
        text+='('+model.get('mine',0)+')';
      }
    }
    if (model.get('farm',0))
    {
      text+=', farm';
      if (model.get('farm',0)!==100)
      {
        text+='('+model.get('farm',0)+')';
      }
    }
    model.getUnits().forEach(function(unit)
    {
      text += ', '+unit.getToolTipName();
    });
    
    if (!false)
    {
      text += ' ('+map_coord.x+','+map_coord.y+')';
    }
    
    c.tooltip.shadowColor = "black"; // string
    c.tooltip.shadowOffsetX = 0.75; // integer
    c.tooltip.shadowOffsetY = 0.75; // integer
    c.tooltip.shadowBlur = 1.5;

    c.tooltip.fillStyle = "white";
    c.tooltip.font = "14px monospace";
    c.tooltip.fillText(text,p.cw-240+10, p.ch-80+20);

    c.tooltip.restore();
  }
}