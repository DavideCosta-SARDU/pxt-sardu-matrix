# Ready-to-load MakeCode examples

[Italiano](README.it.md)

Each directory contains a complete MakeCode Blocks project. Open it in MakeCode with the SARDU-Matrix extension, then use **Download** to generate the correct `.hex` file for the selected Micro:Bit. Compiled firmware is intentionally not distributed in this repository.

- **sound-wave** — Micro:Bit V2 microphone level displayed as a centered moving wave. Loud sounds create taller peaks; quiet conditions produce a nearly flat line.
- **darkness-indicator** — built-in light level converted into illuminated rows and matrix brightness. A darker environment produces more light.

Both examples use a 16×16 matrix on P1 with an initial brightness of 128. Change the creation block to match the actual display. Always use a suitable external LED power supply and common ground.
