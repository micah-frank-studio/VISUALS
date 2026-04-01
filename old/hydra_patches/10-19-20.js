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

gen1invert = 1
gen1blend = 0.5
noiseval = 0
msg.on('/play2', (args) => {
  // parse the values from tidal
var tidal = parseTidal(args)
  setTimeout(() => {
    if (tidal.s === "hipe"){
        gen1invert = gen1invert == 1 ? 0 : 1
        noiseval = 2000
     }else if (tidal.s === "dot"){
       gen1blend = tidal.gain
     } else if (tidal.midichan === 2){
       blend0 = 0.2
       blend1 = 0
       blend2 = 0.8
       noiseval = 2000
   } else if (tidal.s === "blast"){
     blend0 = 0
     blend1 = 0
     blend2 = 1
     noiseval = 0
   } else if (tidal.s === "spuzz"){
     blend0 = 0.5
     blend1 = 0
     blend2 = 0.5
 } else if (tidal.s === "click"){
   blend0 = 0
   blend1 = 0
   blend2 = 1
}
else if (tidal.s === "noco"){
  blend0 = 0
  blend1 = 1
  blend2 = 0
  hipevar = (tidal.pan)*40
}
     //
  }, tidal.delta * 10)
})

//////
noise (()=>noiseval, 100)
//.mask(shape(2, 0.9)
  //.modulateRepeatY(shape(2), 3, 100)
  //.repeatY(2)
  //.color(4))
  //.invert(()=>gen1invert)
  //.scrollY(3, 2)
  //.mask(shape(4, 0.5).modulateScale(osc(0.8, 1)).repeat(4))
  //.mask(shape(2).modulateScale(noise(3)))
  //.scrollX(1, 0.01)
  //.modulateScale(osc(0.2,2))
.out(o0)

shape(90).scrollY(0.1, 0.2)
.mask(shape(2).modulateScale(noise(3)))
.scrollX(1, 0.01)
//.blend(o0, ()=>gen1blend)
.invert(1)
//.repeatY(30)
.mask(shape(4, 0.5).repeat(()=>hipevar))
.modulateScale(osc(0.9, 0.1))
.scrollX(0.9, 0.2)
.out(o1)

shape(2, 0.4)
.repeatY(90)
.mask(o1).scale(2)
.mask(shape(2).modulateScale(noise(0.1, 0.07)))
.repeatY(2)
.mask(shape(4, 1).modulateScale(osc(1, 0.9)))
.blend(o0, 0.2)
.out(o2)

shape(4, 0.2, 0)
.blend(o1, ()=>blend0)
.blend(o2, ()=>blend2)
.blend(o1, ()=>blend1)
//.blend(o3).modulateScale(osc(0.2))
.out(o3)

render(o3)
