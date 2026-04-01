# Hydra Style & Code Guide

Reference for writing Hydra video synth sketches in the puremagnetik/VISUALS style.
Based on analysis of 21 sketches (etude series, 522/526 series, dated sketches).

---

## Architecture Pattern

Every sketch follows this structure:

```javascript
// 1. OSC setup (Tidal Cycles integration)
msg.setPort(3333)

// 2. Tidal parser (universal helper)
parseTidal = (args) => {
  obj = {}
  for (var i = 0; i < args.length; i += 2) {
    obj[args[i]] = args[i + 1]
  }
  return obj
}

// 3. Reactive state variables (mutated by Tidal messages)
let repeat1 = 2, shapeSize = 0.5, inv = 0
let blend0 = 0.5, blend1 = 0.5, blend2 = 0.5

// 4. OSC listener — maps Tidal properties to visual params
msg.on('/play2', (args) => {
  tidal = parseTidal(args)
  // Route by sample name, MIDI channel, note number, etc.
})

// 5. Hydra chains — built ONCE, arrow functions for reactivity
shape(4, () => shapeSize).repeatX(() => repeat1).out(o0)
noise(3).mask(shape(2)).out(o1)
src(o0).blend(src(o1), () => blend0).out(o2)

// 6. Render
render(o2)
```

**Key rule:** Build chains once. Never call `.out()` per frame. Arrow functions handle all reactivity.

---

## Tidal Routing Patterns

### By sample name (`tidal.s`)
```javascript
if (tidal.s == "kick")   { /* bass-reactive params */ }
if (tidal.s == "snare1") { /* transient params */ }
if (tidal.s == "blowout"){ /* extreme shift */ }
```

### By MIDI channel (`tidal.midichan`)
```javascript
if (tidal.midichan == 0) { /* channel 0 controls */ }
if (tidal.midichan == 1) { /* channel 1 controls */ }
```

### By note number (`tidal.n`)
```javascript
if (tidal.n == 7) { /* specific note triggers */ }
if (tidal.n == 9) { /* alternate trigger */ }
```

### Useful Tidal properties
- `tidal.gain` — amplitude (0-1+)
- `tidal.pan` — stereo position (0-1)
- `tidal.cutoff` — filter frequency
- `tidal.freq` — note frequency
- `tidal.delta` — time until next event (seconds)

### Delayed parameter reset
```javascript
setTimeout(() => { move = 0 }, tidal.delta * 10)
```
Musical timing — reset after a beat fraction.

---

## Visual Vocabulary

### Primary sources
- **`shape(sides, size, smoothing)`** — the workhorse. Sides 2-4 for basic geometry, 0.1-90 for exotic.
- **`noise(freq, speed)`** — texture and modulation source. Freq 3-20, speed 0.1-2.
- **`osc(freq, sync, offset)`** — stripes and periodic patterns.
- **`solid()`** — clear/blank.

### Core transforms
- **`.repeatX(n) / .repeatY(n)`** — tiling. Values 2-40 for grids, 300-400 for dense line fields.
- **`.scrollX(speed, dist) / .scrollY()`** — panning. Speed 0.01-10, dist 0.2-8.
- **`.scale(amount)`** — zoom. 0.01-300+ for extreme range.
- **`.rotate(angle)`** — always pass explicit angle. Common: `0`, `0.5 * pi`, `pi`.
- **`.invert(0 or 1)`** — binary toggle, often Tidal-driven.

### Modulation (animation engine)
- **`.modulateRepeatX/Y(source, offset, amount)`** — animated tiling deformation.
- **`.modulateScale(source, amount)`** — per-pixel zoom from texture.
- **`.modulateScrollX/Y(source, offset, amount)`** — warped displacement.
- **`.modulateRotate(source, amount)`** — per-pixel rotation.
- **`.modulatePixelate(source, amount)`** — variable resolution.

### Compositing
- **`.blend(source, opacity)`** — linear mix. Opacity 0.2-0.9 typical.
- **`.layer(source)`** — alpha-based overlay.
- **`.mask(source)`** — luminance mask. Bright = visible, dark = transparent.

---

## Parameter Ranges (Tested Values)

| Parameter | Conservative | Moderate | Extreme |
|-----------|-------------|----------|---------|
| shape sides | 2-4 | 4-20 | 20-90 |
| shape size | 0.3-0.7 | 0.1-0.9 | 0.001-0.01 |
| repeatX/Y | 2-10 | 10-40 | 100-400+ |
| scroll speed | 0.01-0.5 | 0.5-5 | 5-100 |
| scroll distance | 0.2-1 | 1-3 | 3-8 |
| scale | 0.5-2 | 2-10 | 10-300 |
| modulate amount | 1-10 | 10-40 | 40-100+ |
| blend opacity | 0.2-0.5 | 0.5-0.8 | 0.8-1.0 |

---

## Color Philosophy

**Default: monochrome/grayscale.** Most sketches rely on geometry, masking, and tiling for visual interest — not saturation.

When color appears, it's minimal and intentional:
```javascript
.color(.4, .6, .7)    // cool cyan accent
.color(1, 0, 0.9)     // hot magenta
.color(4)              // values > 1 = clipping/blow-out (intentional)
```

