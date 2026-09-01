//% color=#003366 icon="\uf00a" block="SARDU Matrix"
//% groups='["Creation", "Display", "Static text", "Scrolling text", "Static geometry", "Scrolling geometry", "Pixels", "Colors", "Graphics"]'
namespace sarduMatrix {
    /** Creates one matrix using its total logical width and height. */
    //% blockId=sardu_matrix_create block="create matrix width %width height %height on pin %pin brightness %brightness"
    //% blockSetVariable=matrix group="Creation" weight=100
    //% width.defl=16 height.defl=16 pin.defl=DigitalPin.P0 brightness.min=0 brightness.max=255 brightness.defl=128
    export function create(width: number = 16, height: number = 16, pin: DigitalPin = DigitalPin.P0, brightness: number = 128): Matrix {
        return new Matrix(sarduMatrixInternal.directConfig(
            width, height,
            MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag
        ), pin, brightness);
    }

    /** Creates one matrix with an explicitly configured physical pixel path. */
    //% blockId=sardu_matrix_create_advanced block="create matrix width %width height %height|pixel start %origin scan %axis path %path|on pin %pin brightness %brightness"
    //% blockSetVariable=matrix group="Creation" weight=30 advanced=true
    //% width.defl=16 height.defl=16 origin.defl=MatrixOrigin.TopLeft axis.defl=MatrixScanAxis.Columns path.defl=MatrixPath.ZigZag pin.defl=DigitalPin.P0 brightness.min=0 brightness.max=255 brightness.defl=128
    export function createAdvanced(
        width: number = 16,
        height: number = 16,
        origin: MatrixOrigin = MatrixOrigin.TopLeft,
        axis: MatrixScanAxis = MatrixScanAxis.Columns,
        path: MatrixPath = MatrixPath.ZigZag,
        pin: DigitalPin = DigitalPin.P0,
        brightness: number = 128
    ): Matrix {
        return new Matrix(sarduMatrixInternal.directConfig(width, height, origin, axis, path), pin, brightness);
    }

    /** Creates a horizontal row of identical matrix modules. */
    //% blockId=sardu_matrix_create_modules block="create matrix with %moduleCount modules of type %moduleType on pin %pin brightness %brightness"
    //% blockSetVariable=matrix group="Creation" weight=99
    //% moduleCount.defl=1 moduleCount.min=1 moduleType.defl=MatrixModuleType.Matrix16x16 pin.defl=DigitalPin.P0 brightness.min=0 brightness.max=255 brightness.defl=128
    export function createModules(
        moduleCount: number = 1,
        moduleType: MatrixModuleType = MatrixModuleType.Matrix16x16,
        pin: DigitalPin = DigitalPin.P0,
        brightness: number = 128
    ): Matrix {
        return new Matrix(sarduMatrixInternal.modularConfig(
            moduleCount, moduleType, 1,
            MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag,
            MatrixOrigin.TopLeft, MatrixScanAxis.Rows, MatrixPath.ZigZag
        ), pin, brightness);
    }

    /** Creates a rectangular grid of modules with explicit physical paths. */
    //% blockId=sardu_matrix_create_modules_advanced block="create matrix with %moduleCount modules of type %moduleType in %moduleRows rows|pixels start %pixelOrigin scan %pixelAxis path %pixelPath|modules start %moduleOrigin scan %moduleAxis path %modulePath|on pin %pin brightness %brightness"
    //% blockSetVariable=matrix group="Creation" weight=29 advanced=true
    //% moduleCount.defl=1 moduleCount.min=1 moduleRows.defl=1 moduleRows.min=1 moduleType.defl=MatrixModuleType.Matrix16x16
    //% pixelOrigin.defl=MatrixOrigin.TopLeft pixelAxis.defl=MatrixScanAxis.Columns pixelPath.defl=MatrixPath.ZigZag
    //% moduleOrigin.defl=MatrixOrigin.TopLeft moduleAxis.defl=MatrixScanAxis.Rows modulePath.defl=MatrixPath.ZigZag pin.defl=DigitalPin.P0 brightness.min=0 brightness.max=255 brightness.defl=128
    export function createModulesAdvanced(
        moduleCount: number = 1,
        moduleType: MatrixModuleType = MatrixModuleType.Matrix16x16,
        moduleRows: number = 1,
        pixelOrigin: MatrixOrigin = MatrixOrigin.TopLeft,
        pixelAxis: MatrixScanAxis = MatrixScanAxis.Columns,
        pixelPath: MatrixPath = MatrixPath.ZigZag,
        moduleOrigin: MatrixOrigin = MatrixOrigin.TopLeft,
        moduleAxis: MatrixScanAxis = MatrixScanAxis.Rows,
        modulePath: MatrixPath = MatrixPath.ZigZag,
        pin: DigitalPin = DigitalPin.P0,
        brightness: number = 128
    ): Matrix {
        return new Matrix(sarduMatrixInternal.modularConfig(
            moduleCount, moduleType, moduleRows,
            pixelOrigin, pixelAxis, pixelPath,
            moduleOrigin, moduleAxis, modulePath
        ), pin, brightness);
    }

    /** Returns the rendered width of a string after applying its orientation. */
    //% blockId=sardu_matrix_text_width block="text width %text font %font size %size orientation %orientation"
    //% group="Static text" weight=12 advanced=true
    //% text.defl="Hello" font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 orientation.defl=MatrixTextOrientation.Normal
    export function measureTextWidth(
        text: string,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
    ): number {
        return sarduMatrixInternal.renderedTextWidth(text, font, size, orientation);
    }

    /** Returns the rendered height of a string after applying its orientation. */
    //% blockId=sardu_matrix_text_height block="text height %text font %font size %size orientation %orientation"
    //% group="Static text" weight=11 advanced=true
    //% text.defl="Hello" font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 orientation.defl=MatrixTextOrientation.Normal
    export function measureTextHeight(
        text: string,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
    ): number {
        return sarduMatrixInternal.renderedTextHeight(text, font, size, orientation);
    }

    /** Returns the rendered height of the selected font and size. */
    //% blockId=sardu_matrix_font_height block="font height %font size %size"
    //% group="Static text" weight=10 advanced=true
    //% font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1
    export function measureFontHeight(
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1
    ): number {
        return sarduMatrixInternal.renderedFontHeight(font, size);
    }
}
