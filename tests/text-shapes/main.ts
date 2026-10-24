const matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 64)
const white = neopixel.colors(NeoPixelColors.White)

matrix.clearBuffer()
matrix.drawText("A", 0, 0, white, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
matrix.drawText("A", 0, 0, white, SarduMatrixFont.MicroBitExtended, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Clockwise90)
matrix.drawText("A", 0, 0, white, SarduMatrixFont.SarduCompactProportional, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.UpsideDown180)
matrix.drawText("A", 0, 0, white, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Clockwise270)
matrix.drawTextCenteredWidth("A", 0, white, SarduMatrixFont.MicroBitProportional, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
matrix.drawTextCenteredHeight("A", 0, white, SarduMatrixFont.SarduCompact, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
matrix.drawTextCentered("A", white, SarduMatrixFont.SarduProportional, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
matrix.drawTextCenteredWidthRange("A", 0, 15, 0, white, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
matrix.drawTextCenteredHeightRange("A", 0, 15, 0, white, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
matrix.drawTextCenteredArea("A", 0, 0, 15, 15, white, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)

sarduMatrix.drawLine(matrix, -2, 0, 17, 15, white)
sarduMatrix.drawRectangle(matrix, 0, 0, 7, 7, white)
sarduMatrix.fillRectangle(matrix, 8, 0, 15, 7, white)
sarduMatrix.drawCircle(matrix, 4, 11, 3, white)
sarduMatrix.fillCircle(matrix, 12, 11, 3, white)
for (let icon = SarduMatrixIcon.FilledHeart; icon <= SarduMatrixIcon.Lightning; icon++)
    sarduMatrix.drawIcon(matrix, icon as SarduMatrixIcon, 4, 4, neopixel.colors(NeoPixelColors.Red), 1, 128)

const row = sarduMatrix.graphicRow8(
    SarduMatrixGraphicPixel.Red, SarduMatrixGraphicPixel.Black,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Blue
)
sarduMatrix.drawNative8x8(matrix, row, row, row, row, row, row, row, row, 0, 0, SarduMatrixGraphicMode.Overlay)
matrix.show()

if (sarduMatrix.measureTextWidth("A", SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, SarduMatrixTextOrientation.Normal) <= 0) control.panic(921)
if (sarduMatrix.measureTextHeight("A", SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, SarduMatrixTextOrientation.Normal) <= 0) control.panic(921)
if (sarduMatrix.measureFontHeight(SarduMatrixFont.Sardu, SarduMatrixFontSize.X1) <= 0) control.panic(921)
