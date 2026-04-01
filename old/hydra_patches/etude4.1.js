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
         inv = 0
         grip = 0.3
         gsize = 1
         shapeSize=0.4
         yrep = 40
         xrep = 10
     } else if (tidal.snare1 > 0){
        oscrate = 1
         rate = 2
         move = 3
         inv = 1
         gsize = 0.2
         yrep = 300
         xrep = 400
         shapeSize=0.7
     }else if (tidal.noco > 0){
       xrep = 200
          gsize = 0.01
         rate = 0.6
         move = 2.4
         yrep = 4
         inv = 0
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
shape(4,()=>shapeSize,0.0)
      .repeatX(()=>xrep)
      //.repeatY(()=>yrep)
      .modulateScale(osc(()=>gsize))
      .modulateRepeatY(osc(0.1))
      .invert(()=>inv)
      .out(o1)
//////
render(o1)

      shape(4,0.6,0)
      .repeatX(3)
      .repeatY(40)
      .modulateScale(osc(80,15,0))
      .scrollY(10,8.05)
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

render(o3)

//react assign osc time

    shape(4,0.2,0)
        .modulateScrollX(osc(()=>oscrate,2), ({time}) => Math.sin(time) * 3, 2)
        .scale(3,1,1)
        .out(o2)



shape(1,0,0).invert().out()

    shape(4,0.3,0)
        //.mult(osc(4,0.25,1))
        .modulateRepeatX(shape(()=>xrep), ({time}) => Math.sin(time) * 1, 100)
        .modulateRepeatY(osc(1), yrep, ()=>rate)
        .scale(()=>move,0.5,()=>gsize)
        .scale (()=>grip)
        .invert(()=>inv)
        .mask(o2)
        .out(o3)
        render(o3)

//function clearScreen(){
  solid().out(o0)
  solid().out(o1)
  solid().out(o2)
  solid().out(o3)
//}
