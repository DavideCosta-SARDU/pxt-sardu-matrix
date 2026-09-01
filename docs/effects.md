# Special effects

The **Effects** group contains animations that update the physical display automatically. They do not require a separate `show` block.

- **Fade** blends the current RGB buffer toward black or another color.
- **Blink** alternates the current content and black, preserving its original colors and brightness.
- **Color wipe** fills progressively from a selected X or Y coordinate in one direction.
- **Opposed color wipe** advances two colors from opposite edges until they meet.
- **Show rainbow** recolors only the pixels already present, preserving their original peak brightness.
- **Rainbow cycle** animates the rainbow hue only inside the existing content.
- **Sparkles** draws random points alone or over the current content.

Animated effects use one `show` operation per frame and cooperative pauses. `stop and clear matrix` interrupts them without restoring an old frame. The final-state selector can leave the last frame, restore the content captured before the effect, or clear the matrix.

Generated effect colors have their own 0–255 brightness with a default of 128. Fade starts from the exact current buffer; blink and rainbow never increase the brightness of the source content.

Only fade keeps two temporary RGB snapshots while it runs. Other effects use temporary snapshots only while running; no effect adds a permanent framebuffer.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P0, 128)
sarduMatrix.showRainbow(matrix, MatrixRainbowAxis.Horizontal)
sarduMatrix.fadeToColor(matrix, neopixel.colors(NeoPixelColors.Black), 1000, 20, MatrixEffectEndState.Leave)
```

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix
```
