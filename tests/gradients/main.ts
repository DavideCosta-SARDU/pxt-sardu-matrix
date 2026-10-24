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
sarduMatrix.drawGradientText(matrix, "A", 0, 0, red, blue, SarduMatrixWipeDirection.LeftToRight, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
sarduMatrix.drawBrightnessGradientText(matrix, "A", 0, 0, white, 128, 8, SarduMatrixWipeDirection.RightToLeft, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, SarduMatrixTextOrientation.Normal)
sarduMatrix.scrollGradientTextBetween(matrix, "A", 0, 0, 0, 0, red, blue, SarduMatrixWipeDirection.TopToBottom, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
sarduMatrix.scrollBrightnessGradientTextBetween(matrix, "A", 0, 0, 0, 0, white, 128, 8, SarduMatrixWipeDirection.BottomToTop, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
sarduMatrix.scrollGradientTextFromEdge(matrix, "", SarduMatrixScrollEdge.Right, red, blue, SarduMatrixWipeDirection.LeftToRight, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
sarduMatrix.scrollBrightnessGradientTextFromEdge(matrix, "", SarduMatrixScrollEdge.Right, white, 128, 8, SarduMatrixWipeDirection.LeftToRight, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
