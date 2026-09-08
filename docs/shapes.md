# Static and scrolling geometry

## Static geometry

SARDU-Matrix includes line, rectangle, filled rectangle, circle and filled-circle blocks. Static geometry writes to the RGB buffer without updating the physical LEDs. Compose the complete scene and call `matrix.show()` once.

All coordinates are logical Matrix coordinates. Lines and shapes are clipped at the display boundary, so partially visible geometry is safe.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
sarduMatrix.drawRectangle(matrix, 1, 1, 14, 14, neopixel.colors(NeoPixelColors.Blue))
sarduMatrix.fillCircle(matrix, 8, 8, 3, neopixel.colors(NeoPixelColors.Red))
matrix.show()
```

## Scrolling geometry

The scrolling-geometry blocks add shapes to a pending composition. They do not start an animation immediately.

1. Add text and/or one or more shapes.
2. Call `matrix.startScrolling()` once.
3. Every queued item moves in the same animation.

Calling `startScrolling()` between two additions intentionally creates two separate animations.

```blocks
let matrix = sarduMatrix.create(32, 16, DigitalPin.P1, 128)
matrix.addScrollingText("HELLO", 0, neopixel.colors(NeoPixelColors.White), MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, 1)
sarduMatrix.addScrollingCircle(matrix, 4, 7, neopixel.colors(NeoPixelColors.Red), 1)
matrix.startScrolling(100, MatrixScrollMode.Exclusive)
```

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.8.4
```
