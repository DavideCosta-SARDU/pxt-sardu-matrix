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

const effectContentMask = pins.createBuffer(6);
effectContentMask[0] = 64;
effectContentMask[1] = 64;
effectContentMask[2] = 64;
const effectRainbowFrame = pins.createBuffer(6);
effectRainbowFrame[0] = 127;
effectRainbowFrame[1] = 63;
effectRainbowFrame[3] = 127;
sarduMatrixInternal.maskRainbowFrame(effectContentMask, effectRainbowFrame);
expectSarduMatrix(effectRainbowFrame[0] == 64 && effectRainbowFrame[1] == 32 && effectRainbowFrame[2] == 0);
expectSarduMatrix(effectRainbowFrame[3] == 0 && effectRainbowFrame[4] == 0 && effectRainbowFrame[5] == 0);

expectSarduMatrix(sarduMatrixInternal.gradientColor(0xff0000, 0x0000ff, 0, 4, 255) == 0xff0000);
expectSarduMatrix(sarduMatrixInternal.gradientColor(0xff0000, 0x0000ff, 2, 4, 255) == 0x800080);
expectSarduMatrix(sarduMatrixInternal.gradientColor(0xff0000, 0x0000ff, 4, 4, 255) == 0x0000ff);
expectSarduMatrix(sarduMatrixInternal.brightnessGradientColor(0xff0000, 200, 20, 0, 4) == 0xc80000);
expectSarduMatrix(sarduMatrixInternal.brightnessGradientColor(0xff0000, 200, 20, 2, 4) == 0x6e0000);
expectSarduMatrix(sarduMatrixInternal.brightnessGradientColor(0xff0000, 200, 20, 4, 4) == 0x140000);
