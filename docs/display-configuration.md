# Display configuration

SARDU-Matrix supports direct logical dimensions and predefined physical modules. Both methods produce the same logical coordinate system used by pixels, text, graphics, scrolling and effects.

## Direct dimensions

Use `create(width, height, pin, brightness)` when the complete display can be described as one rectangular surface. The standard physical path starts at the top-left corner, scans columns and follows a ZigZag path.

```blocks
let matrix = sarduMatrix.create(32, 16, DigitalPin.P1, 128)
```

Use `createAdvanced` when the physical origin, scan axis or progressive/ZigZag path differs.

## Predefined modules

Use `createModules` for a horizontal chain of equal panels. Available module sizes are 8×8, 16×16, 32×8, 8×32, 16×8 and 8×16.

```blocks
let matrix = sarduMatrix.createModules(6, MatrixModuleType.Matrix16x16, DigitalPin.P1, 128)
```

This example creates a 96×16 logical display. The module count is not a maximum.

Use `createModulesAdvanced` for a rectangular module grid or when pixel order inside each module and module order across the grid need separate configuration.

## Origins, scan axes and paths

- Origin: top-left, top-right, bottom-left or bottom-right.
- Scan axis: rows or columns.
- Path: progressive or ZigZag.

Pixel-path settings describe wiring inside each module. Module-path settings describe how modules are connected to one another. Do not compensate for incorrect wiring by changing logical drawing coordinates.

## Validation

Widths, heights, module counts and module rows must be positive integers. The module count must divide evenly by the selected number of module rows. Invalid configuration stops with panic code `920` instead of allocating a partial or misleading buffer.

## Pin and brightness

The data pin is selectable; the default is P1. It is used as the WS2812B/NeoPixel digital data output. Initial brightness defaults to 128 and remains adjustable.

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.8.4
```
