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
msg.on('/play2', (args) => {
  // parse the values from tidal
var tidal = parseTidal(args)
  setTimeout(() => {
     if(tidal.midichan === 0){
     } else if (tidal.s === "node"){
        gen1invert = gen1invert == 1 ? 0 : 1
     }else if (tidal.s === "tape"){
       gen1blend = tidal.pan
     } else if (tidal.n === 7){
   } else if (tidal.midichan === 2){
   } else if (tidal.s === "spuzz"){
 }
     //
  }, tidal.delta * 10)
})

//////
noise (2000, 100, 2)
.mask(shape(2, 0.9)
  .modulateRepeatY(shape(2), 3, 100)
  .repeatY(2)
  .color(4))
  .invert(()=>gen1invert)
  .scrollY(3, 2)
  .mask(shape(4, 0.5).modulateScale(osc(0.8, 1)).repeat(4))
  .mask(shape(2).modulateScale(noise(3)))
  .scrollX(1, 0.01)
  .modulateScale(osc(0.2,2))
.out(o0)

shape(90).scrollY(0.1, 0.2)
.mask(shape(2).modulateScale(noise(3)))
.scrollX(1, 0.01)
.blend(o0, ()=>gen1blend)
.invert(1)
.repeatY(30)
.mask(shape(4, 0.5).repeat(40))
.modulateScale(osc(0.9, 0.1))
.scrollX(0.9, 0.2)
.out(o1)

shape(2, 0.4)
.repeatY(90)
.mask(o1).scale(2)
.mask(shape(2).modulateScale(noise(0.1, 0.07)))
.repeatY(2)
.mask(shape(2).modulateScale(osc(0.1, 0.07)))
.color (1, 0 ,0.9)
.out(o2)

render(o2)
