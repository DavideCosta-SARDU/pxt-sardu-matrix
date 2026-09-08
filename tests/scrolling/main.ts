const matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 64)
const white = neopixel.colors(NeoPixelColors.White)

matrix.scrollText("A", 0, 0, white, 0, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
matrix.scrollTextFromEdge("", MatrixScrollEdge.Right, white, 0, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Composed)
matrix.scrollTextFromEdge("", MatrixScrollEdge.Left, white, 0, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
matrix.scrollTextFromEdge("", MatrixScrollEdge.Top, white, 0, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
matrix.scrollTextFromEdge("", MatrixScrollEdge.Bottom, white, 0, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
sarduMatrix.scrollTextBetween(matrix, "A", 0, 0, 0, 0, white, 0, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
