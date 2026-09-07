# Isolated compatibility test: this file is not part of the extension runtime.
matrix = sardu_matrix.create(96, 16, DigitalPin.P1, 128)

matrix.draw_text(
    "Ciao",
    0,
    0,
    neopixel.colors(NeoPixelColors.WHITE),
    MatrixFont.SARDU,
    MatrixFontSize.X1,
    128,
    MatrixTextOrientation.NORMAL
)
matrix.show()

sardu_matrix.add_scrolling_text_path(
    matrix,
    "Ciao",
    -1,
    0,
    0,
    0,
    neopixel.colors(NeoPixelColors.WHITE),
    MatrixFont.SARDU,
    MatrixFontSize.X1,
    128,
    MatrixTextOrientation.NORMAL
)
sardu_matrix.add_scrolling_text_path(
    matrix,
    "Ciao",
    0,
    8,
    matrix.width(),
    8,
    neopixel.colors(NeoPixelColors.WHITE),
    MatrixFont.SARDU_PROPORTIONAL,
    MatrixFontSize.X1,
    128,
    MatrixTextOrientation.NORMAL
)
matrix.start_scrolling(100, MatrixScrollMode.EXCLUSIVE)
