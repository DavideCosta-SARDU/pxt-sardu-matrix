function expectCore(condition: boolean): void {
    if (!condition) control.panic(921)
}

for (let origin = 0; origin < 4; origin++) {
    for (let axis = 0; axis < 2; axis++) {
        for (let path = 0; path < 2; path++) {
            const seen = pins.createBuffer(64)
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const index = sarduMatrixInternal.pathIndex(
                        x, y, 8, 8,
                        origin as MatrixOrigin,
                        axis as MatrixScanAxis,
                        path as MatrixPath
                    )
                    expectCore(index >= 0 && index < 64 && seen[index] == 0)
                    seen[index] = 1
                }
            }
        }
    }
}

const config = sarduMatrixInternal.modularConfig(
    4, MatrixModuleType.Matrix8x8, 2,
    MatrixOrigin.BottomRight, MatrixScanAxis.Columns, MatrixPath.ZigZag,
    MatrixOrigin.TopRight, MatrixScanAxis.Rows, MatrixPath.ZigZag
)
const seenModules = pins.createBuffer(256)
for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
        const index = sarduMatrixInternal.physicalIndex(config, x, y)
        expectCore(index >= 0 && index < 256 && seenModules[index] == 0)
        seenModules[index] = 1
    }
}
expectCore(config.width == 16 && config.height == 16)
expectCore(config.ledCount == 256 && config.rgbBytes == 768)
expectCore(sarduMatrixInternal.physicalIndex(config, 16, 0) == -1)

const moduleWidths = [8, 16, 32, 8, 16, 8]
const moduleHeights = [8, 16, 8, 32, 8, 16]
for (let moduleType = 0; moduleType < moduleWidths.length; moduleType++) {
    expectCore(sarduMatrixInternal.moduleWidth(moduleType as MatrixModuleType) == moduleWidths[moduleType])
    expectCore(sarduMatrixInternal.moduleHeight(moduleType as MatrixModuleType) == moduleHeights[moduleType])
}

expectCore(sarduMatrixInternal.fontColumn(70, 3, MatrixFont.MicroBitExtended) == 2)
expectCore(sarduMatrixInternal.fontBaseHeight(MatrixFont.MicroBitProportional) == 7)
expectCore(sarduMatrixInternal.glyphWidth(MatrixFont.MicroBitProportional, 73) < sarduMatrixInternal.glyphWidth(MatrixFont.MicroBitProportional, 87))
expectCore(sarduMatrixInternal.glyphWidth(MatrixFont.SarduCompact, 87) == 4)
expectCore(sarduMatrixInternal.glyphWidth(MatrixFont.SarduCompactProportional, 73) < sarduMatrixInternal.glyphWidth(MatrixFont.SarduCompactProportional, 87))

expectCore(sarduMatrixInternal.limitByte(-1) == 0)
expectCore(sarduMatrixInternal.limitByte(300) == 255)
expectCore(sarduMatrixInternal.scaleColor(0xffffff, 128) == 0x808080)
expectCore(sarduMatrix.rgbColor(300, -4, 16) == 0xff0010)
expectCore(sarduMatrix.hslColor(0, 100, 50) == 0xff0000)
expectCore(sarduMatrix.hslColor(120, 100, 50) == 0x00ff00)
expectCore(sarduMatrix.hslColor(240, 100, 50) == 0x0000ff)
