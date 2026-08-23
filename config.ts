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
    //% block="serpentine"
    Serpentine = 1
}

namespace sarduMatrixInternal {
    // Buffer payload length is a signed C++ int in the current micro:bit target.
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
        return value == MatrixPath.Progressive || value == MatrixPath.Serpentine;
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
