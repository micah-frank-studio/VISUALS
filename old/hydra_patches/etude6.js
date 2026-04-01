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
shape(2,()=>shapeSize,0.0)
      .repeatY(()=>move)
      .scale(()=>gsize)
      .scrollY(0.2, ()=>rate*2)
      .invert(()=>inv)
      //.blend(o3, ()=>blend)
      .out(o0)
//////
render()

      shape(4,0.6,0)
      //.repeatX(3)
      .repeatX(2)
      .scale(()=>move)
      .scrollX(1,8.05)
    //  .blend(o2, ()=>blend)
      .out(o1)
//////
    render()

    pi=3.1415
noise(400,0.3,0)
      //  .mult(osc(2,6,0))
        //.modulateRepeatX(noise(20,1), ({time}) => Math.sin(time) * 100, 100)
        .modulateRepeatY(osc(100), 10, 100)
      //  .blend(o3, ()=>blend)
      .invert(()=>inv)
        .repeat X(5)
        .out(o2)
        //render()
//react assign osc time



shape(4,0,0).invert().out()

    shape(4,0.3,0)
        .modulateRepeatY(osc(()=>yrep))
        .scrollY(10)
        .modulateRepeatX(shape(2), ({time}) => Math.sin(time) * 100, 40)
        .modulateScale(osc(1), 1, 2)
        .invert(()=>inv)
        .mask(o1, 0.2)
        .blend(o2, ()=>blend)
        .mask(shape(2))
        .modulateScale(osc(2))
        .out(o3)
        render()

//function clearScreen(){
  solid().out(o0)
  solid().out(o1)
  solid().out(o2)
  solid().out(o3)
//}
