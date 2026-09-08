# Verification and test procedure

[Italiano](_locales/it/testing.md)

This page defines the automated, compilation, simulator and physical checks for SARDU-Matrix. A release passes only when every applicable check finishes without a compiler error, panic, unexpected pixel or visual mismatch.

## Test structure

The root `test.ts` is intentionally lightweight. The monolithic `pxt test` runner links the complete extension package and its harness into one synthetic V1 image regardless of the small entry point, so it is not representative of normal V1 programs. Executable TypeScript coverage is therefore divided into independent projects under [`tests/`](../tests/README.md); every real feature family compiles separately for V1 and V2 and each result remains attributable to that family.

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

Open each independent project in MakeCode or run it with the local target. It must not show an error, panic or permanent loop. Effect durations and scroll intervals in the automated projects are deliberately zero or minimal.

The simulator validates control flow and buffer operations. It does not prove physical LED order, electrical behavior or real animation timing.

## MakeCode editor checks

Import the exact candidate or release into a fresh project and verify:

1. the category and groups appear in the documented order;
2. block labels, defaults, selectors and expandable parameters are readable;
3. direct JavaScript and Python code decompile to Blocks with the original Matrix instance variable;
4. color parameters remain replaceable cyan color-picker shadows after JavaScript/Python to Blocks conversion;
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

Record the exact commit or tag, Micro:Bit revision, matrix arrangement, data pin and power configuration. A pass requires all compiled projects and tested frames to match the expected result. Any compiler error, panic, unexplained pixel, missing group, broken conversion or incorrect final state is a failure and blocks promotion of that commit.

The `v0.8.4` release keeps the runtime verified in `v0.8.3` and adds documentation, tutorials and the structured test suite. Its candidate was verified by the user, and the runtime was tested on a real 96×16 six-panel chain. Every later candidate must repeat the checks affected by its changes.
