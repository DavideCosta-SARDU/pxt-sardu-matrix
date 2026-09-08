# Display configuration

[Italiano](_locales/it/display-configuration.md)

SARDU-Matrix can configure the display from its overall dimensions or from a grid of identical physical modules. Both methods create the same logical coordinate system for pixels, text, graphics, scrolling and effects.

## Direct dimensions

Use `create(width, height, pin, brightness)` when the complete display is one rectangular surface. The default data pin is P1 and the default brightness is 128; both remain editable.

```blocks
let matrix = sarduMatrix.create(32, 16, DigitalPin.P1, 128)
```

Use `createAdvanced` when the first pixel, scan axis or progressive/ZigZag path differs from the standard layout.

## Predefined modules

Use `createModules` for a horizontal chain of identical panels. The available module sizes are 8×8, 16×16, 32×8, 8×32, 16×8 and 8×16.

```blocks
let matrix = sarduMatrix.createModules(6, MatrixModuleType.Matrix16x16, DigitalPin.P1, 128)
```

This creates a 96×16 logical display. Use `createModulesAdvanced` for a rectangular module grid or to configure the pixel path and module path independently.

## Origin, scan axis and path

- **Origin** identifies the corner containing the first LED.
- **Scan axis** selects rows or columns as the primary direction.
- **Path** selects progressive or alternating ZigZag wiring.

Pixel-path settings describe the wiring inside a module. Module-path settings describe how modules are connected to each other. The configuration should reproduce the physical wiring; drawing coordinates should remain logical.

## Common layouts

- One 16×16 module produces a 16×16 display.
- Two 16×16 modules in one row produce 32×16.
- Six 16×16 modules in one row produce 96×16.
- Twelve 16×16 modules in two rows produce 96×32.

## Invalid configurations

Widths, heights, module counts and module rows must be positive integers. The module count must divide evenly by the number of module rows. Invalid values stop with panic code `920` instead of creating a partial buffer.

## Memory and board choice

Memory use grows with the total number of LEDs. Micro:Bit V1 remains suitable for normal projects with smaller displays and selected feature families; Micro:Bit V2 is recommended for large matrices and memory-intensive effects. See [Memory, rendering and physical limits](memory-and-rendering.md).

After configuration, verify the first pixel, opposite corner and every module boundary by following the [wiring guide](wiring.md).
