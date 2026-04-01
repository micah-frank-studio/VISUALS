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

outA=o1
outB=o0
scale = 0
msg.on('/play2', (args) => {
  // parse the values from tidal
var tidal = parseTidal(args)
  setTimeout(() => {
     if(tidal.s === "hipe"){
         scale = 2
         render(o3)
     } else if (tidal.s === "sub"){
       render(o0)
        scale = 1
     }
     //
  }, tidal.delta * 10)
})

var outs = [o0, o1, o2]

shape(3, 0.0, 0.1).out()
render()

shape(2,0.5,0)
      .modulateScrollX(osc(10))
      .scrollY(0.1,-4)
      .scale(()=>scale)
      .out(o0)
      //console.log(buffer)

    pi=3.1415
    shape(4,0.3,0)
        //.mult(osc(4,0.25,1))
        .modulateRepeatX(noise(2000,1), ({time}) => Math.sin(time) * 1000, 10)
        //.modulateRepeatY(osc(10), 10, 100)
        .scale(()=>scale,0.5,0.05)
        .rotate(0.5*pi)
        //.invert([0,1].fast(2))
        .out(o1)



//react assign osc time

    shape(4,0.2,0)
        .modulateScrollX(osc(2,2), ({time}) => Math.sin(time) * 3, 2)
        .scale(3,1,1)
        .out(o2)



shape(1,0,0).invert().out()

    shape(4,0.3,0)
        //.mult(osc(4,0.25,1))
        .modulateRepeatX(shape(), ({time}) => Math.sin(time) * 10, 10)
        .modulateRepeatY(osc(100), 10, 100)
        //.scale(1,0.5,0.05)
        .out(o3)

function clear(){
  solid().out(o0)
  solid().out(o1)
  solid().out(o2)
  solid().out(o3)
}
