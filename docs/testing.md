# Verification and test procedure

[Italiano](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v1.0.0/docs/_locales/it/testing.md)

This page defines the automated, compilation, simulator and physical checks for SARDU-Matrix. A release passes only when every applicable check finishes without a compiler error, panic, unexpected pixel or visual mismatch.

## Test structure

The root `test.ts` is a representative public API smoke program covering creation, dimensions, RGB/HSL colors, pixels, static text, geometry, immediate scrolling and sparkles. A deterministic failure calls `control.panic(921)`. Build it with `pxt build` and `pxt build --hwvariant v2`; load it in the MakeCode simulator without physical hardware. The independent projects under [`tests/`](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v1.0.0/tests/README.md) provide broader coverage without forcing every renderer and animation into a single V1 image. The monolithic `pxt test` harness remains a different compilation mode and must not be confused with the representative program.

The projects cover:

- direct and modular configuration, dimensions and every origin/axis/path mapping combination;
- RGB/HSL conversion, brightness scaling, all fonts and all text orientations;
- static text, centering, geometry, built-in icons and six native graphic dimensions;
- immediate scrolling, exact coordinate paths, queued text and queued geometry;
- two-color and brightness gradients for static and scrolling text;
- fade, blink, directional and opposed wipes, rainbow and sparkle effects;
- display-buffer operations, clipping, transparency and replacement mode.

Deterministic failures call `control.panic(921)`.

## Compilation checks

Run `python tests/check-metadata.py` from the extension root to check block signatures, English/Italian placeholders, shadow references and Help paths. This structural check does not replace the manual editor conversions below.

For every directory listed in `tests/README.md`, run:

```shell
pxt install
pxt build
pxt build --hwvariant v2
```

Then run from the extension root:

```shell
pxt checkpkgcfg
pxt build
git diff --check
```

A compilation pass requires every independent project to build for both V1 and V2, with no TypeScript or package-configuration error. The source package must also build without changing runtime files merely to satisfy a test.

## Simulator checks

Open each independent project in public MakeCode. A local simulator may be used only if its target supports the required NeoPixel pin APIs; an unsupported local API is a blocked test, not a pass. Check for application exceptions, panics or unintended permanent loops, and record the known simulator-part and stock warnings separately. Effect durations and scroll intervals in the automated projects are deliberately zero or minimal.

The simulator validates control flow and buffer operations. It does not prove physical LED order, electrical behavior or real animation timing.

## MakeCode editor checks

Import the exact candidate or release into a fresh project and verify:

1. the category and groups appear in the documented order;
2. block labels, defaults, selectors and expandable parameters are readable;
3. start from a new project with blocks dragged from the toolbox and connected; test Blocks → JavaScript → Blocks and Blocks → Python → Blocks separately; repeat the JavaScript round trip twice for coordinate-based scrolling;
4. verify the receiver remains `matrix`, both untouched default colors and manually selected colors survive, command order and all parameters remain unchanged, and no gray blocks appear; test scrolling with both numeric X and a normally connected matrix-width block;
5. Blocks, JavaScript and Python conversions produce no error;
6. the English and Italian tutorial URLs load and every step exposes the required blocks.

## Physical hardware checks

Use an externally powered matrix with common ground and test at least one single panel and one multi-panel chain:

1. verify the first pixel, last pixel and every module boundary;
2. verify direct and modular dimensions and all wiring paths used by the hardware;
3. render static text using every font, size and orientation required by the release;
4. verify immediate scrolling from all four edges and both background modes;
5. confirm queued text and geometry move simultaneously after one `start scrolling` call;
6. verify clipping, native-graphic transparency, icons and both gradient families;
7. verify fade, blink, wipes, rainbow and sparkles affect the intended content and final state;
8. interrupt an active animation and confirm that the display clears;
9. confirm prudent brightness and absence of unexplained pixels after power cycling.

## Pass/fail record

Record the exact commit or tag, micro:bit revision, matrix arrangement, data pin and power configuration. A pass requires all compiled projects and tested frames to match the expected result. Any compiler error, panic, unexplained pixel, missing group, broken conversion or incorrect final state is a failure and blocks promotion of that commit.

## Verified release history

The 1.0.0 preparation is based on hardware candidate `7f560094216797569e520be6e9dabbc13e63656b`. On 28 October, checks covered EN/IT categories and layouts, default and selected values, expanding/collapsing options and JavaScript/Python conversions preserving up to 50 blocks. The mixed-project simulator shows both matrix P1 and independent NeoPixel strip P2; matrix-only projects retain the standard-factory diagnostic. Stock warnings are recorded separately from application errors.

On 29 October, Davide confirmed on a micro:bit V2 with six horizontal 16×16 panels (96×16), P1: white scrolling through every panel; static red/green lines at Y=0/Y=8; interruption with A and restart with B. External power and common ground are the previously verified wiring configuration. V1 coverage remains compilation only. These checks do not establish a maximum module count.

### Previous verification: 0.9.0

Release `v0.9.0` passed the approval-correction checks: real Blocks/JavaScript/Python round trips, Help, English/Italian tutorials and V1/V2 compilation. The rendering algorithms match hardware-tested candidate `c7c5307b96a5051f56a32991b944bfe30cfd3b02`. On 25 October 2026, Davide confirmed static RGB text, repeated scrolling with `matrix.width()` connected to X, and red-heart/purple-sparkles/background restoration on a micro:bit V2 with six horizontal 16×16 panels (96×16), P1, external power and common ground. These are representative hardware checks, not a claim that every API configuration was physically exercised. V1 was checked in compilation, not on hardware. The MakeCode NeoPixel-part simulator limitation remains; `hiddenParts` is disabled because a controlled P1/P2 experiment also hid an independent strip. Every later candidate must repeat the checks affected by its changes.

```package
pxt-sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v1.0.0
```
