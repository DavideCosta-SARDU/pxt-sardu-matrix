# Public API

SARDU-Matrix exposes the `sarduMatrix` namespace and returns a `Matrix` object from every creation function. The object owns the physical mapping, NeoPixel strip and RGB buffer; applications work with logical X/Y coordinates whose origin is always the top-left corner.

## Create a matrix

Use direct dimensions when the final logical width and height are known:

```typescript
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
```

Use predefined modules for a horizontal chain:

```typescript
let matrix = sarduMatrix.createModules(
    2,
    MatrixModuleType.Matrix16x16,
    DigitalPin.P1,
    128
)
```

Advanced creation blocks additionally select pixel origin, scan axis, progressive or ZigZag wiring, module-grid origin and module order. See [display configuration](display-configuration.md) and [wiring](wiring.md).

The default data pin is P1 and the default brightness is 128. Valid brightness values are 0–255.

## Display and buffer

- `matrix.setPixel(x, y, color)` writes one logical pixel to the buffer.
- `matrix.clearBuffer()` clears only the buffer.
- `matrix.clear()` clears the buffer and updates the LEDs.
- `matrix.show()` sends the complete buffer to the LEDs.
- `matrix.interruptAndClear()` stops an active animation and clears the display.
- `matrix.setBrightness(value)` changes the brightness applied to pixels written afterwards.
- `matrix.width()`, `height()`, `ledCount()` and `rgbBufferBytes()` report the configured dimensions and storage cost.

Out-of-range coordinates are clipped safely. Static text, geometry, icons and Graphics modify the buffer and require one final `show()` after the complete scene has been composed.

## Text

```typescript
matrix.drawText(
    "Hello", 0, 0,
    neopixel.colors(NeoPixelColors.White),
    MatrixFont.Sardu,
    MatrixFontSize.X1,
    128,
    MatrixTextOrientation.Normal
)
matrix.show()
```

Available font families are SARDU, Micro:Bit Extended, SARDU Proportional, Micro:Bit Proportional, SARDU Compact and SARDU Compact Proportional. Text can be scaled from 1× to 4× and rotated by 0°, 90°, 180° or 270°.

Centered-text blocks can center across the matrix or within selected bounds. `measureTextWidth()`, `measureTextHeight()` and `measureFontHeight()` expose the same measurements used by the renderer.

Static gradient text supports two selected colors or one color with independently selected initial and final brightness. See [gradient text and icons](gradient-and-icons.md).

## Scrolling

`scrollTextFromEdge()` immediately performs a complete blocking/cooperative scroll from the selected edge. `scrollTextBetween()` immediately follows exact initial and final X/Y coordinates.

To move multiple items simultaneously, add all of them to one queue and call `startScrolling()` once:

```typescript
matrix.addScrollingText(
    "Hello", 0,
    neopixel.colors(NeoPixelColors.White),
    MatrixFont.Sardu,
    MatrixFontSize.X1,
    128,
    MatrixTextOrientation.Normal,
    1
)
sarduMatrix.addScrollingCircle(
    matrix, 8, 8, 3,
    neopixel.colors(NeoPixelColors.Red),
    1
)
matrix.startScrolling(100, MatrixScrollMode.Exclusive)
```

Queued path blocks accept exact starting and ending X/Y coordinates. The special starting X value `-1` means the real matrix width; every other value is used literally. Exclusive mode clears every animation frame. Composed mode preserves the scene behind the moving content and temporarily requires another RGB-sized snapshot.

## Geometry, icons and Graphics

Static and scrolling geometry includes lines, rectangles, filled rectangles, circles and filled circles. Built-in 8×8 icons include hearts, faces, star, check, cross, arrows, sun, moon and lightning. Native Graphics images in the supported sizes can be drawn with transparent or replacement backgrounds.

All drawing operations use clipping, so partially visible items never wrap to another edge.

## Colors

Every color parameter accepts the MakeCode color picker, NeoPixel named colors, `neopixel.rgb()` and the extension helpers:

```typescript
sarduMatrix.rgbColor(0, 128, 255)
sarduMatrix.hslColor(210, 100, 50)
```

RGB components use 0–255. HSL uses hue 0–360 and saturation/lightness 0–100.

## Effects and Micro:Bit revisions

Effects animate the current buffer and include fade, blink, directional and opposed fills, content-masked fills, rainbow and sparkles. They update the LEDs automatically and support leave, restore or clear final states. See [special effects](effects.md).

The normal creation, display, text, geometry, scrolling, gradient, effect and Graphics feature projects are compiled independently for both Micro:Bit V1 and V2. Micro:Bit V2 is recommended for large matrices and effects because it provides considerably more program-memory and RAM margin. A feature is described as V2-only only when a representative standalone project cannot operate on V1; the current API is not labelled V2-only as a whole.

## Errors and memory

Invalid dimensions or mapping combinations use `control.panic(920)`. Excessive allocation may instead trigger the MakeCode runtime allocation panic. The library never silently reduces the requested dimensions.

The permanent RGB storage is proportional to the configured LED count:

```text
RGB bytes = width × height × 3
```

The actual maximum depends on the Micro:Bit revision, other extensions and the rest of the program. See [memory and rendering](memory-and-rendering.md) and the [test procedure](testing.md).
