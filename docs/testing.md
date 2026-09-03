# Test procedure

This page documents the automated, compilation and physical checks used for SARDU-Matrix. A release passes only when all applicable checks complete without a compiler error, panic, unexpected lit pixel or visual mismatch.

## Automated checks

The root `test.ts` verifies deterministic code that can run without a physical panel:

- exhaustive uniqueness and bounds for all 16 origin/axis/path combinations on an 8 x 8 surface;
- modular mapping uniqueness, complete coverage and out-of-range clipping on a 2 x 2 module grid;
- a known extended-font column;
- effect-buffer interpolation;
- deterministic effect random generation;
- rainbow content masking and brightness preservation;
- two-color gradient endpoints and midpoint;
- single-color brightness-gradient endpoints and midpoint.

Failure calls `control.panic(921)`. `pxt checkpkgcfg` must also report no configuration, file-list or test-file error.

## Compilation checks

Before publishing a candidate:

1. compile a realistic 16 x 16 user project for Micro:Bit V1;
2. compile the same project for Micro:Bit V2;
3. instantiate `Matrix` and call every API introduced by that candidate with `show()` where appropriate;
4. remove the temporary project before committing;
5. run the package configuration and whitespace checks.

Both builds must finish without an error. Special effects on large displays remain recommended for V2 because a successful small V1 build does not guarantee enough RAM for every matrix size and user program.

## MakeCode and hardware checks

Import the exact candidate or release URL into a fresh MakeCode project, then verify:

1. the category and groups appear in the documented order;
2. block labels, defaults, selectors and expandable parameters are readable;
3. Blocks-to-TypeScript conversion produces no error;
4. direct and modular creation match the connected display dimensions;
5. first pixel, last pixel and every module boundary use the expected physical position;
6. static text covers the fonts, sizes, centering and four rotations;
7. immediate scrolling covers the four entry edges and exclusive/composed modes;
8. queued text and geometry move as one composition after one `start scrolling` call;
9. static geometry, built-in icons and native Graphics preserve clipping and transparency;
10. both gradient types use all four directions and preserve the selected background;
11. fade, blink, wipe, collision, rainbow and sparkles affect the documented content;
12. interruption clears the active animation;
13. default brightness is visually prudent and the brightness gradient defaults to 128 and 8.

For a physical chain, repeat the mapping checks on at least one single panel and one multi-panel display. The current release has also been exercised on a 96 x 16 six-panel chain.

## Pass/fail record

Record the exact commit or tag, Micro:Bit revision, matrix arrangement, data pin and power configuration. A pass requires all tested pixels and frames to match the expected positions, colors and final states. Any unexplained pixel, missing group, compile failure or incorrect final state is a failure and blocks promotion of that commit.
