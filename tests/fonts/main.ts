function expectFont(condition: boolean): void {
    if (!condition) control.panic(921)
}
expectFont(sarduMatrix.measureFontHeight(SarduMatrixFont.Fixed4x6) == 6)
expectFont(sarduMatrix.measureFontHeight(SarduMatrixFont.Font8x8) == 8)
expectFont(sarduMatrix.measureFontHeight(SarduMatrixFont.Spleen8x16) == 16)
expectFont(sarduMatrix.measureFontHeight(SarduMatrixFont.Spleen8x16, SarduMatrixFontSize.X2) == 32)
// Exact original Fixed 4x6 è bitmap, including its accent and empty final column.
expectFont(sarduMatrixInternal.fontColumn(232, 0, SarduMatrixFont.Fixed4x6) == 13)
expectFont(sarduMatrixInternal.fontColumn(232, 1, SarduMatrixFont.Fixed4x6) == 26)
expectFont(sarduMatrixInternal.fontColumn(232, 2, SarduMatrixFont.Fixed4x6) == 20)
expectFont(sarduMatrixInternal.fontColumn(232, 3, SarduMatrixFont.Fixed4x6) == 0)

let matrix = sarduMatrix.create(96, 16, DigitalPin.P1)
let selected = -1
const fonts = [SarduMatrixFont.Fixed4x6, SarduMatrixFont.Font8x8, SarduMatrixFont.Spleen8x16]
const colors = [neopixel.colors(NeoPixelColors.Red), neopixel.colors(NeoPixelColors.Green), neopixel.colors(NeoPixelColors.Blue)]
const messages = [
    "A scuola sarà una bella giornata: perché ogni bambino può imparare, creare e giocare. Città, caffè, felicità: più curiosità per tutti!",
    "La nostra città si sveglia: c'è chi prepara il caffè e chi va a scuola. Perché sarà una giornata speciale? Cantù è pronta, e tu?",
    "Un saluto da SARDU! Perché sarà così bello imparare insieme? A Cantù c'è curiosità, c'è allegria e ogni nuova idea può diventare realtà."
]
function chooseFont(index: number): void {
    selected = index
    matrix.interruptAndClear()
}
input.onButtonPressed(Button.A, function () { chooseFont(0) })
// The following two font choices require micro:bit V2; V1 reports error 927.
input.onButtonPressed(Button.B, function () { chooseFont(1) })
input.onButtonPressed(Button.AB, function () { chooseFont(2) })
matrix.drawText("premi A / B / A+B", 0, 0, neopixel.colors(NeoPixelColors.White), SarduMatrixFont.Fixed4x6, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
matrix.show()
basic.forever(function () {
    if (selected >= 0) {
        const active = selected
        matrix.scrollTextFromEdge(messages[active], SarduMatrixScrollEdge.Right, colors[active], 50, fonts[active], SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
        basic.pause(200)
    } else {
        basic.pause(20)
    }
})
