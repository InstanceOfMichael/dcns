function InputEvents (game) {
  //this.canvas_container = canvas_container;
  this.game = game;
  this.long_left_click = null;
  this.drag_active = null;
  this.mouse_coord = XY(0,0);
  this.keys_down = {};
  this.mo_tiles = [];
}
InputEvents.prototype.init = function(){
  document.addEventListener('mousedown', this, false);
  //document.addEventListener('touchstart', this, false);

  document.addEventListener('mouseup', this, false);
  //document.addEventListener('touchend', this, false);
  
  document.addEventListener('mousemove', this, false);
  //document.addEventListener('touchmove', this, false);

  window.addEventListener('keydown', this, false);
  window.addEventListener('keyup', this, false);
  document.oncontextmenu = function(e){
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
};
InputEvents.prototype.handleEvent = function(e){

  e.coord = XY(e.x,e.y);

  if (e.type == 'mousedown')
  {
    //console.info('mousedown!');
    if (!this.long_left_click)
    {
      var Ξ = this;
      e.longPressTimer = setTimeout(function()
      {
        var md = Ξ.long_left_click;
        if (!md)
        {
        
        }
        else
        {
          Ξ.long_left_click = null;
          Ξ.doOnLongLeftClick(md);
        }
      },750);
      this.long_left_click = e;
    }
    else
    {
      console.error("The previous mousedown is still active");
    }

  }
  else if (e.type == 'mouseup')
  {
    //console.info('mouseup!');
    var mu = e;
    var md = this.long_left_click;

    if (md)
    {
      if (md.coord.within(10,mu.coord))
      {
        if (mu.which==1)
        {
          this.doOnLeftClick(md,mu);
        }
        else if (event.which==2)
        {
          this.doOnMiddleClick(md,mu);
        }
        else if (event.which==3)
        {
          this.doOnRightClick(md,mu);
        }
        else
        {
          this.doOnUnknownClick(md,mu);
        }
      }
      else
      {
        this.doOnDragStop(md,mu);
      }
    }

    if (this.long_left_click) this.long_left_click = null;
    if (md) clearTimeout(md.longPressTimer);
  }
  else if (e.type == 'mousemove')
  {
    this.mouse_coord = e.coord;
    if (this.long_left_click && !this.drag_active)
    {
      var md = this.long_left_click;
      if (!md.coord.within(10,this.mouse_coord))
      {
        clearTimeout(md.longPressTimer);

        this.doOnDragStart(md);
      }
    }
    this.doOnMouseMove(e);
  }
  else if (e.type == 'keydown')
  {
    var kd = e;
    this.keys_down[e.which] = kd;
    if ({37:1,38:1,39:1,40:1}[e.which])
    {
      this.doOnArrowKey(kd);
    }
    else if ({187:1,189:1}[e.which])
    {
      this.doOnZoomKey(kd);
    }
    else
    {
      console.error(e.type+' '+e.which);
      //console.log(e);
    }
  }
  else if (e.type == 'keyup')
  {
    var ku = e;
    delete this.keys_down[e.which];
    if ({37:1,38:1,39:1,40:1}[e.which])
    {
      this.doOnArrowKey(ku);
    }
    else
    {
      //console.error(e.type+' '+e.which);
      //console.log(e);
    }
  }
  else
  {
    console.error(e.type);
    console.log(e);
  }
  
  e.preventDefault();
  e.stopPropagation();
  return false;
};
InputEvents.prototype.doOnLeftClick = function(md,mu){
  console.info('on Left Click!');
  
  console.log('mouse at: '+mu.coord.toJson());
  
  var tile = this.game.map.getTileFromMouseEvent(mu);
  
  if (this.game.map.selected.filter(function(s)
  {
    return s.get('index')=='tiles' && tile.get('id')==s.model.get('id');
  }).length){
    tile = null;
  }
  
  this.game.map.unselectAll();
  
  if (tile)
  {
    var s = new Selection('tiles',tile);
    tile.selected = s;
    
    this.game.map.selected.push(s);

    tile.getUnits().forEach(function(unit)
    {
      var s = new Selection('units',unit);
      unit.selected = s;
      G.map.selected.push(s);
    });
  }
  
  this.game.draw();
  this.game.drawSelectInfoBox();
};
InputEvents.prototype.doOnMiddleClick = function(md,mu){
  //console.info('on Middle Click!');
};
InputEvents.prototype.doOnLongLeftClick = function(md,mu){
  //console.info('on Long Left Click!');
};
InputEvents.prototype.doOnRightClick = function(md,mu){
  //console.info('on Right Click!');
};
InputEvents.prototype.doOnUnknownClick = function(md,mu){
  //console.info('on Unknown Click!');
};
InputEvents.prototype.doOnDragStart = function(md){
  this.drag_active = md;
  console.info('on Drag Start!');
};
InputEvents.prototype.doOnDragStop = function(md){
  console.info('on Drag Stop!');
  this.drag_active = null;
};
InputEvents.prototype.doOnZoomKey = function(md){
  //zoom!
  var p = { //params
    ox : this.game.map.get('draw_params',{ox:0}).ox,
    oy : this.game.map.get('draw_params',{oy:0}).oy,
    z : this.game.map.get('draw_params',{z:1}).z
  };
  
  
  if (typeof this.keys_down[189] != 'undefined') // zoom out
  {
    p.z -= 0.15;
  }
  if (typeof this.keys_down[187] != 'undefined') // zoom in
  {
    p.z += 0.15;
  }
  
  p.z = Math.min(Math.max(p.z,0.55),3.25);
  
  console.log('zoom now set to: '+p.z);
  
  this.game.draw(p);

};
InputEvents.prototype.doOnArrowKey = function(md){
  //console.info('on Arrow Key!');
  if (this.drag_active) return;
  
  //console.log(this.keys_down);
  
  //pan!
  var p = { //params
    ox : this.game.map.get('draw_params',{ox:0}).ox,
    oy : this.game.map.get('draw_params',{oy:0}).oy
  };
  
  
  if (typeof this.keys_down[37] != 'undefined') { p.ox += 15; } // left
  if (typeof this.keys_down[39] != 'undefined') { p.ox -= 15; } // right
  
  if (typeof this.keys_down[38] != 'undefined') { p.oy += 15; } // up
  if (typeof this.keys_down[40] != 'undefined') { p.oy -= 15; } // down
  
  
  
  this.game.draw(p);

};
InputEvents.prototype.doOnMouseMove = function(mm){
  //console.info('mouse position (x:'+mm.coord.x+',y:'+mm.coord.y+')');
  if (this.drag_active)
  {
    var md = this.drag_active;
    
    //pan!
    if (!md.map_original)
    {
      md.map_original = {
        coord : XY(
          this.game.map.get('draw_params',{ox:0}).ox,
          this.game.map.get('draw_params',{oy:0}).oy
        )
      };
    }
    
    var p = { //params
      ox : md.map_original.coord.x - 3*(md.coord.x - mm.coord.x),
      oy : md.map_original.coord.y - 3*(md.coord.y - mm.coord.y)
    };
    
    
    this.game.draw(p);
    
  }
  else
  {
  
  }
  
  var tile = this.game.map.getTileFromMouseEvent(mm);
  
  if (tile)
  {
    if (tile.get('id') && this.mo_tiles.length === 0 || (this.mo_tiles[0].get('id') != tile.get('id')))
    {
      this.mo_tiles.unshift(tile);
      if (this.mo_tiles.length > 24) this.mo_tiles.length = 24;
      
      this.game.tooltip.draw(this.game.map.canvas,this.game.map,tile,mm.coord);
    }
  }
};
