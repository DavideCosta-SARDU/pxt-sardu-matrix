# TypeScript test suite

SARDU-Matrix uses independent MakeCode projects so every feature family can be compiled for both micro:bit V1 and V2 without creating one unrealistic firmware containing every renderer and animation at once.

The root `test.ts` is a representative public API smoke program for V1/V2, including static text, geometry, both immediate text scrolling APIs and sparkles. Build it from the extension root with `pxt build` and `pxt build --hwvariant v2`; load it in the MakeCode simulator without hardware. It must finish without a panic or simulator error. Executable coverage is divided as follows:

| Project | Coverage |
| --- | --- |
| `basic` | matrix creation, pixels, brightness, buffer/display clearing and `show` |
| `configuration` | all four public creation methods and reported dimensions |
| `core` | all mapping combinations, module layouts, fonts and RGB/HSL conversion |
| `text-shapes` | six fonts, four orientations, centering, static geometry, all icons and native 8×8 graphics |
| `scrolling` | immediate, edge and coordinate-path text scrolling |
| `scrolling-queued` | queued text, path text and all scrolling geometry |
| `gradients` | deterministic color interpolation plus static and scrolling text gradients |
| `effects` | deterministic effect helpers plus fade, blink, wipe, opposed wipe, rainbow and sparkles |
| `graphics` | all six native graphic dimensions, transparency and replacement mode |
| `tutorial` | exact final English tutorial program |

## Compile procedure

Run `python tests/check-metadata.py` from the extension root to check block signatures, English/Italian placeholders, shadow references and Help paths without additional Python dependencies.

Run these commands inside every project directory:

```shell
pxt install
pxt build
pxt build --hwvariant v2
```

On Windows, `tests\\run-all.cmd` performs the same complete sequence for every listed project and stops at the first error.

A compile pass requires both builds to finish without an error. A deterministic runtime failure calls `control.panic(921)`.

## Verified compilation and hardware record

The ten independent feature projects compiled for V1 and V2 during the October approval-correction work. The 1.0.0 release preserves the v0.9.0 executable algorithms; its root V1/V2 builds, block metadata, real editor conversions and affected V2 hardware behaviors were checked separately. A compilation result is not a physical test or a measured RAM capacity. Repeat checks affected by later source changes.

The monolithic `pxt test` command is not used as the feature runner because it links the complete extension package and its own harness into one synthetic V1 image regardless of how few entry-point instructions are present. That artificial image exceeds the V1 program-size limit; that result alone does not determine whether a particular user program fits on V1. The independent projects prove this by compiling creation, configuration, text, geometry, scrolling, gradients, effects and graphics separately for both V1 and V2.

## Hardware boundary

Compilation and deterministic tests cannot validate panel wiring, electrical power, physical mapping, color output or animation appearance. Those checks follow `docs/testing.md` on a real single panel and a multi-panel chain. Hardware-only observations must never be recorded as automated passes.
