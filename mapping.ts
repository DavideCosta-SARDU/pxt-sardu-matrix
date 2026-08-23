namespace sarduMatrixInternal {
    /** Maps a logical coordinate to a position in one physical scan path. */
    export function pathIndex(
        x: number,
        y: number,
        width: number,
        height: number,
        origin: MatrixOrigin,
        axis: MatrixScanAxis,
        path: MatrixPath
    ): number {
        const scanX = origin == MatrixOrigin.TopRight || origin == MatrixOrigin.BottomRight
            ? width - 1 - x : x;
        const scanY = origin == MatrixOrigin.BottomLeft || origin == MatrixOrigin.BottomRight
            ? height - 1 - y : y;

        if (axis == MatrixScanAxis.Columns) {
            if (path == MatrixPath.Serpentine && scanX % 2 != 0)
                return scanX * height + height - 1 - scanY;
            return scanX * height + scanY;
        }

        if (path == MatrixPath.Serpentine && scanY % 2 != 0)
            return scanY * width + width - 1 - scanX;
        return scanY * width + scanX;
    }

    /** Maps a display coordinate to its LED position. */
    export function physicalIndex(config: MatrixConfig, x: number, y: number): number {
        if (x != x || y != y) return -1; // NaN must never alias LED zero.
        if (x < 0 || y < 0 || x >= config.width || y >= config.height) return -1;

        if (!config.modular) {
            return pathIndex(x, y, config.width, config.height,
                config.pixelOrigin, config.pixelAxis, config.pixelPath);
        }

        const moduleColumn = Math.idiv(x, config.moduleWidth);
        const moduleRow = Math.idiv(y, config.moduleHeight);
        const localX = x % config.moduleWidth;
        const localY = y % config.moduleHeight;
        const modulePosition = pathIndex(
            moduleColumn, moduleRow,
            config.moduleColumns, config.moduleRows,
            config.moduleOrigin, config.moduleAxis, config.modulePath
        );
        const localPosition = pathIndex(
            localX, localY,
            config.moduleWidth, config.moduleHeight,
            config.pixelOrigin, config.pixelAxis, config.pixelPath
        );
        return modulePosition * config.moduleWidth * config.moduleHeight + localPosition;
    }
}
