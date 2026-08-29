function expectSarduMatrix(condition: boolean): void {
    if (!condition) control.panic(921);
}

function testPathBijection(width: number, height: number): void {
    for (let origin = 0; origin < 4; origin++) {
        for (let axis = 0; axis < 2; axis++) {
            for (let path = 0; path < 2; path++) {
                const seen: boolean[] = [];
                for (let i = 0; i < width * height; i++) seen.push(false);
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const index = sarduMatrixInternal.pathIndex(
                            x, y, width, height,
                            origin as MatrixOrigin,
                            axis as MatrixScanAxis,
                            path as MatrixPath
                        );
                        expectSarduMatrix(index >= 0 && index < width * height);
                        expectSarduMatrix(!seen[index]);
                        seen[index] = true;
                    }
                }
                for (let i = 0; i < seen.length; i++) expectSarduMatrix(seen[i]);
            }
        }
    }
}

function testModuleType(type: MatrixModuleType, moduleWidth: number, moduleHeight: number): void {
    const grids = [1, 2, 6, 12];
    const rows = [1, 1, 1, 2];
    for (let gridIndex = 0; gridIndex < grids.length; gridIndex++) {
        const count = grids[gridIndex];
        const rowCount = rows[gridIndex];
        const config = sarduMatrixInternal.modularConfig(
            count, type, rowCount,
            MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag,
            MatrixOrigin.TopLeft, MatrixScanAxis.Rows, MatrixPath.ZigZag
        );
        expectSarduMatrix(config.width == moduleWidth * Math.idiv(count, rowCount));
        expectSarduMatrix(config.height == moduleHeight * rowCount);
        expectSarduMatrix(config.rgbBytes == config.ledCount * 3);

        const seen: boolean[] = [];
        for (let i = 0; i < config.ledCount; i++) seen.push(false);
        for (let y = 0; y < config.height; y++) {
            for (let x = 0; x < config.width; x++) {
                const index = sarduMatrixInternal.physicalIndex(config, x, y);
                expectSarduMatrix(index >= 0 && index < config.ledCount);
                expectSarduMatrix(!seen[index]);
                seen[index] = true;
            }
        }
    }
}

function testEquivalent96x16(): void {
    const direct = sarduMatrixInternal.directConfig(
        96, 16, MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag
    );
    const modular = sarduMatrixInternal.modularConfig(
        6, MatrixModuleType.Matrix16x16, 1,
        MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag,
        MatrixOrigin.TopLeft, MatrixScanAxis.Rows, MatrixPath.ZigZag
    );
    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 96; x++) {
            expectSarduMatrix(
                sarduMatrixInternal.physicalIndex(direct, x, y) ==
                sarduMatrixInternal.physicalIndex(modular, x, y)
            );
        }
    }
}

