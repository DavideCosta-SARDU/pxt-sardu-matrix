# Gradient text and built-in icons

## Gradient text

The gradient text block draws a static line into the current RGB buffer. Choose the first and second color and one of four directions: left to right, right to left, top to bottom or bottom to top. The direction always refers to the final visible text, even when the line is rotated.

Only glyph pixels are changed; the background remains transparent. Font, scale, brightness (default 128) and orientation are expandable parameters. Call `show()` after composing the complete scene.

A separate brightness-gradient block keeps one selected color and blends from an initial 0–255 brightness to a final 0–255 brightness. The direction identifies the edge containing the initial value; the opposite edge reaches the final value. Its defaults are 128 and 8, so the far edge remains faintly visible; zero remains available for an intentional fade to black. Both gradient blocks are placed after the standard static-text blocks.

The Scrolling text group provides the same two gradient choices for text entering from any matrix edge. The gradient is attached to the glyphs and moves with the text; it does not remain fixed on the display. Both exclusive and composed scrolling modes are supported.

## Built-in icons

The Icons group provides fourteen original 8 x 8 monochrome masks: filled and outline hearts, smile, sad face, star, check, cross, four arrows, sun, moon and lightning. Each icon can be placed at X/Y, colored, scaled from 1x to 4x and drawn with brightness default 128.

Icons write only their active pixels into the current buffer and are safely clipped at the matrix edges. Call `show()` after drawing. No Micro:Bit or third-party logo is included.
