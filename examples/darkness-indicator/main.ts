let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
let smoothedLight = 128

basic.forever(function () {
    smoothedLight = Math.idiv(smoothedLight * 3 + input.lightLevel(), 4)
    let darkness = 255 - smoothedLight
    let illuminatedLines = Math.round(Math.map(darkness, 0, 255, 0, matrix.height()))
    let brightness = Math.round(Math.map(darkness, 0, 255, 16, 128))

    matrix.setBrightness(brightness)
    matrix.clearBuffer()
    for (let line = 0; line < illuminatedLines; line++) {
        let y = matrix.height() - 1 - line
        sarduMatrix.drawLine(
            matrix,
            0,
            y,
            matrix.width() - 1,
            y,
            neopixel.colors(NeoPixelColors.Yellow)
        )
    }
    matrix.show()
    basic.pause(100)
})
