const matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 64)
const white = neopixel.colors(NeoPixelColors.White)

matrix.scrollText("A", 0, 0, white, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
matrix.scrollTextFromEdge("", SarduMatrixScrollEdge.Right, white, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Composed)
matrix.scrollTextFromEdge("", SarduMatrixScrollEdge.Left, white, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
matrix.scrollTextFromEdge("", SarduMatrixScrollEdge.Top, white, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
matrix.scrollTextFromEdge("", SarduMatrixScrollEdge.Bottom, white, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
sarduMatrix.scrollTextBetween(matrix, "A", 0, 0, 0, 0, white, 0, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
