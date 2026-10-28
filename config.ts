/** Physical size of one matrix module. */
enum SarduMatrixModuleType {
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
enum SarduMatrixOrigin {
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
enum SarduMatrixScanAxis {
    //% block="rows"
    Rows = 0,
    //% block="columns"
    Columns = 1
}

/** Shape of the data path. */
enum SarduMatrixPath {
    //% block="progressive"
    Progressive = 0,
    //% block="zigzag"
    ZigZag = 1,
    // Kept as a hidden alias so existing TypeScript projects still compile.
    //% blockHidden=true
    Serpentine = 1
}

/** Font used to draw text on the matrix. */
enum SarduMatrixFont {
    //% block="SARDU"
    Sardu = 0,
    //% block="micro:bit extended"
    MicroBitExtended = 1,
    //% block="SARDU proportional"
    SarduProportional = 2,
    //% block="micro:bit proportional"
    MicroBitProportional = 3,
    //% block="SARDU compact"
    SarduCompact = 4,
    //% block="SARDU compact proportional"
    SarduCompactProportional = 5
}

/** Integer scale applied to a text font. */
enum SarduMatrixFontSize {
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
enum SarduMatrixTextOrientation {
    //% block="0°"
    Normal = 0,
    //% block="90°"
    Clockwise90 = 1,
    //% block="180°"
    UpsideDown180 = 2,
    //% block="270°"
    Clockwise270 = 3
}

/** Edge from which an automatically positioned text line enters the matrix. */
enum SarduMatrixScrollEdge {
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
enum SarduMatrixScrollMode {
    //% block="clear display"
    Exclusive = 0,
    //% block="preserve background"
    Composed = 1
}

/** How transparent pixels in a graphic interact with the current matrix content. */
enum SarduMatrixGraphicMode {
    //% block="overlay"
    Overlay = 0,
    //% block="replace area"
    ReplaceArea = 1
}

/** State left on the matrix when an effect ends. */
enum SarduMatrixEffectEndState {
    //% block="leave last frame"
    Leave = 0,
    //% block="restore previous content"
    Restore = 1,
    //% block="clear matrix"
    Clear = 2
}

/** Direction used by a progressive color wipe. */
enum SarduMatrixWipeDirection {
    //% block="left to right"
    LeftToRight = 0,
    //% block="right to left"
    RightToLeft = 1,
    //% block="top to bottom"
    TopToBottom = 2,
    //% block="bottom to top"
    BottomToTop = 3
}

/** Axis along which rainbow colors change. */
enum SarduMatrixRainbowAxis {
    //% block="horizontal"
    Horizontal = 0,
    //% block="vertical"
    Vertical = 1
}

/** Built-in 8 x 8 image drawn in the matrix buffer. */
enum SarduMatrixIcon {
    //% block="filled heart"
    FilledHeart = 0,
    //% block="heart outline"
    HeartOutline = 1,
    //% block="smile"
    Smile = 2,
    //% block="sad face"
    SadFace = 3,
    //% block="star"
    Star = 4,
    //% block="check"
    Check = 5,
    //% block="cross"
    Cross = 6,
    //% block="arrow up"
    ArrowUp = 7,
    //% block="arrow down"
    ArrowDown = 8,
    //% block="arrow left"
    ArrowLeft = 9,
    //% block="arrow right"
    ArrowRight = 10,
    //% block="sun"
    Sun = 11,
    //% block="moon"
    Moon = 12,
    //% block="lightning"
    Lightning = 13
}

/** Private - do not use. Internal matrix implementation. */
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
        pixelOrigin: SarduMatrixOrigin;
        pixelAxis: SarduMatrixScanAxis;
        pixelPath: SarduMatrixPath;
        moduleOrigin: SarduMatrixOrigin;
        moduleAxis: SarduMatrixScanAxis;
        modulePath: SarduMatrixPath;
    }

    function fail(): void {
        control.panic(CONFIG_PANIC);
    }

    function isPositiveInteger(value: number): boolean {
        return value > 0 && Math.floor(value) == value;
    }

    function validOrigin(value: SarduMatrixOrigin): boolean {
        return value >= SarduMatrixOrigin.TopLeft && value <= SarduMatrixOrigin.BottomRight;
    }

    function validAxis(value: SarduMatrixScanAxis): boolean {
        return value == SarduMatrixScanAxis.Rows || value == SarduMatrixScanAxis.Columns;
    }

    function validPath(value: SarduMatrixPath): boolean {
        return value == SarduMatrixPath.Progressive || value == SarduMatrixPath.ZigZag;
    }

    function validatePath(origin: SarduMatrixOrigin, axis: SarduMatrixScanAxis, path: SarduMatrixPath): void {
        if (!validOrigin(origin) || !validAxis(axis) || !validPath(path)) fail();
    }

    function checkedLedCount(width: number, height: number): number {
        if (!isPositiveInteger(width) || !isPositiveInteger(height)) fail();
        const maxLeds = Math.idiv(MAX_REPRESENTABLE_BUFFER_BYTES, 3);
        if (width > Math.idiv(maxLeds, height)) fail();
        return width * height;
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function moduleWidth(matrixType: SarduMatrixModuleType): number {
        switch (matrixType) {
            case SarduMatrixModuleType.Matrix8x8: return 8;
            case SarduMatrixModuleType.Matrix16x16: return 16;
            case SarduMatrixModuleType.Matrix32x8: return 32;
            case SarduMatrixModuleType.Matrix8x32: return 8;
            case SarduMatrixModuleType.Matrix16x8: return 16;
            case SarduMatrixModuleType.Matrix8x16: return 8;
            default: fail(); return 0;
        }
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function moduleHeight(matrixType: SarduMatrixModuleType): number {
        switch (matrixType) {
            case SarduMatrixModuleType.Matrix8x8: return 8;
            case SarduMatrixModuleType.Matrix16x16: return 16;
            case SarduMatrixModuleType.Matrix32x8: return 8;
            case SarduMatrixModuleType.Matrix8x32: return 32;
            case SarduMatrixModuleType.Matrix16x8: return 8;
            case SarduMatrixModuleType.Matrix8x16: return 16;
            default: fail(); return 0;
        }
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function directConfig(
        width: number,
        height: number,
        origin: SarduMatrixOrigin,
        axis: SarduMatrixScanAxis,
        path: SarduMatrixPath
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
        config.moduleOrigin = SarduMatrixOrigin.TopLeft;
        config.moduleAxis = SarduMatrixScanAxis.Rows;
        config.modulePath = SarduMatrixPath.Progressive;
        return config;
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function modularConfig(
        matrixCount: number,
        matrixType: SarduMatrixModuleType,
        matrixRows: number,
        pixelOrigin: SarduMatrixOrigin,
        pixelAxis: SarduMatrixScanAxis,
        pixelPath: SarduMatrixPath,
        moduleOrigin: SarduMatrixOrigin,
        moduleAxis: SarduMatrixScanAxis,
        modulePath: SarduMatrixPath
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