function testAllModularPaths(): void {
    for (let pixelOrigin = 0; pixelOrigin < 4; pixelOrigin++) {
        for (let pixelAxis = 0; pixelAxis < 2; pixelAxis++) {
            for (let pixelPath = 0; pixelPath < 2; pixelPath++) {
                for (let moduleOrigin = 0; moduleOrigin < 4; moduleOrigin++) {
                    for (let moduleAxis = 0; moduleAxis < 2; moduleAxis++) {
                        for (let modulePath = 0; modulePath < 2; modulePath++) {
                            const config = sarduMatrixInternal.modularConfig(
                                4, MatrixModuleType.Matrix8x8, 2,
                                pixelOrigin as MatrixOrigin,
                                pixelAxis as MatrixScanAxis,
                                pixelPath as MatrixPath,
                                moduleOrigin as MatrixOrigin,
                                moduleAxis as MatrixScanAxis,
                                modulePath as MatrixPath
                            );
                            const seen: boolean[] = [];
                            for (let i = 0; i < config.ledCount; i++) seen.push(false);
                            for (let y = 0; y < config.height; y++) {
                                for (let x = 0; x < config.width; x++) {
                                    const index = sarduMatrixInternal.physicalIndex(config, x, y);
                                    expectSarduMatrix(index >= 0 && index < config.ledCount);
                                    expectSarduMatrix(!seen[index]);
                                    seen[index] = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function testFontAndTextMetrics(): void {
    expectSarduMatrix(sarduMatrixInternal.textWidth("") == 0);
    expectSarduMatrix(sarduMatrixInternal.textWidth("ABC") == 17);
    expectSarduMatrix(sarduMatrixInternal.textWidth("ABC", MatrixFont.Sardu, MatrixFontSize.X2) == 34);
    expectSarduMatrix(sarduMatrixInternal.renderedFontHeight(MatrixFont.Sardu, MatrixFontSize.X1) == 8);
    expectSarduMatrix(sarduMatrixInternal.renderedFontHeight(MatrixFont.MicroBitExtended, MatrixFontSize.X1) == 7);
    expectSarduMatrix(
        sarduMatrixInternal.textWidth("...", MatrixFont.SarduProportional) <
        sarduMatrixInternal.textWidth("...", MatrixFont.Sardu)
    );
    // The asymmetric F catches row/column swaps that rotate the Micro:Bit font.
    expectSarduMatrix(sarduMatrixInternal.fontColumn(70, 3, MatrixFont.MicroBitExtended) == 2);
    let lowercaseDiffers = false;
    for (let column = 0; column < 5; column++) {
        if (sarduMatrixInternal.fontColumn(65, column) != sarduMatrixInternal.fontColumn(97, column))
            lowercaseDiffers = true;
    }
    expectSarduMatrix(lowercaseDiffers);
    expectSarduMatrix(sarduMatrixInternal.fontColumn(224, 0) != sarduMatrixInternal.fontColumn(63, 0)); // à is not ?
    expectSarduMatrix(sarduMatrixInternal.fontColumn(8364, 0) != sarduMatrixInternal.fontColumn(63, 0)); // € is not ?
    expectSarduMatrix(sarduMatrixInternal.firstVisibleGlyph("ABCDE", -12) == 2);
    expectSarduMatrix(sarduMatrixInternal.lastVisibleGlyph("ABCDE", 16, 16) == -1);
    expectSarduMatrix(sarduMatrixInternal.centeredCoordinate(0, 15, 5, 15) == 5);
    expectSarduMatrix(sarduMatrixInternal.centeredCoordinate(20, 5, 6, 31) == 10);
    expectSarduMatrix(sarduMatrixInternal.centeredCoordinate(-10, 100, 16, 15) == 0);
    const config = sarduMatrixInternal.directConfig(
        16, 16, MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag
    );
    expectSarduMatrix(sarduMatrixInternal.physicalIndex(config, -1, 0) == -1);
    expectSarduMatrix(sarduMatrixInternal.physicalIndex(config, 0, -1) == -1);
    expectSarduMatrix(sarduMatrixInternal.physicalIndex(config, 16, 0) == -1);
    expectSarduMatrix(sarduMatrixInternal.physicalIndex(config, 0, 16) == -1);
    const notANumber = 0 / 0;
    expectSarduMatrix(sarduMatrixInternal.physicalIndex(config, notANumber, 0) == -1);
    expectSarduMatrix(sarduMatrixInternal.physicalIndex(config, 0, notANumber) == -1);
}

function testColors(): void {
    expectSarduMatrix(sarduMatrix.rgbColor(255, 0, 0) == 0xff0000);
    expectSarduMatrix(sarduMatrix.rgbColor(-10, 300, 51) == 0x00ff33);
    expectSarduMatrix(sarduMatrix.hslColor(0, 100, 50) == 0xff0000);
    expectSarduMatrix(sarduMatrix.hslColor(120, 100, 50) == 0x00ff00);
    expectSarduMatrix(sarduMatrix.hslColor(240, 100, 50) == 0x0000ff);
    expectSarduMatrix(sarduMatrix.hslColor(360, 100, 50) == 0xff0000);
    expectSarduMatrix(sarduMatrix.hslColor(60, 100, 0) == 0x000000);
    expectSarduMatrix(sarduMatrix.hslColor(60, 100, 100) == 0xffffff);
    expectSarduMatrix(sarduMatrixInternal.scaleColor(0xff8000, 128) == 0x804000);
}

testPathBijection(8, 6);
testModuleType(MatrixModuleType.Matrix8x8, 8, 8);
testModuleType(MatrixModuleType.Matrix16x16, 16, 16);
testModuleType(MatrixModuleType.Matrix32x8, 32, 8);
testModuleType(MatrixModuleType.Matrix8x32, 8, 32);
testModuleType(MatrixModuleType.Matrix16x8, 16, 8);
testModuleType(MatrixModuleType.Matrix8x16, 8, 16);
testEquivalent96x16();
testAllModularPaths();
testFontAndTextMetrics();
testColors();
