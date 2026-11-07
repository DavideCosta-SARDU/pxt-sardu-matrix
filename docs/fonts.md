# Fonts and text measurements

[Italiano](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v1.1.0/docs/_locales/it/fonts.md)

SARDU-Matrix includes nine fonts. Their pixel height is fixed for each family and is multiplied by the selected 1×–4× scale. Proportional fonts change character width, not height.

## Font dimensions

| Font | Width at 1× | Height 1× | Height 2× | Height 3× | Height 4× |
| --- | --- | ---: | ---: | ---: | ---: |
| SARDU | 5 pixels per glyph, plus spacing | 8 | 16 | 24 | 32 |
| SARDU Proportional | Variable, plus spacing | 8 | 16 | 24 | 32 |
| SARDU Compact | 4 pixels per glyph, plus spacing | 8 | 16 | 24 | 32 |
| SARDU Compact Proportional | Variable, plus spacing | 8 | 16 | 24 | 32 |
| micro:bit Extended | 5 pixels per glyph, plus spacing | 7 | 14 | 21 | 28 |
| micro:bit Proportional | Variable, plus spacing | 7 | 14 | 21 | 28 |
| Fixed 4x6 | 4 pixels, plus spacing | 6 | 12 | 18 | 24 |
| font8x8 (V2) | 8 pixels, plus spacing | 8 | 16 | 24 | 32 |
| Spleen 8x16 (V2) | 8 pixels, plus spacing | 16 | 32 | 48 | 64 |

The spacing column between characters is also multiplied by the selected scale. The exact width of proportional text therefore depends on the characters in the string.

## Positioning multiple lines

Matrix coordinates start at zero. For normal text, calculate the next line position with:

```text
next Y = current Y + font height + optional spacing
```

On a 16×16 matrix:

- two SARDU 1× lines fit at Y=0 and Y=8, with no empty row between them;
- two micro:bit 1× lines fit at Y=0 and Y=7;
- micro:bit 1× can use Y=0 and Y=8 to leave one empty row between the lines.

SARDU 2× is already 16 pixels high, so only one complete line fits vertically on a 16-pixel-high matrix.

## Measurement blocks

Use the measurement blocks instead of hard-coded values when font, scale, text or orientation can change:

- **measure font height** returns the unrotated height for the selected font and scale;
- **measure text width** returns the exact width of a particular string;
- **measure text height** returns the final height of a particular string, including its orientation.

For normal and 180° text, the rendered height matches the font height in the table. At 90° or 270°, the text dimensions are exchanged: the final height depends on the measured string width. Use **measure text height** for those orientations.

Measurements use the same glyph data, character spacing, proportional trimming, scale and rotation rules as the renderer.

## Choosing a font

- **SARDU** is the default, full-height fixed-width font.
- **SARDU Proportional** preserves the SARDU glyphs while reducing unused side columns.
- **SARDU Compact** reduces every glyph to four columns for shorter messages.
- **SARDU Compact Proportional** combines compact glyphs with variable width.
- **micro:bit Extended** follows the familiar micro:bit 5×5 style and provides room for supported accents.
- **micro:bit Proportional** keeps that style while trimming unused side columns.

All SARDU variants share the same 8-pixel vertical metric. Both micro:bit variants share the same 7-pixel vertical metric.

```package
pxt-sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v1.1.0
```

## New font compatibility

**Fixed 4x6** supports micro:bit V1 and V2. **font8x8 (V2)** and
**Spleen 8x16 (V2)** require micro:bit V2: their tables do not occupy V1 Flash.
Using them on V1 raises error 927 (a V2-only feature); the font is never silently
substituted. The six existing fonts retain their data, identifiers, dimensions
and defaults.

The three new fonts include printable ASCII and Latin-1, including Italian accents.
Spleen retains its original design, including a and g. Tables use lossless packing
without changing glyph pixels or allocating decompression buffers in RAM.
Sources and licences: [THIRD_PARTY_FONTS.md](../THIRD_PARTY_FONTS.md).
