msg.setPort(3333)

parseTidal = (args) => {
  obj = {}
  for(var i = 0; i < args.length; i+=2){
    obj[args[i]] = args[i+1]
  }
  return obj
}

msg.on('/play2', (args) => {
// log osc results to console
 //log(args)
 tidal = parseTidal(args)
 console.log(tidal)
})

move = 0
rate = 0
grip = 1
blend = 0
msg.on('/play2', (args) => {
  // parse the values from tidal
var tidal = parseTidal(args)
  setTimeout(() => {
    freq = tidal.freq
    speed = 60/freq
     if(tidal.kick > 0){
         oscrate = 0.1
         move = 0.4
         inv = 0
         grip = 0.3
         gsize = 1
         shapeSize=0.4
         yrep = 40
         xrep = 10
         blend = 0
     } else if (tidal.snare1 > 0){
        oscrate = 1
         rate = 2
         move = 3
         inv = 1
         gsize = 0.2
         yrep = 300
         xrep = 400
         shapeSize=0.7
         blend=0
     }else if (tidal.blowout > 0){
       xrep = 20
          gsize = 300.01
         rate = 0.6
         move = 2.4
         yrep = 40
         blend = 1
     } else if (tidal.n === 9){
       oscrate = 9
       inv = 1
       grip = 6.7
       gsize = 0.1
       yrep= 30
   }
     //
  }, tidal.delta * 1)
})

//////
shape(2, 0.03, 0)
    // .modulatePixelate(osc(()=>freq))
      .modulateScrollY(osc(()=>freq))
      .repeat()
      //.scale([0.1, 0.2, 0.04])
      .out(o0)
//////
//render(o0)

shape(2, 0.1, 0)
    //.modulatePixelate(osc(()=>freq))
      .repeatY(10)
      .scrollY(0.01, ()=>freq*0.005)
      //.modulateScrollY(osc(()=>freq*0.01))
      //.modulateScale(osc(()=>freq))
      //.blend(o0, 0.2)
      .out(o1)
//////
//render(o1)

    pi=3.1415
    shape(4,0.7,0)
      //.mult(osc(0.1,9,0))
        .modulateRepeatX(osc(2000,(()=>freq)), ({time}) => Math.sin((time)) * 100, 100)
      //.blend(o1, ({time}) => Math.square((time)))
      .blend(o2)
        //.invert(()=>inv)
        //.modulateRepeatX(shape(100, 0.2, 0))
        .modulateRepeatY(osc(()=>freq*0.005), 1, 1)
        .out(o2)
  //      render(o2)
//react assign osc time




    shape(0.1,0.001,0.01)
        //.modulateRepeatY(osc(()=>freq*0.01))
        //.scrollX(10)
        .blend(o2, ()=>freq*0.01)
        .blend(o1, ({time}) => Math.sin((time)) * 0.4)
        .blend(o0, ({time}) => 1/Math.sin((time)) * 0.4)
        .out(o3)
        render()

//function clearScreen(){
  solid().out(o0)
  solid().out(o1)
  solid().out(o2)
  solid().out(o3)
//}
