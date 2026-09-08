# Matrix wiring

## Safety first

Do not power an LED matrix from the micro:bit 3V pin. Use an external supply suitable for the panel current, connect the supply ground to micro:bit GND and apply suitable wiring, fusing and power injection.

## Data chain

Connect the selected micro:bit data pin (P1 by default) to `DIN` of the first panel. Connect each panel's `DOUT` to `DIN` of the next panel. The software must describe the same order as the physical chain.

## Pixel path inside a module

Configure three independent properties:

- the corner containing the first LED;
- whether the primary scan follows rows or columns;
- whether each row/column is progressive or alternates in a ZigZag pattern.

## Module path

For a grid of panels, configure the first module corner, module scan axis and progressive/ZigZag order separately from the pixel path inside a module.

## Reference arrangements

- One 16×16 module: `moduleCount = 1`, `moduleRows = 1`.
- Two modules in one row: `moduleCount = 2`, `moduleRows = 1`, producing 32×16.
- Six modules in one row: `moduleCount = 6`, `moduleRows = 1`, producing 96×16.
- Six modules in two rows: `moduleCount = 12`, `moduleRows = 2`, producing 96×32.

## Visual verification

Before using text or effects:

1. illuminate logical pixel `(0, 0)` and identify the physical first pixel;
2. illuminate the opposite corner;
3. test the first and last pixel of every module;
4. draw one horizontal and one vertical line;
5. correct origin, axis and path until every coordinate matches;
6. only then test text, scrolling and effects.

An unexpected pixel on a disconnected or unused module indicates that the configured LED count, physical chain or power state does not match the intended display.

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.8.4
```
