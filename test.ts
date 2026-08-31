function expectSarduMatrix(condition: boolean): void {
    if (!condition) control.panic(921);
}

expectSarduMatrix(sarduMatrixInternal.pathIndex(
    0, 0, 8, 8, MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag
) == 0);
expectSarduMatrix(sarduMatrixInternal.fontColumn(70, 3, MatrixFont.MicroBitExtended) == 2);
