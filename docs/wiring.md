# Matrix wiring

[Italiano](_locales/it/wiring.md)

## Safety first

Do not power an LED matrix from the Micro:Bit 3 V pin. Use an external supply suitable for the panel current. Connect the supply ground, matrix ground and Micro:Bit GND together, and provide suitable wiring, protection and power injection.

## Data connection

Connect the selected Micro:Bit data pin to `DIN` of the first panel. P1 is the default, but the creation blocks let you choose another usable digital pin. Connect each panel's `DOUT` to the next panel's `DIN`; never reverse `DIN` and `DOUT`.

## Pixel path inside a module

Configure three independent properties to match the panel:

- the corner containing the first LED;
- rows or columns as the primary scan axis;
- progressive or alternating ZigZag order.

## Path between modules

For a grid of panels, configure the first module corner, module scan axis and progressive/ZigZag order separately from the pixel path inside each panel. The physical `DOUT` → `DIN` chain must follow the same module order selected in software.

Typical examples are one 16×16 panel, two panels in one row for 32×16, six panels in one row for 96×16, or twelve panels in two rows for 96×32.

## Visual verification

Before testing text or effects:

1. light logical pixel `(0, 0)` and locate it physically;
2. light the opposite corner;
3. test the first and last pixel of every module;
4. draw one horizontal and one vertical line;
5. correct origin, axis and path until every coordinate matches;
6. then test text, scrolling and effects.

If an unused connected panel lights unexpectedly, check the configured dimensions, the physical chain and the power state. The extension transmits data for the configured LED count only.

See [Display configuration](display-configuration.md) for creation methods and [Memory, rendering and physical limits](memory-and-rendering.md) for large chains.
