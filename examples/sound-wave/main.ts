let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
let centerY = Math.round((matrix.height() - 1) / 2)
let smoothedLevel = 0
let waveDirection = 1

basic.forever(function () {
    smoothedLevel = Math.round((smoothedLevel * 3 + input.soundLevel()) / 4)
    let amplitude = 0
    if (smoothedLevel > 8) {
        amplitude = Math.round(Math.map(smoothedLevel, 8, 255, 1, centerY))
    }

    let pointDirection = waveDirection
    let previousY = centerY
    matrix.clearBuffer()
    for (let x = 0; x <= matrix.width() - 1; x++) {
        let y = centerY + pointDirection * amplitude
        if (x > 0) {
            sarduMatrix.drawLine(
                matrix,
                x - 1,
                previousY,
                x,
                y,
                neopixel.colors(NeoPixelColors.Blue)
            )
        }
        previousY = y
        pointDirection = pointDirection * -1
    }
    waveDirection = waveDirection * -1
    matrix.show()
    basic.pause(40)
})
