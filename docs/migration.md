# Migrating from pxt-smartmatrix

SARDU-Matrix uses an explicit Matrix object, a logical RGB buffer and an explicit `show()` step for static content. Migration should preserve wiring and visual behavior rather than copying names mechanically.

## Create the display

For a six-panel 16×16 chain:

```blocks
let matrix = sarduMatrix.createModules(6, MatrixModuleType.Matrix16x16, DigitalPin.P1, 128)
```

Use direct dimensions or advanced configuration only when they match the real panel path.

## Pixels and static content

Draw every static element into the buffer and call `show()` once:

```blocks
matrix.clearBuffer()
matrix.setPixel(0, 0, neopixel.colors(NeoPixelColors.Red))
matrix.drawText("HELLO", 1, 1, neopixel.colors(NeoPixelColors.White), MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.show()
```

`clearBuffer()` changes memory only. `clear()` immediately clears and updates the physical display. `interruptAndClear()` also stops the active animation.

## Scrolling

Immediate scrolling blocks start at once. To combine several texts and shapes, add every item first and call `startScrolling()` once.

## Colors and brightness

Colors accept the NeoPixel picker and RGB/HSL reporter blocks. Initial matrix brightness and per-text brightness are separate controls. The prudent default is 128.

## Unsupported legacy assumptions

Legacy layer systems, automatic `show()` behavior and direct access to an internal strip are not migrated automatically. Rebuild the intended scene with the public buffer operations and verify it on the real matrix.

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.8.4
```
