function expectSarduMatrix(condition: boolean): void {
    if (!condition) control.panic(921);
}

function testConfigurations(): void {
    expectSarduMatrix(sarduMatrixInternal.pathIndex(0, 0, 8, 6, MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag) == 0);
    expectSarduMatrix(sarduMatrixInternal.pathIndex(1, 0, 8, 6, MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag) == 11);
    expectSarduMatrix(sarduMatrixInternal.pathIndex(1, 5, 8, 6, MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag) == 6);

    const config = sarduMatrixInternal.modularConfig(
        4, MatrixModuleType.Matrix16x16, 2,
        MatrixOrigin.TopRight, MatrixScanAxis.Columns, MatrixPath.ZigZag,
        MatrixOrigin.BottomLeft, MatrixScanAxis.Rows, MatrixPath.Progressive
    );
    expectSarduMatrix(config.width == 32 && config.height == 32);
    expectSarduMatrix(config.rgbBytes == config.ledCount * 3);
    expectSarduMatrix(sarduMatrixInternal.physicalIndex(config, -1, 0) == -1);
    expectSarduMatrix(sarduMatrixInternal.physicalIndex(config, config.width, 0) == -1);
}

function testText(): void {
    expectSarduMatrix(sarduMatrixInternal.renderedTextWidth("ABC", MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Clockwise90) == 8);
    expectSarduMatrix(sarduMatrixInternal.fontColumn(70, 3, MatrixFont.MicroBitExtended) == 2);
}

testConfigurations();
testText();
