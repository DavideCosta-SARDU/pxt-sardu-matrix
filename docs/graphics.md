# Native Graphics blocks and optional editor

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

## Optional web editor

The [standalone graphic editor](https://davidecosta-sardu.github.io/pxt-sardu-matrix/editor.html) can be used to design and export graphics. It is optional and is not required for the normal native-block workflow. Integration of an external editor inside MakeCode remains subject to separate URL approval.

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.8.4
```
