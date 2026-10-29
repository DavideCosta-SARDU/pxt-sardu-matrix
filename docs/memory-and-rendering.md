# Memory, rendering and physical limits

[Italiano](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v1.0.0/docs/_locales/it/memory-and-rendering.md)

## Memory use

SARDU-Matrix stores the current image in an RGB buffer whose size grows with the configured LED count:

```text
RGB bytes = width × height × 3
```

For example, 16×16 requires 768 RGB bytes, 32×16 requires 1,536 bytes and 96×16 requires 4,608 bytes. These figures describe the RGB data only; the program, MakeCode runtime and temporary animation data also use memory.

There is no board-specific fixed module-count limit in the extension. The practical limit depends on the micro:bit revision, the complete user program and the selected operations.

## micro:bit V1 and V2

micro:bit V1 can run normal projects with smaller matrices and selected feature families. micro:bit V2 provides substantially more RAM and program space and is recommended for large matrices, complex compositions and effects.

A program-size error concerns firmware/flash, while a runtime allocation error concerns RAM. The monolithic `pxt test` runner links the complete extension and test harness into one synthetic firmware; its V1 size is not representative of a normal project using only the required blocks. The documented suite therefore compiles realistic feature groups separately.

## Permanent and temporary data

Static pixels, text, geometry, icons and native graphics write directly to the main RGB buffer. They do not create a second permanent framebuffer.

Composed scrolling and some effects keep temporary scene snapshots while an animation runs. Fade holds three temporary RGB copies in addition to the main buffer: the initial scene, target and current frame, for four RGB buffers in total. Larger displays therefore leave less memory available for the rest of the program.

## Standard modules: RAM cost per module

| Module | LEDs | Base buffer | Composed scrolling: 2 buffers | Fade: 4 buffers | Modules sharing the base-buffer budget of the tested 6-panel 16×16 display |
| --- | ---: | ---: | ---: | ---: | ---: |
| 8×8 | 64 | 192 | 384 | 768 | 24 |
| 16×8 | 128 | 384 | 768 | 1536 | 12 |
| 8×16 | 128 | 384 | 768 | 1536 | 12 |
| 16×16 | 256 | 768 | 1536 | 3072 | 6 |
| 32×8 | 256 | 768 | 1536 | 3072 | 6 |
| 8×32 | 256 | 768 | 1536 | 3072 | 6 |

Costs are RGB payload bytes per module, not total program RAM. The composed and fade columns include the main buffer, for one animation on one matrix. Multiply by N for N modules. Objects, buffer headers, strings, queues, runtime services, other extensions and concurrent animations need additional RAM.

micro:bit V1 has 16 KiB total RAM; V2 has 128 KiB. This is not all available for panel buffers. Application-processor specifications are documented on the official [V1](https://tech.microbit.org/hardware/1-5-revision/) and [V2](https://tech.microbit.org/hardware/2-0-revision/) pages.

A practical maximum module count has not been measured for either board. The physically verified V2 configuration is six 16×16 modules: 96×16, or 1,536 LEDs. Its base buffer is 4,608 bytes; composed scrolling needs 9,216 RGB bytes and one fade needs 18,432 RGB bytes, before other program data. The latter already exceeds all V1 RAM. The 96×16 checks do not constitute physical tests of the other formats or every effect.

The last column is a memory equivalence only: twenty-four 8×8 modules or twelve 16×8/8×16 modules have the same 1,536 LEDs as six 16×16 modules. It is not a board maximum.

Given a budget B reserved for RGB payloads after other memory requirements, a preliminary estimate is:

```text
modules = floor(B / (module_width × module_height × 3 × copies))
copies = 1 for the base buffer, 2 for composed scrolling, 4 for fade
```

This is a budget bound, not a guaranteed configuration: contiguous-allocation limits, fragmentation and the complete program also matter. External power remains a separate requirement even when RAM is sufficient.

## Display update time

`show()` transmits the complete configured LED chain, including black pixels. WS2812B data uses about 30 microseconds per RGB LED, plus reset time, so an approximate lower bound is:

```text
transfer time ≈ LED count × 30 µs
```

This is a protocol estimate, not a guaranteed frame rate. Rendering, pauses, radio activity and other program work add time. Test the intended panel chain when smooth animation or input responsiveness matters.

## Practical choices

- Configure only the LEDs that are physically part of the display.
- Compose static content in the buffer and call `show()` once per completed frame.
- Prefer micro:bit V2 for large displays, fade, masked opposed wipes and animated rainbows.
- Keep brightness and frame rate appropriate for the power supply and project.
- Split unusually large programs into simpler scenes when V1 reports program-size or memory limits.

## Electrical limits

Do not power an LED matrix from the micro:bit 3 V pin. Use an external supply sized for the panels, connect a common ground and provide appropriate wiring, protection and power injection. Software brightness does not replace safe electrical design. See the [wiring guide](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v1.0.0/docs/wiring.md).

Protocol and board specifications should be checked against the official micro:bit, Microsoft MakeCode NeoPixel and LED-manufacturer documentation for the hardware in use.

```package
pxt-sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v1.0.0
```
