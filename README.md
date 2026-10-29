# sardu-matrix

SARDU-Matrix is a configurable RGB LED matrix extension for Microsoft MakeCode and micro:bit. It uses the official Microsoft `pxt-neopixel` extension as its RGB backend.

Version 1.0.0 establishes the documented public API. Representative programs compile for micro:bit V1 and V2; the tested V2 configuration uses six 16×16 panels in a 96×16 display. The [test record](docs/testing.md#verified-release-history) distinguishes compilation, editor and physical results.

## micro:bit V1 and V2

Both boards support the extension. V1 has less program memory and RAM: a program combining all blocks can exceed its firmware limit even when individual features compile. The RGB buffer alone needs `width × height × 3` bytes; composed scrolling and some effects also need temporary copies. Large displays or programs combining many effects should use V2. See [memory and rendering](docs/memory-and-rendering.md).

The coordinate-based scrolling block starts at X = 16 by default. For a different display width, connect the matrix width block to X as a normal value block, or use **scroll text from edge** to position text automatically.

Projects created before v0.9.0 must update enum type names from `Matrix…` to `SarduMatrix…`. For Blocks projects, follow the [update procedure](docs/api.md#updating-existing-projects) before changing the extension version.

Since v0.9.0, the package identifier is `pxt-sardu-matrix`, matching the repository and the dependency created by MakeCode tutorials. Existing projects using the old `sardu-matrix` dependency key must rename that key in `pxt.json` while keeping its version reference, so block Help can resolve the included documentation. The `sarduMatrix` programming namespace is unchanged.

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
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
```

This method is independent of module sizes and module rows.

### Preset modules

Choose the number and physical type of identical modules. The default is one 16×16 module.

```blocks
let matrix = sarduMatrix.createModules(
    2,
    SarduMatrixModuleType.Matrix16x16,
    DigitalPin.P1,
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
    SarduMatrixFont.Sardu,
    SarduMatrixFontSize.X1,
    128
)
matrix.show()
```

`clear()` immediately clears both buffer and physical display. `clearBuffer()` only changes memory and is available under advanced blocks. `setPixel()` and `drawText()` do not call `show()` automatically. Coordinates outside the logical display are safely clipped. The manual `scrollText()` block starts at the selected X/Y coordinates and moves left. The simpler edge block can enter from the right, left, top or bottom and automatically centers the line on the other axis. Either animation can be stopped by `interruptAndClear()` from a button or radio event.

The text blocks offer six fonts: SARDU, micro:bit Extended, proportional versions of both, SARDU Compact and SARDU Compact Proportional. Each can be rendered at 1×, 2×, 3× or 4×. The SARDU fonts distinguish uppercase and lowercase and support printable ASCII, common accented Latin letters (`À`–`ÿ`, including `Œ/œ` and `Ÿ`) and selected symbols (`€ £ © ® ° × ÷ ¿ ¡`). The micro:bit choices use the official 5×5 base glyphs and add room for accents or cedilla.

Static and scrolling text can rotate the complete rendered line to 0°, 90° clockwise, 180° or 270° clockwise. Rotation is independent from the scrolling edge, so all 16 combinations are available. Static text can use explicit X/Y coordinates, be centered across the complete width, complete height or both, or be centered inside an advanced inclusive X/Y range. Centering uses the dimensions after rotation. Every string also has its own 0–255 brightness, independent from the matrix-wide brightness selected during creation.

Scrolling offers two scene modes. **clear display** (`Exclusive` in code) clears the display for every frame and finishes with a black display. **preserve background** (`Composed` in code) preserves the pixels already drawn, restores them behind the moving text and finishes with the original scene visible.

Lines, rectangles and circles, with outline and filled variants, use the same logical coordinates and clipping as pixels and text. Static geometry changes only the buffer and requires `show()`. Scrolling geometry can run by itself or be queued after text; add the desired items and call `startScrolling()` once to move the complete sequence as one composition. Custom text paths can also be queued and start only when `startScrolling()` is called.

Colors can come from the MakeCode/NeoPixel picker, from explicit RGB components, or from HSL fields. RGB uses 0–255. HSL uses hue 0–360 and saturation/lightness 0–100. HSL lightness changes the color itself and is distinct from matrix or string brightness.

The native **Graphics** blocks are available under `... more` in all six module formats. Their cells are edited directly in MakeCode: hollow cells are transparent, while black explicitly turns an LED off. Overlay preserves the scene below transparent cells; replace-area clears them.

## Block/API overview

The main category contains matrix creation, display controls, pixels and colors. **Text**, **Geometry**, **Graphics** and **Effects** subcategories keep related blocks together; Graphics also contains icons. Advanced settings remain available with their related controls; native pixel grids are in Graphics. Static and scrolling text blocks expose their extra options with (+), preserving the same defaults and per-block settings.

Static text, static geometry, pixels and Graphics write to the RGB buffer; compose the scene and call `show()` once. Immediate text scrolling starts at once. To combine text and shapes into one moving sequence, add every item to the scrolling composition and call `startScrolling()` only once. Effects animate the current buffer directly and provide leave, restore and clear final states. Full block behavior, defaults and troubleshooting are documented in the [English user guide](docs/user-guide.md), the [Italian user guide](docs/_locales/it/user-guide.md) and the topic pages below.

Gradient text can either blend two selected colors or keep one color while blending between independently selected initial and final brightness levels. Both variants work across the visible glyphs from left, right, top or bottom and are placed after the standard static-text blocks. Built-in 8 x 8 icons include hearts, faces, a star, check, cross, arrows, sun, moon and lightning; they can be positioned, colored and scaled without a second framebuffer.

### Complete example

```typescript
// Create one 16 x 16 panel with a prudent global brightness.
let matrix = sarduMatrix.createModules(1, SarduMatrixModuleType.Matrix16x16, DigitalPin.P1, 128)

// Compose two elements in memory, then update the LEDs once.
matrix.drawTextCenteredWidth("Hi", 0, NeoPixelColors.White, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
sarduMatrix.drawIcon(matrix, SarduMatrixIcon.FilledHeart, 4, 8, NeoPixelColors.Red, 1, 128)
matrix.show()
```

## Dynamic memory use

The six-panel test is not a maximum module-count specification. The [standard-module RAM table](docs/memory-and-rendering.md#standard-modules-ram-cost-per-module) lists exact RGB payload costs and the measured configuration. There is no arbitrary 1536-LED limit. One RGB NeoPixel buffer is allocated using:

```text
RGB bytes = width × height × 3
```

The actual maximum depends on the micro:bit revision, MakeCode runtime, the rest of the program and other extensions. An allocation that does not fit fails explicitly; the library does not silently reduce dimensions.

Exclusive scrolling adds no second RGB scene buffer. Composed scrolling temporarily copies the existing NeoPixel buffer, so during that animation it requires another `width × height × 3` bytes. The copy is temporary animation data rather than a second permanent framebuffer. On micro:bit V1, prefer exclusive mode or small matrices when memory is tight.

micro:bit V2 is recommended for special effects, especially on large matrices. Fade, content-masked effects and animated rainbows use temporary RGB snapshots while running; V1 has substantially less firmware and RAM margin.

## Wiring and power safety

Connect the micro:bit data pin to `DIN` of the first panel, then connect each panel's `DOUT` to the next panel's `DIN` in the configured order.

**Do not power a matrix from the micro:bit 3 V pin.** Use an external supply suitable for the real panels and connect a common ground between the supply, every panel and the micro:bit. Power sizing, wiring, injection points, fusing and installation compliance remain the user's responsibility. Software brightness is not a substitute for correct electrical design.

See [docs/wiring.md](docs/wiring.md) for diagrams and mapping examples.

## Documentation

- [English user guide](docs/user-guide.md)
- [Italian user guide](docs/_locales/it/user-guide.md)
- [Interactive MakeCode tutorial](https://makecode.microbit.org/#tutorial:https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/tutorial) — [read the steps](tutorial.md)
- [Tutorial in italiano](https://makecode.microbit.org/?lang=it#tutorial:https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/tutorial)
- [Project and educational use](docs/project-and-education.md)
- [Documented test procedure](docs/testing.md)
- [Display configuration](docs/display-configuration.md)
- [Public API](docs/api.md)
- [Wiring](docs/wiring.md)
- [Memory and rendering](docs/memory-and-rendering.md)
- [Fonts and text measurements](docs/fonts.md)
- [Native Graphics blocks](docs/graphics.md)
- [Static and scrolling geometry](docs/shapes.md)
- [Special effects](docs/effects.md)
- [Gradient text and built-in icons](docs/gradient-and-icons.md)

## Languages

English is the source and fallback language. Italian block strings, API help pages and the interactive tutorial are included in the package. Additional block-string translations remain available and can be reviewed for a later release.

## License

MIT, Copyright (c) 2026 Davide Costa <davide@sardu.pro>.

Project website: [SARDU](https://www.sardu.pro/). SARDU-Matrix itself is a free educational project for generic commercial WS2812B/NeoPixel panels; it is not bundled with a proprietary accessory.

## Supported targets

- for PXT/microbit
