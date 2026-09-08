# Native Graphics blocks

[Italiano](_locales/it/graphics.md)

SARDU-Matrix provides native MakeCode Graphics blocks for 8×8, 16×16, 32×8, 8×32, 16×8 and 8×16 areas. They are available under `... more` because the editable grids are intentionally tall.

## Drawing a graphic

Select the block matching the required dimensions and click each cell to choose its value. The graphic is written into the Matrix RGB buffer at the selected X/Y position. Call `show()` after composing all static content.

## Transparent and black cells

- **Transparent** preserves the existing pixel in overlay mode.
- **Black** is the real color `#000000` and explicitly turns the LED off.
- **Overlay** changes only non-transparent cells.
- **Replace area** clears transparent cells inside the selected graphic area.

Coordinates outside the logical matrix are clipped safely.

## Colors and memory

The native blocks use the predefined RGB cell palette. They draw directly into the existing Matrix buffer and do not allocate a second framebuffer.
