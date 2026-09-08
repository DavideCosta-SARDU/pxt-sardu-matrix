# SARDU-Matrix project and educational use

[Italiano](_locales/it/project-and-education.md)

SARDU-Matrix is a free, MIT-licensed MakeCode extension for controlling commonly available WS2812B/NeoPixel RGB matrix panels with a Micro:Bit. It is not tied to, bundled with or sold as one proprietary accessory: learners can use compatible commercial panels from different manufacturers and configure their real dimensions and wiring path.

## Educational purpose

The extension is designed for lessons and projects involving:

- Cartesian coordinates, dimensions and two-dimensional mapping;
- RGB and HSL color models, brightness and gradients;
- text rendering, fonts, rotation and animation;
- geometric primitives and icon composition;
- timing, memory constraints and differences between Micro:Bit V1 and V2;
- safe planning of external LED power and common-ground wiring.

Students can begin with one 8 x 8 or 16 x 16 panel and progress to multi-module displays. Blocks expose simple defaults first and keep physical mapping and memory information in advanced sections.

## Sensor data and classroom projects

The matrix can present measurements from external sensors, such as temperature, humidity or distance, and from Micro:Bit inputs such as sound level, acceleration, tilt, buttons and light level. A measurement can be displayed as text, converted into a bar or shape, or used to control color, animation and brightness. This connects data acquisition, numerical ranges, coordinate mapping and visual communication in one project.

### Sound-level wave

With Micro:Bit V2, the built-in microphone can drive an animated wave: louder sound produces taller peaks, while quiet conditions bring the line back toward the vertical center. MakeCode reports a relative sound level rather than calibrated decibels, so the project should be described as a sound-level visualizer unless it has been calibrated with suitable reference equipment.

Suggested steps:

1. create the matrix and choose its logical center line;
2. read the sound level at a regular interval;
3. map the reading to an amplitude that fits within the matrix height;
4. shift or regenerate the wave points across the width;
5. clear the RGB buffer, draw the new lines or pixels and call `show()` once;
6. add smoothing or a minimum threshold so background noise does not make the image unstable.

This activity introduces sampling, scaling, coordinates, thresholds and filtering. Micro:Bit V1 requires an external sound sensor because it has no built-in microphone.

The complete project is available in [`examples/sound-wave`](../examples/sound-wave/).

### Darkness indicator

The Micro:Bit light-level reading can control a progressive display: as the environment becomes darker, more lines illuminate and their brightness increases. In bright conditions, fewer lines remain visible at a lower brightness.

Suggested steps:

1. read the light level and convert it to a darkness value by reversing the scale;
2. map darkness to the number of illuminated rows or columns;
3. map the same value to a safe brightness range;
4. clear the RGB buffer and draw the required lines;
5. call `show()` once and repeat after a short pause;
6. average several readings or use thresholds to prevent flicker near a boundary.

The brightness range must remain appropriate for the external power supply and the number of LEDs. This project demonstrates inverse relationships, value mapping, thresholds, energy awareness and automatic control.

The complete project is available in [`examples/darkness-indicator`](../examples/darkness-indicator/).

## Compatible hardware

The supported hardware is a Micro:Bit V1 or V2 and one or more commercial addressable RGB panels compatible with the WS2812B/NeoPixel data protocol. The extension uses Microsoft's official `pxt-neopixel` package as its backend. It does not use mBed.

An appropriate external power supply is required for LED panels. The Micro:Bit, panels and supply must share ground; the matrix must not be powered from the Micro:Bit 3 V pin. See the [wiring guide](wiring.md).

## Project resources

- [Installation and API overview](../README.md)
- [English user guide](user-guide.md)
- [Italian user guide](_locales/it/user-guide.md)
- [Documented test procedure](testing.md)
