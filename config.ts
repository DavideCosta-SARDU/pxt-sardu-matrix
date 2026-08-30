/** Physical size of one matrix module. */
enum MatrixModuleType {
    //% block="8 x 8"
    Matrix8x8 = 0,
    //% block="16 x 16"
    Matrix16x16 = 1,
    //% block="32 x 8"
    Matrix32x8 = 2,
    //% block="8 x 32"
    Matrix8x32 = 3,
    //% block="16 x 8"
    Matrix16x8 = 4,
    //% block="8 x 16"
    Matrix8x16 = 5
}

/** Physical corner where the data chain starts. */
enum MatrixOrigin {
    //% block="top left"
    TopLeft = 0,
    //% block="top right"
    TopRight = 1,
    //% block="bottom left"
    BottomLeft = 2,
    //% block="bottom right"
    BottomRight = 3
}

/** Primary direction followed by the data chain. */
enum MatrixScanAxis {
    //% block="rows"
    Rows = 0,
    //% block="columns"
    Columns = 1
}

/** Shape of the data path. */
enum MatrixPath {
    //% block="progressive"
    Progressive = 0,
    //% block="ZigZag"
    ZigZag = 1,
    // Kept as a hidden alias so existing TypeScript projects still compile.
    //% blockHidden=true
    Serpentine = 1
}

/** Font used to draw text on the matrix. */
enum MatrixFont {
    //% block="SARDU"
    Sardu = 0,
    //% block="Micro:Bit extended"
    MicroBitExtended = 1,
    //% block="SARDU proportional"
    SarduProportional = 2
}

/** Integer scale applied to a text font. */
enum MatrixFontSize {
    //% block="1x"
    X1 = 1,
    //% block="2x"
    X2 = 2,
    //% block="3x"
    X3 = 3,
    //% block="4x"
    X4 = 4
}

/** Rotation applied to the complete rendered text line. */
enum MatrixTextOrientation {
    //% block="normal (0 degrees)"
    Normal = 0,
    //% block="90 degrees clockwise"
    Clockwise90 = 1,
    //% block="180 degrees"
    UpsideDown180 = 2,
    //% block="270 degrees clockwise"
    Clockwise270 = 3
}

/** Edge from which an automatically positioned text line enters the matrix. */
enum MatrixScrollEdge {
    //% block="right"
    Right = 0,
    //% block="left"
    Left = 1,
    //% block="top"
    Top = 2,
    //% block="bottom"
    Bottom = 3
}

/** How scrolling text interacts with content already in the RGB buffer. */
enum MatrixScrollMode {
    //% block="exclusive (clear display)"
    Exclusive = 0,
    //% block="composed (preserve background)"
    Composed = 1
}

namespace sarduMatrixInternal {
    // Buffer payload length is a signed C++ int in the current Micro:Bit target.
    // This guards representation only; practical limits remain available RAM and
    // the maximum single allocation supported by the selected runtime.
    export const MAX_REPRESENTABLE_BUFFER_BYTES = 0x7fffffff;
    export const CONFIG_PANIC = 920;

    export class MatrixConfig {
        width: number;
        height: number;
        ledCount: number;
        rgbBytes: number;
        moduleWidth: number;
        moduleHeight: number;
        moduleColumns: number;
        moduleRows: number;
        modular: boolean;
        pixelOrigin: MatrixOrigin;
        pixelAxis: MatrixScanAxis;
        pixelPath: MatrixPath;
        moduleOrigin: MatrixOrigin;
        moduleAxis: MatrixScanAxis;
        modulePath: MatrixPath;
    }

    function fail(): void {
        control.panic(CONFIG_PANIC);
    }

    function isPositiveInteger(value: number): boolean {
        return value > 0 && Math.floor(value) == value;
    }

    function validOrigin(value: MatrixOrigin): boolean {
        return value >= MatrixOrigin.TopLeft && value <= MatrixOrigin.BottomRight;
    }

    function validAxis(value: MatrixScanAxis): boolean {
        return value == MatrixScanAxis.Rows || value == MatrixScanAxis.Columns;
    }

