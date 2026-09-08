# Memory, rendering and physical limits

[Italiano](_locales/it/memory-and-rendering.md)

## Memory use

SARDU-Matrix stores the current image in an RGB buffer whose size grows with the configured LED count:

```text
RGB bytes = width × height × 3
```

For example, 16×16 requires 768 RGB bytes, 32×16 requires 1,536 bytes and 96×16 requires 4,608 bytes. These figures describe the RGB data only; the program, MakeCode runtime and temporary animation data also use memory.

There is no fixed matrix-size limit in the extension. The practical limit depends on the Micro:Bit revision, the complete user program and the selected operations.

## Micro:Bit V1 and V2

Micro:Bit V1 can run normal projects with smaller matrices and selected feature families. Micro:Bit V2 provides substantially more RAM and program space and is recommended for large matrices, complex compositions and effects.

A program-size error concerns firmware/flash, while a runtime allocation error concerns RAM. The monolithic `pxt test` runner links the complete extension and test harness into one synthetic firmware; its V1 size is not representative of a normal project using only the required blocks. The documented suite therefore compiles realistic feature groups separately.

## Permanent and temporary data

Static pixels, text, geometry, icons and native graphics write directly to the main RGB buffer. They do not create a second permanent framebuffer.

Composed scrolling and some effects keep temporary scene snapshots while an animation runs. Fade requires two temporary RGB snapshots. Larger displays therefore leave less memory available for the rest of the program.

## Display update time

`show()` transmits the complete configured LED chain, including black pixels. WS2812B data uses about 30 microseconds per RGB LED, plus reset time, so an approximate lower bound is:

```text
transfer time ≈ LED count × 30 µs
```

This is a protocol estimate, not a guaranteed frame rate. Rendering, pauses, radio activity and other program work add time. Test the intended panel chain when smooth animation or input responsiveness matters.

## Practical choices

- Configure only the LEDs that are physically part of the display.
- Compose static content in the buffer and call `show()` once per completed frame.
- Prefer Micro:Bit V2 for large displays, fade, masked opposed wipes and animated rainbows.
- Keep brightness and frame rate appropriate for the power supply and project.
- Split unusually large programs into simpler scenes when V1 reports program-size or memory limits.

## Electrical limits

Do not power an LED matrix from the Micro:Bit 3 V pin. Use an external supply sized for the panels, connect a common ground and provide appropriate wiring, protection and power injection. Software brightness does not replace safe electrical design. See the [wiring guide](wiring.md).

Protocol and board specifications should be checked against the official Micro:Bit, Microsoft MakeCode NeoPixel and LED-manufacturer documentation for the hardware in use.
