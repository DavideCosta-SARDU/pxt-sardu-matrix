# Changelog

## 0.5.0 - 2026-08-31

- Moved native graphics to MakeCode's official advanced `... more` subcategory and made the six grids draw directly into the matrix buffer.
- Removed the six temporary white presets and the obsolete runtime SMG1 selector while retaining the standalone web editor.
- Added compact transparent/color selectors with accessible labels and block help text.
- Compressed accented-font lookup data without changing glyph behavior, restoring successful Micro:Bit V1 test compilation.
- Added the Microsoft approval assets: 300×200 `icon.png`, root `LICENSE.txt` and a compiling `test.ts`.

## 0.4.1 - 2026-08-31

- Replaced verbose transparent reporter blocks with compact, directly clickable native pixel selectors.
- Added an explicit hollow transparent symbol and separate visible selectors for black and fifteen RGB palette choices.

## 0.4.0 - 2026-08-31

- Added native MakeCode graphic blocks for all six supported matrix formats, using Pasalt-style rows of selectable cells.
- Added explicit transparent cells and real RGB colors, including black, while retaining overlay and replace-area behavior.
- Reused the existing compact SMG1 graphic representation so native and web-authored graphics share the same renderer.
- Removed the external-editor button from the normal MakeCode flow; the standalone web editor remains available as an optional development and preset-authoring tool.

## 0.3.0 - 2026-08-31

- Corrected the Display order to show, clear matrix, then interrupt and clear matrix.
- Moved clear-columns and clear-rows to the advanced `... more` toolbox.
- Prioritized edge-based scrolling and changed manual scrolling's default X position from a fixed 16 to the actual matrix width.
- Added the official MakeCode editor-extension protocol to the six-format graphic editor while retaining standalone use.
- Added the graphic-editor manifest entry; public MakeCode now exposes its button, while opening the external iframe remains subject to Microsoft URL approval.

## 0.2.1 - 2026-08-30

- Added the standalone six-format graphic editor, RGB simulator page and GitHub Pages publication workflow without attaching them to the PXT toolbox manifest.
- Added the Graphics and simulator guides, including the Microsoft approval boundary for automatic MakeCode integration.

## 0.2.0 - 2026-08-30

- Moved the Display blocks directly after Creation and added inclusive clear-columns, clear-rows and advanced clear-area operations.
- Added compact graphics for all six supported matrix formats: 8×8, 16×16, 32×8, 8×32, 16×8 and 8×16.
- Added separate transparent and black pixels with overlay and replace-area drawing modes.
- Added six built-in graphic presets so the Graphics block selector is always populated in MakeCode.

## 0.1.0 - 2026-08-30

- Added direct-size and preset-module creation methods with a one-module 16×16 default.
- Added advanced origin, scan-axis and progressive/ZigZag configuration for pixels and module grids.
- Added dynamic one-buffer RGB rendering through pxt-neopixel.
- Added pixel, clear, show, brightness and geometry-information APIs.
- Added an original compact 6×8 font, clipped text drawing and timed scrolling.
- Added mapping and configuration tests, including all approved module sizes and the 96×16 compatibility case.
- Added English source strings plus Italian, German, Spanish, French, Japanese and Chinese localizations.
- Added initial brightness to every creation block and retained runtime brightness under advanced blocks.
- Added per-string brightness, RGB/HSL colors, selectable fonts, 1x-4x sizing and full/area text centering.
- Fixed text-block parameter controls and corrected the extended Micro:Bit font orientation on hardware.
- Standardized user-facing references and font labels as `Micro:Bit`.
- Added whole-line text rotation at 0°, 90° clockwise, 180° and 270° clockwise to static, centered and scrolling text.
- Added automatic scrolling from right, left, top or bottom, independently from text rotation, while retaining manual X/Y scrolling.
- Added exclusive scrolling and composed scrolling that temporarily preserves and restores the existing RGB scene.
- Updated module terminology and temporarily limited packaged development locales to English and Italian.
- Added wiring, power, memory, architecture, API and migration documentation.
- Changed the category to the official SARDU blue and made creation the first block group.
- Renamed the text groups to static text and scrolling text; scrolling now accepts start X/Y coordinates.
- Added distinct lowercase glyphs, common accented Latin letters and selected symbols.
- Added immediate clear, advanced buffer-only clear and cooperative stop-and-clear operations.
- Standardized the technical path name as `ZigZag` in every language.
