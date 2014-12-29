var G;
var c;
var cDOM;
document.addEventListener('DOMContentLoaded', function(){
  G = new Game();

  
  
  G.map = new RandomMap({
    width:32*2,
    height:24*2
  });
  G.map.canvas = {
    tiles1:'layer1',
    tiles2:'layer2',
    tiles3:'layer3',
    ui1:'layer4',
    ui2:'layer5',
    ui3:'layer6'
  };
  for(var k in G.map.canvas)
  {
    G.map.canvas[k] = document.getElementById(G.map.canvas[k]).getContext("2d");
  }
  G.ie = new InputEvents(G);
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
    cw:800,
    ch:480,
    ox:0,
    oy:0,
    ts:48
  });
  
  //var t = G.map.getTile(G.map.drawn_tiles_coords[0].id);
  
});