Inversion is a primary color tool — toggled on transients:
```javascript
gen1invert = gen1invert == 1 ? 0 : 1
// ...
.invert(() => gen1invert)
```

---

## Multi-Buffer Strategy

Use all 4 outputs as layers in a compositing pipeline:

```javascript
// o0: primary geometry
shape(4, () => s1).repeatX(() => r1).out(o0)

// o1: secondary texture / mask source
noise(3).mask(shape(2)).out(o1)

// o2: modulation source or alternate geometry
osc(10).modulateScale(noise(5), 10).out(o2)

// o3: final composite
src(o0)
  .blend(src(o1), () => blend0)
  .blend(src(o2), () => blend1)
  .out(o3)

render(o3)
```

Each buffer = one visual layer. Final buffer blends them with reactive opacity.

---

## Animation Techniques

### Time-based (always running)
```javascript
({time}) => Math.sin(time) * 100      // smooth oscillation
({time}) => 1 / Math.sin(time) * 0.4  // inverse sine — spiky
({time}) => Math.sin(time * 0.5)       // slow breathe
```

### Tidal-driven (event triggered)
```javascript
// In /play2 handler:
move = tidal.gain * 3
grip = tidal.cutoff * 0.001
rate = tidal.freq * 0.01

// In chain:
.scrollX(() => move)
.scale(() => grip)
```

### Hybrid (Tidal + time)
```javascript
.modulateRepeatX(osc(({time}) => Math.sin(time) * 100), () => xrep)
```

---

## Idioms & Conventions

### Toggle via ternary
```javascript
gen1invert = gen1invert == 1 ? 0 : 1
```

### Pi constant
```javascript
pi = 3.1415
// Used for: .rotate(0.5 * pi), .rotate(pi)
```

### Arrow functions for ALL reactive params
```javascript
.repeatX(() => repeat1)    // YES — re-evaluated each frame
.repeatX(repeat1)          // NO — captured once at chain build
```

### Array-based parameter sequences
```javascript
.repeatX([2, 4, 8, 16])   // Hydra cycles through values
.repeatY([1, 3, 5])
```

### Commented-out alternatives
Keep alternative chains as comments for live switching:
```javascript
// shape(2, 0.5).repeatX(20).out(o0)
shape(4, 0.3).repeatX(40).mask(noise(3)).out(o0)
```

---

## Performance Rules

### Cheap (do freely)
- Arrow function evaluation (Math.sin, multiply, etc.)
- Color ops: brightness, contrast, saturate, color, invert
- Geometry: rotate, scale, scrollX/Y
- Chaining many simple operations (compiles to one shader)
- Source texture swaps: `s[i].init({src: element})`

### Expensive (use deliberately)
- Calling `.out()` — recompiles GLSL. Build once.
- Multiple active output buffers — each is a render pass
- Deep modulation nesting — `modulate(modulate(modulate(...)))` duplicates GLSL
- `noise()` inside `modulate()` — Perlin noise is costly per-pixel
- High resolution canvases — halve resolution for 4x speedup

### Identity values (disable without rebuild)
```javascript
.blend(src(o1), 0)       // passes through original
.add(src(o1), 0)         // passes through original
.modulate(src(o1), 0)    // no displacement
.brightness(0)           // no change
.contrast(1)             // no change
.saturate(1)             // no change
.invert(0)               // no change
.rotate(0, 0)            // no change
.scale(1, 1, 1, 0.5, 0.5) // no change
```

### No identity (must conditionally include)
- `luma()` — always extracts luminance
- `thresh()` — always binarizes

---

## Gotchas

1. **`.out()` recompiles GLSL** — never per-frame, only on structural changes.
2. **`src()` does NOT accept arrow functions** — use `s[i].init()` for dynamic sources.
3. **`thresh()` and `luma()` have no identity** — can't disable without chain rebuild.
4. **`rotate()` default is 10 radians** (~573 degrees) — always pass explicit angle.
5. **`noise()` outputs negative values** — may need brightness/contrast to normalize.
6. **Arrow functions are re-evaluated by Hydra's internal loop** — you don't re-call `.out()`.
7. **Hydra duplicates GLSL across blend branches** — a modulate chain used in `.diff()` compiles twice.

---

## Sketch Naming

- **etude[N].js** — progressive study series (numbered sequentially, variants as N.1)
- **[date].js** — one-off experiments (format: M-DD-YY or MDD)
- **[date]_[N].js** — variants of a dated sketch

---

## Aesthetic Summary

The style across these sketches is:

- **Geometric / structural** — shape-based, not organic noise fields
- **Monochrome dominant** — grayscale with rare, intentional color
- **Dense repetition** — extreme tiling creates moire and interference patterns
- **Tidal-reactive** — parameters driven by musical events, not continuous audio FFT
- **Multi-layer composition** — 4 buffers blended with reactive opacity
- **Inversion as expression** — binary color flips as a primary visual gesture
- **Restrained palette, extreme geometry** — visual complexity comes from spatial transforms, not color
