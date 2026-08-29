function expectSarduMatrix(condition: boolean): void {
    if (!condition) control.panic(921);
}

function testPath(width: number, height: number, origin: MatrixOrigin, axis: MatrixScanAxis, path: MatrixPath): void {
    const seen: boolean[] = [];
    for (let i = 0; i < width * height; i++) seen.push(false);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = sarduMatrixInternal.pathIndex(x, y, width, height, origin, axis, path);
            expectSarduMatrix(index >= 0 && index < seen.length && !seen[index]);
            seen[index] = true;
        }
    }
}

function testConfigurations(): void {
    testPath(8, 6, MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag);

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
    expectSarduMatrix(sarduMatrixInternal.textWidth("ABC") == 17);
    expectSarduMatrix(sarduMatrixInternal.renderedFontHeight(MatrixFont.Sardu, MatrixFontSize.X1) == 8);
    expectSarduMatrix(sarduMatrixInternal.renderedFontHeight(MatrixFont.MicroBitExtended, MatrixFontSize.X1) == 7);
    expectSarduMatrix(sarduMatrixInternal.renderedTextWidth("ABC", MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Normal) == 17);
    expectSarduMatrix(sarduMatrixInternal.renderedTextHeight("ABC", MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Normal) == 8);
    expectSarduMatrix(sarduMatrixInternal.renderedTextWidth("ABC", MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Clockwise90) == 8);
    expectSarduMatrix(sarduMatrixInternal.renderedTextHeight("ABC", MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Clockwise90) == 17);
    expectSarduMatrix(sarduMatrixInternal.renderedTextWidth("ABC", MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.UpsideDown180) == 17);
    expectSarduMatrix(sarduMatrixInternal.renderedTextWidth("ABC", MatrixFont.Sardu, MatrixFontSize.X1, MatrixTextOrientation.Clockwise270) == 8);
    expectSarduMatrix(sarduMatrixInternal.normalizedTextOrientation(99 as MatrixTextOrientation) == MatrixTextOrientation.Normal);
    expectSarduMatrix(sarduMatrixInternal.fontColumn(70, 3, MatrixFont.MicroBitExtended) == 2);
    expectSarduMatrix(sarduMatrixInternal.fontColumn(224, 0) != sarduMatrixInternal.fontColumn(63, 0));
    expectSarduMatrix(sarduMatrixInternal.centeredCoordinate(0, 15, 5, 15) == 5);
}

function testColors(): void {
    expectSarduMatrix(sarduMatrix.rgbColor(255, 0, 0) == 0xff0000);
    expectSarduMatrix(sarduMatrix.rgbColor(-10, 300, 51) == 0x00ff33);
    expectSarduMatrix(sarduMatrixInternal.scaleColor(0xff8000, 128) == 0x804000);
}

testConfigurations();
testText();
testColors();
