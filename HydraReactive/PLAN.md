# HydraReactive — Audio-Reactive Hydra Video Synth

## Context

Replacing the Tidal Cycles OSC input from 20 old Hydra sketches with a Web Audio API-based system. The user makes ambient music — not beat-oriented but transients still matter. Single `index.html` deployed to GitHub Pages.

## Architecture

Single file: `HydraReactive/index.html` (~700 lines)

```
├── AudioEngine — Web Audio API analyser (mic default, file switch)
│   3 bands (bass/mid/high) + RMS energy + transient detector + silence detection
├── AudioMapper — maps audio → visual state (ADDITIVE, never multiplicative)
├── 3 Patch functions — each builds Hydra chains on o0-o3
├── PatchManager — switch patches via keyboard (1/2/3)
└── Controls overlay — Tab toggle, energy meter, source indicator
```

## 7 Implementation Phases

### Phase 1: HTML shell + AudioEngine
- Hydra via CDN (`unpkg.com/hydra-synth`), fullscreen canvas, controls overlay
- AudioEngine class: mic input (getUserMedia), FFT 2048, 3 bands, RMS, transient detect, silence detect
- Smoothing 0.06 (ambient-tuned), transient threshold 0.02, gamma lift pow(amp, 0.6)
- **Test:** energy meter responds to mic

### Phase 2: Hydra init + AudioMapper + visual state
- `new Hydra({ detectAudio: false })`, resize handler
- Global `v` object (repeatX/Y, shapeSize, scale, scroll, blend, inv, brightness, dimFactor)
- AudioMapper: additive modulation (`base + band * amount`), transient toggle with 0.92 decay
- Silence: dimFactor ramps 1→0.2 over ~2s, never fully black
- **Test:** console log `v` values responding to audio

### Phase 3: Patch 1 — "Grid Stutter"
Based on etude3/etude4.1. shape(4) grids, heavy repeatX/Y, modulateScale, inversion on transients.
- o0: primary grid (repeat + modulateScale + invert)
- o1: secondary grid (phase-shifted, scrollY)
- o2: modulation source (modulateScrollX + time-based)
- o3: composite (blend o0/o1/o2 with dimFactor)
- **Test:** visuals respond to audio, transient inverts, silence dims

### Phase 4: Patch 2 — "Recursive Stencil"
Based on 10-19-20, 526_2. Triple mask chains, noise source, cross-buffer masking.
- o0: noise field masked through shape stencils (audio drives noise freq)
- o1: shape(90) with organic mask chain
- o2: cross-masks o1, geometric frame
- o3: blend composite with reactive opacities
- **Test:** press "2", fractal apertures appear

### Phase 5: Patch 3 — "Frequency Shimmer"
Based on etude9/10. Frequency-driven modulation, phase-locked sin(time) blending.
- o0: shape(2) + modulateScrollY(osc(freq))
- o1: scrollY with frequency-driven speed
- o2: self-referencing modulateRepeatX (feedback-like) + invert
- o3: triple blend with sin(time) and 1/sin(time) phase locking
- **Test:** press "3", fluid responsive shapes

### Phase 6: PatchManager + keyboard + audio source toggle
- PatchManager.switch(n): solid().out() on all buffers, then build
- Keys: 1/2/3 patches, M mic/file toggle, Tab controls
- File input: Audio element + createMediaElementSource
- **Test:** full patch switching, file playback

### Phase 7: Polish + silence behavior + testing
- Patch-specific audio mapping ranges in AudioMapper
- Silence dimming refinement (asymmetric: dim slow, recover fast)
- Energy meter bar UI
- Performance verification (60fps, no per-frame .out() calls)

## Key Technical Decisions

- **Additive modulation** — multiplicative crushes to black on quiet passages (learned from DataverseVisuals)
- **Gamma lift** pow(amp, 0.6) — makes quiet ambient signals visible
- **Transient decay** 0.92/frame ≈ 500ms half-life — fires inversion toggle then fades
- **3 frequency bands** — bass (<200Hz) → scale/zoom, mid (200-2kHz) → scroll/displacement, high (2k+) → brightness
- **Energy envelope** (primary driver) — repeat density, modulation depth, blend opacity
- **solid().out() before patch switch** — prevents previous chain artifacts

## Reference Files

- `HYDRA_STYLE_GUIDE.md` — aesthetic rules (geometric, monochrome, dense repetition)
- `old/hydra_patches/etude3.js`, `etude4.1.js` — Patch 1 chain reference
- `old/hydra_patches/526_2.js`, `10-19-20.js` — Patch 2 chain reference
- `old/hydra_patches/etude9.js`, `etude10.js` — Patch 3 chain reference
- `old/DataverseVisuals/main.js` — AudioEngine patterns, additive modulation

## Verification

1. `python3 -m http.server` from HydraReactive/
2. Allow mic → Patch 1 reacts to voice
3. Clap → inversion flash decays over ~500ms
4. Silence 5s+ → gradual dim, never black
5. Keys 1/2/3 → distinct visual patches
6. M → load audio file, visuals respond to playback
7. Tab → controls overlay
8. Smooth 60fps throughout
