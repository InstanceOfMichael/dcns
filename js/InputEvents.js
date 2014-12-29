function InputEvents (game,canvas) {
  this.canvas = canvas;
  this.game = game;
  this.long_left_click = null;
  this.drag_active = null;
  this.mouse_coord = XY(0,0);
  this.keys_down = {};
}
InputEvents.prototype.init = function(){
  //this.canvas.addEventListener('click', this, false);
  this.canvas.addEventListener('mousedown', this, false);
  this.canvas.addEventListener('mouseup', this, false);
  this.canvas.addEventListener('mousemove', this, false);
  //window.addEventListener('keypress', this, false);
  window.addEventListener('keydown', this, false);
  window.addEventListener('keyup', this, false);
  //this.canvas.addEventListener('touchstart', this, false);
  //this.canvas.addEventListener('contextmenu', this, false);
  document.oncontextmenu = function(e){
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
}
InputEvents.prototype.handleEvent = function(e){

  e.coord = XY(e.x,e.y);

  if (e.type == 'mousedown')
  {
    //console.info('mousedown!');
    if (!this.long_left_click)
    {
      var Ξ = this;
      e.longPressTimer = setTimeout(function(){
        var md = Ξ.long_left_click;
        if (!md)
        {
        
        }
        if (md.coord.within(10,Ξ.mouse_coord))
        {
          Ξ.long_left_click = null;
          Ξ.doOnLongLeftClick(md);
        }
        else
        {
          Ξ.doOnDragStart(md);
        }
      },250);
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
    
    if (mu&&md ? linear_distance(md.coord,mu.coord) : null)
    {
      /*
      console.log({
        //mousedown:md,
        //mouseup:mu,
        distance:(mu&&md ? linear_distance(md.coord,mu.coord) : null)
      });//*/
    }

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
    //console.info('mousemove!');
    this.mouse_coord = e.coord;
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
    delete this.keys_down[e.which];
    if ({37:1,38:1,39:1,40:1}[e.which])
    {
      this.doOnArrowKey(kd);
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
}
InputEvents.prototype.doOnLeftClick = function(md,mu){
  //console.info('on Left Click!');
}
InputEvents.prototype.doOnMiddleClick = function(md,mu){
  //console.info('on Middle Click!');
}
InputEvents.prototype.doOnLongLeftClick = function(md,mu){
  //console.info('on Long Left Click!');
}
InputEvents.prototype.doOnRightClick = function(md,mu){
  //console.info('on Right Click!');
}
InputEvents.prototype.doOnUnknownClick = function(md,mu){
  //console.info('on Unknown Click!');
}
InputEvents.prototype.doOnDragStart = function(md){
  this.drag_active = md;
  //console.info('on Drag Start!');
}
InputEvents.prototype.doOnDragStop = function(md){
  //console.info('on Drag Stop!');
  this.drag_active = null;
}
InputEvents.prototype.doOnZoomKey = function(md){
  //zoom!
  var p = { //params
    z : this.game.map.get('draw_params',{z:1}).z,
  };
  
  
  if (typeof this.keys_down[189] != 'undefined') { p.z -= 0.15; } // zoom out
  if (typeof this.keys_down[187] != 'undefined') { p.z += 0.15; } // zoom in
  console.log('zoom now set to: '+p.z);
  
  this.game.draw(p);

}
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

}
InputEvents.prototype.doOnMouseMove = function(mm){
  //console.info('mouse position (x:'+mm.coord.x+',y:'+mm.coord.y+')');
  if (this.drag_active)
  {
    var md = this.drag_active;
    
    if (this.game.map.selected.length)
    {
      console.log('this.game.map.selected.length: '+ this.game.map.selected.length);
      
    }
    else
    {
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
    
  }
  else
  {
  
  }
}
