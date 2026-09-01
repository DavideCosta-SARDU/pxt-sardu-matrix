function expectSarduMatrix(condition: boolean): void {
    if (!condition) control.panic(921);
}

expectSarduMatrix(sarduMatrixInternal.pathIndex(
    0, 0, 8, 8, MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag
) == 0);
expectSarduMatrix(sarduMatrixInternal.fontColumn(70, 3, MatrixFont.MicroBitExtended) == 2);

const currentEffectBuffer = pins.createBuffer(3);
currentEffectBuffer[0] = 0;
currentEffectBuffer[1] = 100;
currentEffectBuffer[2] = 255;
const targetEffectBuffer = pins.createBuffer(3);
targetEffectBuffer[0] = 100;
targetEffectBuffer[1] = 0;
targetEffectBuffer[2] = 255;
sarduMatrixInternal.stepEffectBufferToward(currentEffectBuffer, targetEffectBuffer, 4);
expectSarduMatrix(currentEffectBuffer[0] == 25 && currentEffectBuffer[1] == 75 && currentEffectBuffer[2] == 255);
sarduMatrixInternal.stepEffectBufferToward(currentEffectBuffer, targetEffectBuffer, 3);
sarduMatrixInternal.stepEffectBufferToward(currentEffectBuffer, targetEffectBuffer, 2);
sarduMatrixInternal.stepEffectBufferToward(currentEffectBuffer, targetEffectBuffer, 1);
expectSarduMatrix(currentEffectBuffer[0] == 100 && currentEffectBuffer[1] == 0 && currentEffectBuffer[2] == 255);

sarduMatrixInternal.seedEffectRandom(12345);
const firstEffectRandom = sarduMatrixInternal.nextEffectRandom(1000);
const secondEffectRandom = sarduMatrixInternal.nextEffectRandom(1000);
sarduMatrixInternal.seedEffectRandom(12345);
expectSarduMatrix(firstEffectRandom == sarduMatrixInternal.nextEffectRandom(1000));
expectSarduMatrix(secondEffectRandom == sarduMatrixInternal.nextEffectRandom(1000));
