# SARDU-Matrix user guide

SARDU-Matrix controls configurable WS2812B/NeoPixel matrix panels from Microsoft MakeCode for Micro:Bit. It supports direct dimensions, modular panels, multiple physical wiring paths, text, geometry, scrolling compositions, gradients, icons and effects.

## Before connecting hardware

Use a suitable external supply for the LED panels and connect the supply ground, panel ground and Micro:Bit ground together. Do not power a matrix panel from the Micro:Bit 3 V pin. Follow the [wiring guide](wiring.md).

The default data pin is P1 and the default brightness is 128. High brightness on many LEDs can require substantial current.

## Install the extension

In MakeCode, open **Extensions**, paste this repository address and select SARDU-Matrix:

```text
https://github.com/DavideCosta-SARDU/pxt-sardu-matrix
```

## Create the display

Choose one of the two creation approaches:

- **Create matrix**: enter the final logical width and height.
- **Create matrix from modules**: enter the number and type of equal modules.

Use the advanced creation blocks only when the real pixel or module wiring differs from the default top-left, column, ZigZag arrangement. Logical coordinate `(0, 0)` remains the top-left corner regardless of physical wiring.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
```

## Compose and show a static scene

Static text, geometry, pixels, icons and Graphics write to the matrix buffer. Add everything required and call **show matrix** once.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawText("Hi", 1, 4, neopixel.colors(NeoPixelColors.White), MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
sarduMatrix.drawRectangle(matrix, 0, 0, 16, 16, neopixel.colors(NeoPixelColors.Blue), 1)
matrix.show()
```

`clear buffer` only prepares a black frame. `clear matrix` also sends that frame to the physical LEDs.

## Scroll text

Use an immediate scrolling block when one text must complete before the next instruction. Select the entry edge or exact initial and final X/Y coordinates.

Use the **add scrolling** blocks to combine several texts and shapes. Add every item first, then call **start scrolling** once. All queued paths begin together; shorter paths remain at their final coordinate until the longest path ends.

Exclusive mode clears the background for each frame. Composed mode restores the pre-existing scene behind each frame and needs more temporary RAM.

## Fonts and measurements

Six font choices are available: SARDU, Micro:Bit Extended, proportional versions of both, SARDU Compact and SARDU Compact Proportional. Font sizes range from 1× to 4×. The orientation rotates the complete rendered line.

Text-measurement blocks report the exact width and height used by rendering. They are useful for positioning a fully visible string or calculating a bounce path.

## Gradients, icons and effects

Text can blend between two colors or between two brightness levels of the same selected color. Static and scrolling variants are available. Built-in icons are monochrome masks whose position, color, scale and brightness remain selectable.

Effects operate on the current matrix content. Fade, blink and rainbow preserve the shape of existing text and geometry where documented; fill effects can target the full matrix or use the current content as a mask.

Micro:Bit V1 supports normal projects and the extension is compiled in separate realistic feature projects for both V1 and V2. Micro:Bit V2 is recommended for large matrices, composed scrolling and advanced effects because it has more RAM and program-memory margin.

## Troubleshooting

- Nothing lights: verify external power, common ground, data direction and selected pin.
- Wrong pixel order: use advanced origin, scan-axis and ZigZag/progressive configuration.
- Unexpected pixel on an unused connected panel: clear the complete physical chain before reducing the configured logical dimensions.
- Program too large or allocation panic: reduce the selected feature set or matrix dimensions, prefer Exclusive scrolling and use Micro:Bit V2.
- Static drawing is not visible: add `show()` after composing the scene.
- Queued items run separately: add all items before one `startScrolling()` call.

For exact signatures see the [public API](api.md). For release verification see the [test procedure](testing.md).

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.8.4
```
