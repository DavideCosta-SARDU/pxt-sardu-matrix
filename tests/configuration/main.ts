const direct = sarduMatrix.create(8, 8, DigitalPin.P1, 128)
const directAdvanced = sarduMatrix.createAdvanced(
    8, 8, SarduMatrixOrigin.TopRight, SarduMatrixScanAxis.Rows,
    SarduMatrixPath.Progressive, DigitalPin.P1, 128
)
const modules = sarduMatrix.createModules(1, SarduMatrixModuleType.Matrix8x8, DigitalPin.P1, 128)
const modulesAdvanced = sarduMatrix.createModulesAdvanced(
    1, SarduMatrixModuleType.Matrix8x8, 1,
    SarduMatrixOrigin.TopLeft, SarduMatrixScanAxis.Columns, SarduMatrixPath.ZigZag,
    SarduMatrixOrigin.TopLeft, SarduMatrixScanAxis.Rows, SarduMatrixPath.Progressive,
    DigitalPin.P1, 128
)

if (direct.width() != 8 || direct.height() != 8 || direct.ledCount() != 64 || direct.rgbBufferBytes() != 192) control.panic(921)
if (directAdvanced.width() != 8 || modules.width() != 8 || modulesAdvanced.height() != 8) control.panic(921)
