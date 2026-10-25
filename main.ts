/** Configurable RGB matrix creation, drawing and animation. */
//% color=#003366 icon="\uf00a" block="SARDU Matrix"
//% groups='["Creation", "Display", "Static text", "Scrolling text", "Static geometry", "Scrolling geometry", "Icons", "Effects", "Pixels", "Colors", "Graphics"]'
namespace sarduMatrix {
    /**
     * Creates one matrix using its total logical width and height.
     * @param width logical width in pixels
     * @param height logical height in pixels
     * @param pin data output pin connected to DIN
     * @param brightness brightness from 0 to 255
     */
    //% blockId=sardu_matrix_create block="create matrix width %width height %height on pin %pin brightness %brightness"
    //% blockSetVariable=matrix group="Creation" weight=100 help=github:pxt-sardu-matrix/docs/display-configuration
    //% width.defl=16 height.defl=16 pin.defl=DigitalPin.P1 brightness.min=0 brightness.max=255 brightness.defl=128
    export function create(width: number = 16, height: number = 16, pin: DigitalPin = DigitalPin.P1, brightness: number = 128): Matrix {
        return new Matrix(sarduMatrixInternal.directConfig(
            width, height,
            SarduMatrixOrigin.TopLeft, SarduMatrixScanAxis.Columns, SarduMatrixPath.ZigZag
        ), pin, brightness);
    }

    /**
     * Creates one matrix with an explicitly configured physical pixel path.
     * @param width logical width in pixels
     * @param height logical height in pixels
     * @param origin physical corner where the pixel chain starts
     * @param axis scan axis
     * @param path progressive or zigzag pixel order
     * @param pin data output pin connected to DIN
     * @param brightness brightness from 0 to 255
     */
    //% blockId=sardu_matrix_create_advanced block="create matrix width %width height %height|pixel start %origin scan %axis path %path|on pin %pin brightness %brightness"
    //% blockSetVariable=matrix group="Creation" weight=30 advanced=true help=github:pxt-sardu-matrix/docs/display-configuration
    //% width.defl=16 height.defl=16 origin.defl=SarduMatrixOrigin.TopLeft axis.defl=SarduMatrixScanAxis.Columns path.defl=SarduMatrixPath.ZigZag pin.defl=DigitalPin.P1 brightness.min=0 brightness.max=255 brightness.defl=128
    export function createAdvanced(
        width: number = 16,
        height: number = 16,
        origin: SarduMatrixOrigin = SarduMatrixOrigin.TopLeft,
        axis: SarduMatrixScanAxis = SarduMatrixScanAxis.Columns,
        path: SarduMatrixPath = SarduMatrixPath.ZigZag,
        pin: DigitalPin = DigitalPin.P1,
        brightness: number = 128
    ): Matrix {
        return new Matrix(sarduMatrixInternal.directConfig(width, height, origin, axis, path), pin, brightness);
    }

    /**
     * Creates a horizontal row of identical matrix modules.
     * @param moduleCount number of identical modules
     * @param moduleType physical dimensions of each module
     * @param pin data output pin connected to DIN
     * @param brightness brightness from 0 to 255
     */
    //% blockId=sardu_matrix_create_modules block="create matrix with %moduleCount modules of type %moduleType on pin %pin brightness %brightness"
    //% blockSetVariable=matrix group="Creation" weight=99 help=github:pxt-sardu-matrix/docs/display-configuration
    //% moduleCount.defl=1 moduleCount.min=1 moduleType.defl=SarduMatrixModuleType.Matrix16x16 pin.defl=DigitalPin.P1 brightness.min=0 brightness.max=255 brightness.defl=128
    export function createModules(
        moduleCount: number = 1,
        moduleType: SarduMatrixModuleType = SarduMatrixModuleType.Matrix16x16,
        pin: DigitalPin = DigitalPin.P1,
        brightness: number = 128
    ): Matrix {
        return new Matrix(sarduMatrixInternal.modularConfig(
            moduleCount, moduleType, 1,
            SarduMatrixOrigin.TopLeft, SarduMatrixScanAxis.Columns, SarduMatrixPath.ZigZag,
            SarduMatrixOrigin.TopLeft, SarduMatrixScanAxis.Rows, SarduMatrixPath.ZigZag
        ), pin, brightness);
    }

