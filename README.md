# SARDU-Matrix

SARDU-Matrix is a configurable RGB LED matrix extension for Microsoft MakeCode and micro:bit. It uses the official Microsoft `pxt-neopixel` extension as its RGB backend.

This is a pre-1.0 implementation. The software builds and its mapping tests pass in the MakeCode simulator; real hardware validation is still required before a stable release.

## Installation in MakeCode

1. Open [MakeCode for micro:bit](https://makecode.microbit.org/).
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
let matrix = sarduMatrix.create(16, 16, DigitalPin.P0)
```

This method is independent of module sizes and module rows.

### Preset modules

Choose the number and physical type of identical modules. The default is one 16×16 module.

```blocks
let matrix = sarduMatrix.createModules(
    2,
    MatrixModuleType.Matrix16x16,
    DigitalPin.P0
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
matrix.drawText("Hello, città!", 0, 4, neopixel.colors(NeoPixelColors.Red))
matrix.show()
```

`clear()` immediately clears both buffer and physical display. `clearBuffer()` only changes memory and is available under advanced blocks. `setPixel()` and `drawText()` do not call `show()` automatically. Coordinates outside the logical display are safely clipped. `scrollText()` starts at the selected X/Y coordinates, moves left and can be stopped by `interruptAndClear()` from a button or radio event.

The standard compact font is monospaced 6×8: five visible columns plus spacing. It distinguishes uppercase and lowercase, supports printable ASCII, common accented Latin letters (`À`–`ÿ`, including `Œ/œ` and `Ÿ`) and selected symbols (`€ £ © ® ° × ÷ ¿ ¡`). Unsupported characters are displayed as `?`. Additional font choices will be designed separately before release.

## Dynamic memory use

There is no arbitrary 1536-LED limit. One RGB NeoPixel buffer is allocated using:

```text
RGB bytes = width × height × 3
```

The actual maximum depends on the micro:bit revision, MakeCode runtime, the rest of the program and other extensions. An allocation that does not fit fails explicitly; the library does not silently reduce dimensions.

## Wiring and power safety

Connect the micro:bit data pin to `DIN` of the first panel, then connect each panel's `DOUT` to the next panel's `DIN` in the configured order.

Do not power a matrix from the micro:bit 3V pin. Use an external supply suitable for the real panels and connect a common ground between the supply, every panel and the micro:bit. Power sizing, wiring, injection points, fusing and installation compliance remain the user's responsibility. Software brightness is not a substitute for correct electrical design.

See [docs/wiring.md](docs/wiring.md) for diagrams and mapping examples.

## Documentation

- [Display configuration](docs/display-configuration.md)
- [Public API](docs/api.md)
- [Wiring](docs/wiring.md)
- [Memory and rendering](docs/memory-and-rendering.md)
- [Migration from pxt-smartmatrix](docs/migration.md)

## Languages

English is the source and fallback language. Block and API-description translations are included for Italian, German, Spanish (Spain), French, Japanese and Chinese.

## License

MIT, Copyright (c) 2026 Davide Costa <davide@sardu.pro>.
