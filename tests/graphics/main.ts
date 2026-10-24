const matrix = sarduMatrix.create(32, 32, DigitalPin.P1, 64)
const row8 = sarduMatrix.graphicRow8(
    SarduMatrixGraphicPixel.Red, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Blue
)
const row16 = sarduMatrix.graphicRow16(
    SarduMatrixGraphicPixel.Red, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Blue
)
const row32 = sarduMatrix.graphicRow32(
    SarduMatrixGraphicPixel.Red, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent,
    SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Transparent, SarduMatrixGraphicPixel.Blue
)

sarduMatrix.drawNative8x8(matrix, row8, row8, row8, row8, row8, row8, row8, row8, 0, 0, SarduMatrixGraphicMode.Overlay)
sarduMatrix.drawNative16x8(matrix, row16, row16, row16, row16, row16, row16, row16, row16, 0, 0, SarduMatrixGraphicMode.Overlay)
sarduMatrix.drawNative32x8(matrix, row32, row32, row32, row32, row32, row32, row32, row32, 0, 0, SarduMatrixGraphicMode.Overlay)
sarduMatrix.drawNative8x16(matrix, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, 0, 0, SarduMatrixGraphicMode.Overlay)
sarduMatrix.drawNative16x16(matrix, row16, row16, row16, row16, row16, row16, row16, row16, row16, row16, row16, row16, row16, row16, row16, row16, 0, 0, SarduMatrixGraphicMode.Overlay)
sarduMatrix.drawNative8x32(matrix, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, row8, 0, 0, SarduMatrixGraphicMode.ReplaceArea)
matrix.show()
