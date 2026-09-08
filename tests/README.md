# TypeScript test suite

SARDU-Matrix uses independent MakeCode projects so every feature family can be compiled for both Micro:Bit V1 and V2 without creating one unrealistic firmware containing every renderer and animation at once.

The root `test.ts` is the lightweight package-checker entry point. Executable coverage is divided as follows:

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

Run these commands inside every project directory:

```shell
pxt install
pxt build
pxt build --hwvariant v2
```

On Windows, `tests\\run-all.cmd` performs the same complete sequence for every listed project and stops at the first error.

A compile pass requires both builds to finish without an error. A deterministic runtime failure calls `control.panic(921)`.

## Current candidate result

On 2026-09-08, all nine independent projects compiled successfully for both Micro:Bit V1 and V2. The candidate changes do not alter the verified `v0.8.3` runtime. The package configuration check and root package build also passed. These results must be repeated after any later source change.

The monolithic `pxt test` command is not used as the feature runner because it links the complete extension package and its own harness into one synthetic V1 image regardless of how few entry-point instructions are present. That artificial image exceeds the V1 program-size limit; ordinary V1 projects are not affected. The independent projects prove this by compiling creation, configuration, text, geometry, scrolling, gradients, effects and graphics separately for both V1 and V2.

## Hardware boundary

Compilation and deterministic tests cannot validate panel wiring, electrical power, physical mapping, color output or animation appearance. Those checks follow `docs/testing.md` on a real single panel and a multi-panel chain. Hardware-only observations must never be recorded as automated passes.
