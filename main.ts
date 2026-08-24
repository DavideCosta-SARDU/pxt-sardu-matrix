//% color=#003366 icon="\uf00a" block="SARDU Matrix"
//% groups='["Creation", "Pixels", "Static text", "Scrolling text", "Display", "More"]'
namespace sarduMatrix {
    /** Creates one matrix using its total logical width and height. */
    //% blockId=sardu_matrix_create block="create matrix width %width height %height on pin %pin"
    //% blockSetVariable=matrix group="Creation" weight=100
    //% width.defl=16 height.defl=16 pin.defl=DigitalPin.P0
    export function create(width: number = 16, height: number = 16, pin: DigitalPin = DigitalPin.P0): Matrix {
        return new Matrix(sarduMatrixInternal.directConfig(
            width, height,
            MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag
        ), pin);
    }

    /** Creates one matrix with an explicitly configured physical pixel path. */
    //% blockId=sardu_matrix_create_advanced block="create matrix width %width height %height|pixel start %origin scan %axis path %path|on pin %pin"
    //% blockSetVariable=matrix group="More" weight=15 advanced=true
    //% width.defl=16 height.defl=16 pin.defl=DigitalPin.P0
    export function createAdvanced(
        width: number = 16,
        height: number = 16,
        origin: MatrixOrigin = MatrixOrigin.TopLeft,
        axis: MatrixScanAxis = MatrixScanAxis.Columns,
        path: MatrixPath = MatrixPath.ZigZag,
        pin: DigitalPin = DigitalPin.P0
    ): Matrix {
        return new Matrix(sarduMatrixInternal.directConfig(width, height, origin, axis, path), pin);
    }

    /** Creates a horizontal row of identical matrix modules. */
    //% blockId=sardu_matrix_create_modules block="create %matrixCount matrices of type %matrixType on pin %pin"
    //% blockSetVariable=matrix group="Creation" weight=99
    //% matrixCount.defl=1 matrixCount.min=1 matrixType.defl=MatrixModuleType.Matrix16x16 pin.defl=DigitalPin.P0
    export function createModules(
        matrixCount: number = 1,
        matrixType: MatrixModuleType = MatrixModuleType.Matrix16x16,
        pin: DigitalPin = DigitalPin.P0
    ): Matrix {
        return new Matrix(sarduMatrixInternal.modularConfig(
            matrixCount, matrixType, 1,
            MatrixOrigin.TopLeft, MatrixScanAxis.Columns, MatrixPath.ZigZag,
            MatrixOrigin.TopLeft, MatrixScanAxis.Rows, MatrixPath.ZigZag
        ), pin);
    }

    /** Creates a rectangular grid of modules with explicit physical paths. */
    //% blockId=sardu_matrix_create_modules_advanced block="create %matrixCount matrices of type %matrixType in %matrixRows rows|pixels start %pixelOrigin scan %pixelAxis path %pixelPath|modules start %moduleOrigin scan %moduleAxis path %modulePath|on pin %pin"
    //% blockSetVariable=matrix group="More" weight=14 advanced=true
    //% matrixCount.defl=1 matrixCount.min=1 matrixRows.defl=1 matrixRows.min=1 matrixType.defl=MatrixModuleType.Matrix16x16 pin.defl=DigitalPin.P0
    export function createModulesAdvanced(
        matrixCount: number = 1,
        matrixType: MatrixModuleType = MatrixModuleType.Matrix16x16,
        matrixRows: number = 1,
        pixelOrigin: MatrixOrigin = MatrixOrigin.TopLeft,
        pixelAxis: MatrixScanAxis = MatrixScanAxis.Columns,
        pixelPath: MatrixPath = MatrixPath.ZigZag,
        moduleOrigin: MatrixOrigin = MatrixOrigin.TopLeft,
        moduleAxis: MatrixScanAxis = MatrixScanAxis.Rows,
        modulePath: MatrixPath = MatrixPath.ZigZag,
        pin: DigitalPin = DigitalPin.P0
    ): Matrix {
        return new Matrix(sarduMatrixInternal.modularConfig(
            matrixCount, matrixType, matrixRows,
            pixelOrigin, pixelAxis, pixelPath,
            moduleOrigin, moduleAxis, modulePath
        ), pin);
    }
}
