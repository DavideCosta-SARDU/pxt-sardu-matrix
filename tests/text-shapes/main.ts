const matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 64)
const white = neopixel.colors(NeoPixelColors.White)

matrix.clearBuffer()
matrix.drawText("A", 0, 0, white, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.drawText("A", 0, 0, white, MatrixFont.MicroBitExtended, MatrixFontSize.X1, 128, MatrixTextOrientation.Clockwise90)
matrix.drawText("A", 0, 0, white, MatrixFont.SarduCompactProportional, MatrixFontSize.X1, 128, MatrixTextOrientation.UpsideDown180)
matrix.drawText("A", 0, 0, white, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Clockwise270)
matrix.drawTextCenteredWidth("A", 0, white, MatrixFont.MicroBitProportional, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.drawTextCenteredHeight("A", 0, white, MatrixFont.SarduCompact, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.drawTextCentered("A", white, MatrixFont.SarduProportional, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.drawTextCenteredWidthRange("A", 0, 15, 0, white, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.drawTextCenteredHeightRange("A", 0, 15, 0, white, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.drawTextCenteredArea("A", 0, 0, 15, 15, white, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)

sarduMatrix.drawLine(matrix, -2, 0, 17, 15, white)
sarduMatrix.drawRectangle(matrix, 0, 0, 7, 7, white)
sarduMatrix.fillRectangle(matrix, 8, 0, 15, 7, white)
sarduMatrix.drawCircle(matrix, 4, 11, 3, white)
sarduMatrix.fillCircle(matrix, 12, 11, 3, white)
for (let icon = MatrixIcon.FilledHeart; icon <= MatrixIcon.Lightning; icon++)
    sarduMatrix.drawIcon(matrix, icon as MatrixIcon, 4, 4, neopixel.colors(NeoPixelColors.Red), 1, 128)

const row = sarduMatrix.graphicRow8(
    MatrixGraphicPixel.Red, MatrixGraphicPixel.Black,
    MatrixGraphicPixel.Transparent, MatrixGraphicPixel.Transparent,
    MatrixGraphicPixel.Transparent, MatrixGraphicPixel.Transparent,
    MatrixGraphicPixel.Transparent, MatrixGraphicPixel.Blue
)
sarduMatrix.drawNative8x8(matrix, row, row, row, row, row, row, row, row, 0, 0, MatrixGraphicMode.Overlay)
matrix.show()

if (sarduMatrix.measureTextWidth("A", MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Normal) <= 0) control.panic(921)
if (sarduMatrix.measureTextHeight("A", MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Normal) <= 0) control.panic(921)
if (sarduMatrix.measureFontHeight(MatrixFont.Sardu, MatrixFontSize.X1) <= 0) control.panic(921)
