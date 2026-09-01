# Special effects

The **Effects** group contains animations that update the physical display automatically. They do not require a separate `show` block.

- **Fade** blends the current RGB buffer toward black or another color.
- **Blink** alternates a full color and black.
- **Color wipe** fills the matrix progressively from one edge.
- **Show rainbow** draws and immediately shows a static rainbow.
- **Rainbow cycle** animates the rainbow hue.
- **Sparkles** draws random points alone or over the current content.

Animated effects use one `show` operation per frame and cooperative pauses. `stop and clear matrix` interrupts them without restoring an old frame. The final-state selector can leave the last frame, restore the content captured before the effect, or clear the matrix.

Only fade keeps two temporary RGB snapshots while it runs. Other effects keep at most one temporary snapshot; no effect adds a permanent framebuffer.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P0, 128)
sarduMatrix.showRainbow(matrix, MatrixRainbowAxis.Horizontal)
sarduMatrix.fadeToColor(matrix, neopixel.colors(NeoPixelColors.Black), 1000, 20, MatrixEffectEndState.Leave)
```

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix
```
