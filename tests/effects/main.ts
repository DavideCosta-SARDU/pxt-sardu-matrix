function expectEffect(condition: boolean): void {
    if (!condition) control.panic(921)
}

const current = pins.createBuffer(3)
current[1] = 100
current[2] = 255
const target = pins.createBuffer(3)
target[0] = 100
target[2] = 255
sarduMatrixInternal.stepEffectBufferToward(current, target, 4)
expectEffect(current[0] == 25 && current[1] == 75 && current[2] == 255)

sarduMatrixInternal.seedEffectRandom(12345)
const first = sarduMatrixInternal.nextEffectRandom(1000)
sarduMatrixInternal.seedEffectRandom(12345)
expectEffect(first == sarduMatrixInternal.nextEffectRandom(1000))

const content = pins.createBuffer(6)
content[0] = 64
content[1] = 64
content[2] = 64
const rainbow = pins.createBuffer(6)
rainbow[0] = 127
rainbow[1] = 63
rainbow[3] = 127
sarduMatrixInternal.maskRainbowFrame(content, rainbow)
expectEffect(rainbow[0] == 64 && rainbow[1] == 32 && rainbow[2] == 0)
expectEffect(rainbow[3] == 0 && rainbow[4] == 0 && rainbow[5] == 0)

const matrix = sarduMatrix.create(2, 2, DigitalPin.P1, 64)
sarduMatrix.fadeToColor(matrix, 0, 0, 1, SarduMatrixEffectEndState.Restore, 128)
sarduMatrix.blinkContent(matrix, 1, 0, 0, SarduMatrixEffectEndState.Restore)
sarduMatrix.colorWipe(matrix, 0xffffff, SarduMatrixWipeDirection.LeftToRight, 0, 0, SarduMatrixEffectEndState.Restore, 128)
sarduMatrix.colorWipe(matrix, 0xffffff, SarduMatrixWipeDirection.RightToLeft, 1, 0, SarduMatrixEffectEndState.Leave, 128)
sarduMatrix.colorWipe(matrix, 0xffffff, SarduMatrixWipeDirection.TopToBottom, 0, 0, SarduMatrixEffectEndState.Clear, 128)
sarduMatrix.colorWipe(matrix, 0xffffff, SarduMatrixWipeDirection.BottomToTop, 1, 0, SarduMatrixEffectEndState.Restore, 128)
sarduMatrix.opposedColorWipe(matrix, 0xff0000, 0x0000ff, SarduMatrixRainbowAxis.Horizontal, 0, false, 0, SarduMatrixEffectEndState.Restore, 128)
sarduMatrix.opposedColorWipe(matrix, 0xff0000, 0x0000ff, SarduMatrixRainbowAxis.Vertical, 0, true, 0, SarduMatrixEffectEndState.Restore, 128)
sarduMatrix.rainbowCycle(matrix, SarduMatrixRainbowAxis.Horizontal, 1, 0, SarduMatrixEffectEndState.Restore)
sarduMatrix.rainbowCycle(matrix, SarduMatrixRainbowAxis.Vertical, 1, 0, SarduMatrixEffectEndState.Restore)
sarduMatrix.sparkles(matrix, 0xffffff, 1, 0, 0, SarduMatrixScrollMode.Exclusive, SarduMatrixEffectEndState.Restore, 128)
