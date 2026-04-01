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
msg.on('/play2', (args) => {
  // parse the values from tidal
var tidal = parseTidal(args)
  setTimeout(() => {
     if(tidal.kick > 0){
         oscrate = 0.1
         move = 0.4
         inv = 1
         grip = 0.3
         gsize = 0.1
         shapeSize=0.7
         yrep = 2
     } else if (tidal.snare1 > 0){
        oscrate = 1
         rate = 20
         move = 3
         inv = 0
         grip = 0.5
         yrep = 1
         shapeSize=0.3
     }else if (tidal.noco > 0){
         rate = 0.6
         move = 2.4
     } else if (tidal.n === 9){
       inv = 1
       grip = 6.7
       gsize = 0.1
       yrep= 20
   }
     //
  }, tidal.delta * 1)
})

//////
shape(4,()=>shapeSize,0)
      .repeatX([30, 500, 40])
      .repeatY(()=>yrep)
      .modulateScale(osc(()=>move))
      .invert(()=>inv)
      .modulateRepeatY(osc(()=>oscrate))
      .out(o1)
//////
render(o1)

      shape(4,0.6,0)
      .repeatX(3)
      .repeatY(40)
      //.modulateScale(osc(80,15,0))
      .scrollY(100,8.05)
      .out(o0)
//////

      render(o0)

    pi=3.1415
noise(400,0.3,0)
        //.mult(osc(4,0.25,1))
        .modulateRepeatX(noise(20,10), ({time}) => Math.sin(time) * 100, 100)
        //.modulateRepeatY(osc(10), 10, 100)
        .scale(0.2,0.5,0.05)
        .rotate(0.5*pi)
        //.invert()
        .out(o3)

render(o1)

//react assign osc time

    shape(4,0.2,0)
        .modulateScrollX(osc(2,2), ({time}) => Math.sin(time) * 3, 2)
        .scale(3,1,1)
        .out(o2)



shape(1,0,0).invert().out()

    shape(4,0.3,0)
        //.mult(osc(4,0.25,1))
        .modulateRepeatX(shape(), ({time}) => Math.sin(time) * 1, 100)
        .modulateRepeatY(osc(1), 10, ()=>rate)
        .scale(()=>move,0.5,()=>gsize)
        .scale (()=>grip)
        .invert(()=>inv)
        .out(o3)
        render(o3)

//function clearScreen(){
  solid().out(o0)
  solid().out(o1)
  solid().out(o2)
  solid().out(o3)
//}
