var G;
var c;
var cDOM;
document.addEventListener('DOMContentLoaded', function(){
  G = new Game();

  
  cDOM = document.getElementById("game");
  
  c = cDOM.getContext("2d");
  
  G.map = new RandomMap({
    width:32,
    height:24
  });
  G.map.canvas = c;
  G.ie = new InputEvents(G,cDOM);
  G.ie.init();
  
  // set property that would normally be
  // the player's capitol or notification focus
  for(var k in G.map.attr.tiles)
  {
    try{
      G.map.setZeroTile(G.map.attr.tiles[k]);
      G.map.setRenderFromTile(G.map.attr.tiles[k]);
      break;
    }catch(e){
      console.error(e);
    }
  }
  
  G.draw({
    cw:400,
    ch:240,
    ox:0,
    oy:0,
    ts:48
  });
  
  //var t = G.map.getTile(G.map.drawn_tiles_coords[0].id);
  
});
