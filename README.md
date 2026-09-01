# SARDU-Matrix

SARDU-Matrix is a configurable RGB LED matrix extension for Microsoft MakeCode and Micro:Bit. It uses the official Microsoft `pxt-neopixel` extension as its RGB backend.

This is a pre-1.0 implementation. The software builds and its mapping tests pass in the MakeCode simulator; real hardware validation is still required before a stable release.

## Installation in MakeCode

1. Open [MakeCode for Micro:Bit](https://makecode.microbit.org/).
2. Create or open a project.
3. Select **Extensions** in the toolbox.
4. Paste this repository URL into the search box:

```text
https://github.com/DavideCosta-SARDU/pxt-sardu-matrix
```

5. Select **SARDU-Matrix**. The **SARDU Matrix** category is then added to the Blocks toolbox.

Until the extension is approved for MakeCode search results, use the complete repository URL.

## Configuration methods

SARDU-Matrix offers two alternative creation methods.

### Total display dimensions

Use the logical width and height of the complete display. The default is 16×16.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P0, 128)
```

This method is independent of module sizes and module rows.

### Preset modules

Choose the number and physical type of identical modules. The default is one 16×16 module.

```blocks
let matrix = sarduMatrix.createModules(
    2,
    MatrixModuleType.Matrix16x16,
    DigitalPin.P0,
    128
)
```

The basic block places modules in one horizontal row. Available presets are 8×8, 16×16, 32×8, 8×32, 16×8 and 8×16.

Advanced creation blocks can configure module rows and two independent physical paths:

- pixel order inside every module;
- module order across the rectangular grid.

Each path selects its starting corner, row/column scan axis and progressive/ZigZag order. A module grid must be complete, so the module count must be exactly divisible by the selected row count.

## Drawing

Changes are written to the RGB buffer. Call `show()` when the physical LEDs must be updated.

```blocks
matrix.clearBuffer()
matrix.drawText(
    "Hello, città!", 0, 4,
    sarduMatrix.rgbColor(255, 40, 0),
    MatrixFont.Sardu,
    MatrixFontSize.X1,
    128
)
matrix.show()
```

`clear()` immediately clears both buffer and physical display. `clearBuffer()` only changes memory and is available under advanced blocks. `setPixel()` and `drawText()` do not call `show()` automatically. Coordinates outside the logical display are safely clipped. The manual `scrollText()` block starts at the selected X/Y coordinates and moves left. The simpler edge block can enter from the right, left, top or bottom and automatically centers the line on the other axis. Either animation can be stopped by `interruptAndClear()` from a button or radio event.

The text blocks offer three alternative fonts: SARDU, the extended Micro:Bit system style and SARDU proportional. Each can be rendered at 1×, 2×, 3× or 4×. The SARDU fonts distinguish uppercase and lowercase and support printable ASCII, common accented Latin letters (`À`–`ÿ`, including `Œ/œ` and `Ÿ`) and selected symbols (`€ £ © ® ° × ÷ ¿ ¡`). The extended Micro:Bit choice uses the official 5×5 base glyphs and adds an extra row for accents or cedilla.

Static and scrolling text can rotate the complete rendered line to 0°, 90° clockwise, 180° or 270° clockwise. Rotation is independent from the scrolling edge, so all 16 combinations are available. Static text can use explicit X/Y coordinates, be centered across the complete width, complete height or both, or be centered inside an advanced inclusive X/Y range. Centering uses the dimensions after rotation. Every string also has its own 0–255 brightness, independent from the matrix-wide brightness selected during creation.

Scrolling offers two scene modes. **Exclusive** clears the display for every frame and finishes with a black display. **Composed** preserves the pixels already drawn, restores them behind the moving text and finishes with the original scene visible.

Lines, rectangles and circles, with outline and filled variants, use the same logical coordinates and clipping as pixels and text. Static geometry changes only the buffer and requires `show()`. Scrolling geometry can run by itself or be queued after text; add the desired items and call `startScrolling()` once to move the complete sequence as one composition.

Colors can come from the MakeCode/NeoPixel picker, from explicit RGB components, or from HSL fields. RGB uses 0–255. HSL uses hue 0–360 and saturation/lightness 0–100. HSL lightness changes the color itself and is distinct from matrix or string brightness.

The native **Graphics** blocks are available under `... more` in all six module formats. Their cells are edited directly in MakeCode: hollow cells are transparent, while black explicitly turns an LED off. Overlay preserves the scene below transparent cells; replace-area clears them. The [standalone web editor](https://davidecosta-sardu.github.io/pxt-sardu-matrix/editor.html) remains an optional design and testing tool, not part of the normal MakeCode workflow.

## Dynamic memory use

There is no arbitrary 1536-LED limit. One RGB NeoPixel buffer is allocated using:

```text
RGB bytes = width × height × 3
```

The actual maximum depends on the Micro:Bit revision, MakeCode runtime, the rest of the program and other extensions. An allocation that does not fit fails explicitly; the library does not silently reduce dimensions.

Exclusive scrolling adds no second RGB scene buffer. Composed scrolling temporarily copies the existing NeoPixel buffer, so during that animation it requires another `width × height × 3` bytes. This copy is released when scrolling ends. On Micro:Bit V1, prefer exclusive mode or small matrices when memory is tight.

## Wiring and power safety

Connect the Micro:Bit data pin to `DIN` of the first panel, then connect each panel's `DOUT` to the next panel's `DIN` in the configured order.

Do not power a matrix from the Micro:Bit 3V pin. Use an external supply suitable for the real panels and connect a common ground between the supply, every panel and the Micro:Bit. Power sizing, wiring, injection points, fusing and installation compliance remain the user's responsibility. Software brightness is not a substitute for correct electrical design.

See [docs/wiring.md](docs/wiring.md) for diagrams and mapping examples.

## Documentation

- [Display configuration](docs/display-configuration.md)
- [Public API](docs/api.md)
- [Wiring](docs/wiring.md)
- [Memory and rendering](docs/memory-and-rendering.md)
- [Graphic editor and Graphics blocks](docs/graphics.md)
- [Static and scrolling geometry](docs/shapes.md)
- [RGB matrix simulator and approval status](docs/simulator.md)
- [Migration from pxt-smartmatrix](docs/migration.md)

## Languages

English is the source and fallback language. During the current development phase the package includes Italian only; German, Spanish (Spain), French, Japanese and Chinese will be updated together before the stable release.

## License

MIT, Copyright (c) 2026 Davide Costa <davide@sardu.pro>.

## Supported targets

- for PXT/microbit