    function validPath(value: MatrixPath): boolean {
        return value == MatrixPath.Progressive || value == MatrixPath.ZigZag;
    }

    function validatePath(origin: MatrixOrigin, axis: MatrixScanAxis, path: MatrixPath): void {
        if (!validOrigin(origin) || !validAxis(axis) || !validPath(path)) fail();
    }

    function checkedLedCount(width: number, height: number): number {
        if (!isPositiveInteger(width) || !isPositiveInteger(height)) fail();
        const maxLeds = Math.idiv(MAX_REPRESENTABLE_BUFFER_BYTES, 3);
        if (width > Math.idiv(maxLeds, height)) fail();
        return width * height;
    }

    export function moduleWidth(matrixType: MatrixModuleType): number {
        switch (matrixType) {
            case MatrixModuleType.Matrix8x8: return 8;
            case MatrixModuleType.Matrix16x16: return 16;
            case MatrixModuleType.Matrix32x8: return 32;
            case MatrixModuleType.Matrix8x32: return 8;
            case MatrixModuleType.Matrix16x8: return 16;
            case MatrixModuleType.Matrix8x16: return 8;
            default: fail(); return 0;
        }
    }

    export function moduleHeight(matrixType: MatrixModuleType): number {
        switch (matrixType) {
            case MatrixModuleType.Matrix8x8: return 8;
            case MatrixModuleType.Matrix16x16: return 16;
            case MatrixModuleType.Matrix32x8: return 8;
            case MatrixModuleType.Matrix8x32: return 32;
            case MatrixModuleType.Matrix16x8: return 8;
            case MatrixModuleType.Matrix8x16: return 16;
            default: fail(); return 0;
        }
    }

    export function directConfig(
        width: number,
        height: number,
        origin: MatrixOrigin,
        axis: MatrixScanAxis,
        path: MatrixPath
    ): MatrixConfig {
        validatePath(origin, axis, path);
        const config = new MatrixConfig();
        config.width = width;
        config.height = height;
        config.ledCount = checkedLedCount(width, height);
        config.rgbBytes = config.ledCount * 3;
        config.moduleWidth = width;
        config.moduleHeight = height;
        config.moduleColumns = 1;
        config.moduleRows = 1;
        config.modular = false;
        config.pixelOrigin = origin;
        config.pixelAxis = axis;
        config.pixelPath = path;
        config.moduleOrigin = MatrixOrigin.TopLeft;
        config.moduleAxis = MatrixScanAxis.Rows;
        config.modulePath = MatrixPath.Progressive;
        return config;
    }

    export function modularConfig(
        matrixCount: number,
        matrixType: MatrixModuleType,
        matrixRows: number,
        pixelOrigin: MatrixOrigin,
        pixelAxis: MatrixScanAxis,
        pixelPath: MatrixPath,
        moduleOrigin: MatrixOrigin,
        moduleAxis: MatrixScanAxis,
        modulePath: MatrixPath
    ): MatrixConfig {
        if (!isPositiveInteger(matrixCount) || !isPositiveInteger(matrixRows)) fail();
        if (matrixCount % matrixRows != 0) fail();
        validatePath(pixelOrigin, pixelAxis, pixelPath);
        validatePath(moduleOrigin, moduleAxis, modulePath);

        const mw = moduleWidth(matrixType);
        const mh = moduleHeight(matrixType);
        const columns = Math.idiv(matrixCount, matrixRows);
        const width = mw * columns;
        const height = mh * matrixRows;
        const config = new MatrixConfig();
        config.width = width;
        config.height = height;
        config.ledCount = checkedLedCount(width, height);
        config.rgbBytes = config.ledCount * 3;
        config.moduleWidth = mw;
        config.moduleHeight = mh;
        config.moduleColumns = columns;
        config.moduleRows = matrixRows;
        config.modular = true;
        config.pixelOrigin = pixelOrigin;
        config.pixelAxis = pixelAxis;
        config.pixelPath = pixelPath;
        config.moduleOrigin = moduleOrigin;
        config.moduleAxis = moduleAxis;
        config.modulePath = modulePath;
        return config;
    }
}
