# Special effects

The **Effects** group contains animations that update the physical display automatically. They do not require a separate `show` block.

- **Fade** blends the current RGB buffer toward black or another color.
- **Blink** alternates the current content and black, preserving its original colors and brightness.
- **Color wipe** fills progressively from a selected X or Y coordinate in one direction.
- **Opposed color wipe** advances two colors from opposite edges toward a selected X/Y meeting coordinate. It can affect the whole matrix or use current text and geometry as a mask.
- **Show rainbow** recolors only the pixels already present, preserving their original peak brightness.
- **Rainbow cycle** animates the rainbow hue only inside the existing content.
- **Sparkles** draws random points alone or over the current content.

Animated effects use one `show` operation per frame and cooperative pauses. `stop and clear matrix` interrupts them without restoring an old frame. The final-state selector can leave the last frame, restore the content captured before the effect, or clear the matrix.

Generated effect colors have their own 0–255 brightness with a default of 128. Fade starts from the exact current buffer; blink and rainbow never increase the brightness of the source content.

Only fade keeps two temporary RGB snapshots while it runs. Other effects use temporary snapshots only while running; no effect adds a permanent framebuffer.

Micro:Bit V2 is recommended for effects. Micro:Bit V1 can compile realistic small-matrix effect projects but has very little firmware and RAM margin; use V2 for large matrices, fade, content-masked collisions and animated rainbows.

Effect blocks show only their essential parameters initially. Use the `+` control on a block to reveal timing, final-state and brightness options.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P0, 128)
sarduMatrix.rainbowCycle(matrix, MatrixRainbowAxis.Horizontal, 1, 50, MatrixEffectEndState.Leave)
sarduMatrix.fadeToColor(matrix, neopixel.colors(NeoPixelColors.Black), 1000, 20, MatrixEffectEndState.Leave, 128)
```

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix
```
