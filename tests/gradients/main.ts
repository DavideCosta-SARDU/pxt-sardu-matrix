function expectGradient(condition: boolean): void {
    if (!condition) control.panic(921)
}

expectGradient(sarduMatrixInternal.gradientColor(0xff0000, 0x0000ff, 0, 4, 255) == 0xff0000)
expectGradient(sarduMatrixInternal.gradientColor(0xff0000, 0x0000ff, 2, 4, 255) == 0x800080)
expectGradient(sarduMatrixInternal.gradientColor(0xff0000, 0x0000ff, 4, 4, 255) == 0x0000ff)
expectGradient(sarduMatrixInternal.brightnessGradientColor(0xff0000, 200, 20, 0, 4) == 0xc80000)
expectGradient(sarduMatrixInternal.brightnessGradientColor(0xff0000, 200, 20, 2, 4) == 0x6e0000)
expectGradient(sarduMatrixInternal.brightnessGradientColor(0xff0000, 200, 20, 4, 4) == 0x140000)

const matrix = sarduMatrix.create(8, 8, DigitalPin.P1, 64)
const white = neopixel.colors(NeoPixelColors.White)
const red = neopixel.colors(NeoPixelColors.Red)
const blue = neopixel.colors(NeoPixelColors.Blue)
sarduMatrix.drawGradientText(matrix, "A", 0, 0, red, blue, MatrixWipeDirection.LeftToRight, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
sarduMatrix.drawBrightnessGradientText(matrix, "A", 0, 0, white, 128, 8, MatrixWipeDirection.RightToLeft, MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Normal)
sarduMatrix.scrollGradientTextBetween(matrix, "A", 0, 0, 0, 0, red, blue, MatrixWipeDirection.TopToBottom, 0, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
sarduMatrix.scrollBrightnessGradientTextBetween(matrix, "A", 0, 0, 0, 0, white, 128, 8, MatrixWipeDirection.BottomToTop, 0, MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
sarduMatrix.scrollGradientTextFromEdge(matrix, "", MatrixScrollEdge.Right, red, blue, MatrixWipeDirection.LeftToRight, 0, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
sarduMatrix.scrollBrightnessGradientTextFromEdge(matrix, "", MatrixScrollEdge.Right, white, 128, 8, MatrixWipeDirection.LeftToRight, 0, MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