    /**
     * Creates a rectangular grid of modules with explicit physical paths.
     * @param moduleCount number of identical modules
     * @param moduleType physical dimensions of each module
     * @param moduleRows number of complete module rows
     * @param pixelOrigin starting corner inside each module
     * @param pixelAxis pixel scan axis inside each module
     * @param pixelPath progressive or zigzag pixel order inside each module
     * @param moduleOrigin starting corner of the module grid
     * @param moduleAxis module scan axis in the grid
     * @param modulePath progressive or zigzag module order
     * @param pin data output pin connected to DIN
     * @param brightness brightness from 0 to 255
     */
    //% blockId=sardu_matrix_create_modules_advanced block="create matrix with %moduleCount modules of type %moduleType in %moduleRows rows|pixels start %pixelOrigin scan %pixelAxis path %pixelPath|modules start %moduleOrigin scan %moduleAxis path %modulePath|on pin %pin brightness %brightness"
    //% blockSetVariable=matrix group="Creation" weight=29 advanced=true help=github:pxt-sardu-matrix/docs/display-configuration
    //% moduleCount.defl=1 moduleCount.min=1 moduleRows.defl=1 moduleRows.min=1 moduleType.defl=SarduMatrixModuleType.Matrix16x16
    //% pixelOrigin.defl=SarduMatrixOrigin.TopLeft pixelAxis.defl=SarduMatrixScanAxis.Columns pixelPath.defl=SarduMatrixPath.ZigZag
    //% moduleOrigin.defl=SarduMatrixOrigin.TopLeft moduleAxis.defl=SarduMatrixScanAxis.Rows modulePath.defl=SarduMatrixPath.ZigZag pin.defl=DigitalPin.P1 brightness.min=0 brightness.max=255 brightness.defl=128
    export function createModulesAdvanced(
        moduleCount: number = 1,
        moduleType: SarduMatrixModuleType = SarduMatrixModuleType.Matrix16x16,
        moduleRows: number = 1,
        pixelOrigin: SarduMatrixOrigin = SarduMatrixOrigin.TopLeft,
        pixelAxis: SarduMatrixScanAxis = SarduMatrixScanAxis.Columns,
        pixelPath: SarduMatrixPath = SarduMatrixPath.ZigZag,
        moduleOrigin: SarduMatrixOrigin = SarduMatrixOrigin.TopLeft,
        moduleAxis: SarduMatrixScanAxis = SarduMatrixScanAxis.Rows,
        modulePath: SarduMatrixPath = SarduMatrixPath.ZigZag,
        pin: DigitalPin = DigitalPin.P1,
        brightness: number = 128
    ): Matrix {
        return new Matrix(sarduMatrixInternal.modularConfig(
            moduleCount, moduleType, moduleRows,
            pixelOrigin, pixelAxis, pixelPath,
            moduleOrigin, moduleAxis, modulePath
        ), pin, brightness);
    }

    /**
     * Returns the rendered width of a string after applying its orientation.
     * @param text text to render
     * @param font font used to render the text
     * @param size integer scale from 1 to 4
     * @param orientation rotation of the rendered text
     */
    //% blockId=sardu_matrix_text_width block="text width %text font %font size %size orientation %orientation"
    //% group="Static text" weight=12 advanced=true help=github:pxt-sardu-matrix/docs/api
    //% text.defl="Hello" font.defl=SarduMatrixFont.Sardu size.defl=SarduMatrixFontSize.X1 orientation.defl=SarduMatrixTextOrientation.Normal
    export function measureTextWidth(
        text: string,
        font: SarduMatrixFont = SarduMatrixFont.Sardu,
        size: SarduMatrixFontSize = SarduMatrixFontSize.X1,
        orientation: SarduMatrixTextOrientation = SarduMatrixTextOrientation.Normal
    ): number {
        return sarduMatrixInternal.renderedTextWidth(text, font, size, orientation);
    }

    /**
     * Returns the rendered height of a string after applying its orientation.
     * @param text text to render
     * @param font font used to render the text
     * @param size integer scale from 1 to 4
     * @param orientation rotation of the rendered text
     */
    //% blockId=sardu_matrix_text_height block="text height %text font %font size %size orientation %orientation"
    //% group="Static text" weight=11 advanced=true help=github:pxt-sardu-matrix/docs/api
    //% text.defl="Hello" font.defl=SarduMatrixFont.Sardu size.defl=SarduMatrixFontSize.X1 orientation.defl=SarduMatrixTextOrientation.Normal
    export function measureTextHeight(
        text: string,
        font: SarduMatrixFont = SarduMatrixFont.Sardu,
        size: SarduMatrixFontSize = SarduMatrixFontSize.X1,
        orientation: SarduMatrixTextOrientation = SarduMatrixTextOrientation.Normal
    ): number {
        return sarduMatrixInternal.renderedTextHeight(text, font, size, orientation);
    }

    /**
     * Returns the rendered height of the selected font and size.
     * @param font font used to render the text
     * @param size integer scale from 1 to 4
     */
    //% blockId=sardu_matrix_font_height block="font height %font size %size"
    //% group="Static text" weight=10 advanced=true help=github:pxt-sardu-matrix/docs/api
    //% font.defl=SarduMatrixFont.Sardu size.defl=SarduMatrixFontSize.X1
    export function measureFontHeight(
        font: SarduMatrixFont = SarduMatrixFont.Sardu,
        size: SarduMatrixFontSize = SarduMatrixFontSize.X1
    ): number {
        return sarduMatrixInternal.renderedFontHeight(font, size);
    }
}
