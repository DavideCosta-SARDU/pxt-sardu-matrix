// Representative public API smoke test. Full coverage remains in tests/.
// No external hardware is required to execute this program in the simulator.
function sarduMatrixExpect(condition: boolean): void {
    if (!condition) control.panic(921)
}

let matrix = sarduMatrix.create(8, 8, DigitalPin.P1, 64)
const white = neopixel.colors(NeoPixelColors.White)
const red = sarduMatrix.rgbColor(255, 0, 0)
sarduMatrixExpect(matrix.width() == 8 && matrix.height() == 8)
sarduMatrixExpect(matrix.ledCount() == 64 && matrix.rgbBufferBytes() == 192)
sarduMatrixExpect(red == 0xff0000)
sarduMatrixExpect(sarduMatrix.hslColor(120, 100, 50) == 0x00ff00)

matrix.clearBuffer()
matrix.setPixel(0, 0, white)
matrix.drawText("A", 0, 0, white)
sarduMatrix.drawLine(matrix, 0, 7, 7, 0, red)
matrix.show()
sarduMatrixExpect(sarduMatrix.measureTextWidth("A") > 0)
sarduMatrixExpect(sarduMatrix.measureFontHeight() == 8)

// Exercise both scroll APIs, including a normal width expression in X.
matrix.scrollText("A", matrix.width(), 0, white, 0)
matrix.scrollTextFromEdge("A", SarduMatrixScrollEdge.Right, white, 0)
sarduMatrix.sparkles(matrix, white, 10, 1, 1)
matrix.interruptAndClear()
