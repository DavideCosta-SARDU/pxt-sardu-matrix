# SARDU-Matrix project and educational use

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

## Compatible hardware

The supported hardware is a Micro:Bit V1 or V2 and one or more commercial addressable RGB panels compatible with the WS2812B/NeoPixel data protocol. The extension uses Microsoft's official `pxt-neopixel` package as its backend. It does not use mBed.

An appropriate external power supply is required for LED panels. The Micro:Bit, panels and supply must share ground; the matrix must not be powered from the Micro:Bit 3 V pin. See the [wiring guide](wiring.md).

## Project resources

- [Installation and API overview](../README.md)
- [Italian user guide](guida-italiana.md)
- [Documented test procedure](testing.md)
- [Optional graphic editor](https://davidecosta-sardu.github.io/pxt-sardu-matrix/editor.html)
- [Optional matrix simulator](https://davidecosta-sardu.github.io/pxt-sardu-matrix/simulator.html)

The editor and simulator are optional GitHub Pages tools and are not embedded in the public MakeCode editor.
