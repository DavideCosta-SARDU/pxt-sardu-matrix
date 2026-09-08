# Memory, rendering and physical limits

## RGB buffer

SARDU-Matrix allocates one RGB buffer sized to the configured LED count:

```text
RGB bytes = width × height × 3
```

There is no fixed 1536-LED software limit. The practical limit depends on the micro:bit revision, the rest of the program, temporary animation buffers and the largest allocation supported by the runtime.

## Static rendering

Pixels, text, geometry, icons and native graphics write directly into the same buffer. `show()` transmits that buffer to the physical display. Static composition does not allocate a second framebuffer.

## Scrolling and effects

Exclusive scrolling clears and redraws the main buffer for every frame. Composed scrolling temporarily stores one copy of the RGB scene so it can restore the background.

Some effects also use temporary snapshots. Their memory cost grows with the configured number of LEDs. Micro:Bit V2 is recommended for large matrices and effects because it provides substantially more RAM and program space.

## Program size and RAM are different limits

Program-size errors refer to firmware/flash usage. Runtime allocation errors refer to RAM. A large `pxt test` image can exceed the V1 program-size limit even when a normal V1 project using one feature family compiles and runs correctly. For this reason the test suite uses separate realistic projects for each family.

## WS2812B timing

The full strip is transmitted for every `show()`. At the WS2812B data rate, more LEDs mean a longer blocking transfer and a lower maximum frame rate. Rendering speed, radio use and input responsiveness must be tested with the intended chain.

## Power and signal

Do not power a matrix from the micro:bit 3V pin. Use an external supply sized for the panels, connect a common ground and provide appropriate injection, wiring and protection. Software brightness is not a substitute for safe electrical design.

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.8.4
```
