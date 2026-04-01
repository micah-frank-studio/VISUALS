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

msg.on('/play2', (args) => {
  // parse the values from tidal
var tidal = parseTidal(args)
  setTimeout(() => {
     if(tidal.midichan === 0){
         size = 0.5
         repeat1 = 80
         repeatY = 1
         modScale = 2
         inv = 1
         scrollSpeed = 0.2
     } else if (tidal.midichan === 1){
         size = 0.1
         repeat1 = 20
         repeatY = 1
         modScale = 0
         inv = 0
         scrollSpeed = 100
     }else if (tidal.s === "noco"){
         oscSpeed1 = tidal.cutoff
         move = 2.4
          inv = 0
     } else if (tidal.n === 7){
       bright1 = 0.6
       repeat2 = 30
   } else if (tidal.midichan === 2){
     bright1 = 0.001
     repeat2 = 5
   } else if (tidal.s === "tape"){
     repeat3 = tidal.speed
 }
     //
  }, tidal.delta * 10)
})

//////
shape (4, ()=> size)
.repeatX(()=>repeat1)
.repeatY(()=>repeatY)
.scrollX(0.2, ()=>scrollSpeed)
.invert(()=>inv)
.modulateScale(osc(()=>modScale))
.out(o0)

shape (2)
.mask(shape(1).modulateRepeatX(osc(()=>oscSpeed1)))
.modulateRotate(osc(2))
//.blend(o0, 0.9)
.out(o1)

shape (2, 0.2)
.brightness(()=>bright1)
.repeatY(()=>repeat2)
.scrollY(10, 7.9)
.mask(shape(2, 0.2).repeatY(()=>repeat2*0.2))
.scrollY(0.2, 0.8)
.blend(o1, 0.8)
.out(o2)

shape(4, 0.9)
.repeatX(()=>oscSpeed1)
.modulateScale(osc(()=>oscSpeed1*0.2))
.mask(noise(()=>oscSpeed1).repeatX(2))
.invert(0)
.scrollX(4, 0)
.layer(o0, 0)
.blend(o1, 0)
.layer(o2, 0)
.out(o3)

render(o3)
