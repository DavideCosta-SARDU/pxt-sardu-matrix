# Changelog

## 0.1.0 - Unreleased

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
