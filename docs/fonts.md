# Fonts and text measurements

[Italiano](_locales/it/fonts.md)

SARDU-Matrix includes six fonts. Their pixel height is fixed for each family and is multiplied by the selected 1×–4× scale. Proportional fonts change character width, not height.

## Font dimensions

| Font | Width at 1× | Height 1× | Height 2× | Height 3× | Height 4× |
| --- | --- | ---: | ---: | ---: | ---: |
| SARDU | 5 pixels per glyph, plus spacing | 8 | 16 | 24 | 32 |
| SARDU Proportional | Variable, plus spacing | 8 | 16 | 24 | 32 |
| SARDU Compact | 4 pixels per glyph, plus spacing | 8 | 16 | 24 | 32 |
| SARDU Compact Proportional | Variable, plus spacing | 8 | 16 | 24 | 32 |
| Micro:Bit Extended | 5 pixels per glyph, plus spacing | 7 | 14 | 21 | 28 |
| Micro:Bit Proportional | Variable, plus spacing | 7 | 14 | 21 | 28 |

The spacing column between characters is also multiplied by the selected scale. The exact width of proportional text therefore depends on the characters in the string.

## Positioning multiple lines

Matrix coordinates start at zero. For normal text, calculate the next line position with:

```text
next Y = current Y + font height + optional spacing
```

On a 16×16 matrix:

- two SARDU 1× lines fit at Y=0 and Y=8, with no empty row between them;
- two Micro:Bit 1× lines fit at Y=0 and Y=7;
- Micro:Bit 1× can use Y=0 and Y=8 to leave one empty row between the lines.

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
- **Micro:Bit Extended** follows the familiar Micro:Bit 5×5 style and provides room for supported accents.
- **Micro:Bit Proportional** keeps that style while trimming unused side columns.

All SARDU variants share the same 8-pixel vertical metric. Both Micro:Bit variants share the same 7-pixel vertical metric.
