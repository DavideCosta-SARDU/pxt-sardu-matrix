namespace sarduMatrixInternal {
    const shapeCoordinateLimit = 1000000;

    export interface ShapeTarget {
        width(): number;
        height(): number;
        setPixel(x: number, y: number, color: number): void;
    }

    function shapeCoordinate(value: number): number {
        if (value != value) return 0;
        if (value > shapeCoordinateLimit) return shapeCoordinateLimit;
        if (value < -shapeCoordinateLimit) return -shapeCoordinateLimit;
        return Math.floor(value);
    }

    function lineOutCode(x: number, y: number, width: number, height: number): number {
        let code = 0;
        if (x < 0) code |= 1;
        else if (x >= width) code |= 2;
        if (y < 0) code |= 4;
        else if (y >= height) code |= 8;
        return code;
    }

    /** Draws a clipped integer line into the matrix buffer. */
    export function drawLine(matrix: ShapeTarget, x1: number, y1: number, x2: number, y2: number, color: number): void {
        const width = matrix.width();
        const height = matrix.height();
        if (width <= 0 || height <= 0) return;
        x1 = shapeCoordinate(x1);
        y1 = shapeCoordinate(y1);
        x2 = shapeCoordinate(x2);
        y2 = shapeCoordinate(y2);

        let code1 = lineOutCode(x1, y1, width, height);
        let code2 = lineOutCode(x2, y2, width, height);
        while (true) {
            if ((code1 | code2) == 0) break;
            if ((code1 & code2) != 0) return;
            const code = code1 != 0 ? code1 : code2;
            let x = 0;
            let y = 0;
            if ((code & 8) != 0) {
                y = height - 1;
                x = x1 + (x2 - x1) * (y - y1) / (y2 - y1);
            } else if ((code & 4) != 0) {
                y = 0;
                x = x1 + (x2 - x1) * (y - y1) / (y2 - y1);
            } else if ((code & 2) != 0) {
                x = width - 1;
                y = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
            } else {
                x = 0;
                y = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
            }
            x = Math.round(x);
            y = Math.round(y);
            if (code == code1) {
                x1 = x;
                y1 = y;
                code1 = lineOutCode(x1, y1, width, height);
            } else {
                x2 = x;
                y2 = y;
                code2 = lineOutCode(x2, y2, width, height);
            }
        }

        const dx = Math.abs(x2 - x1);
        const sx = x1 < x2 ? 1 : -1;
        const dy = -Math.abs(y2 - y1);
        const sy = y1 < y2 ? 1 : -1;
        let error = dx + dy;
        while (true) {
            matrix.setPixel(x1, y1, color);
            if (x1 == x2 && y1 == y2) break;
            const twiceError = 2 * error;
            if (twiceError >= dy) {
                error += dy;
                x1 += sx;
            }
            if (twiceError <= dx) {
                error += dx;
                y1 += sy;
            }
        }
    }

    /** Draws a clipped inclusive rectangle outline into the matrix buffer. */
    export function drawRectangle(matrix: ShapeTarget, x1: number, y1: number, x2: number, y2: number, color: number): void {
        x1 = shapeCoordinate(x1);
        y1 = shapeCoordinate(y1);
        x2 = shapeCoordinate(x2);
        y2 = shapeCoordinate(y2);
        if (x1 > x2) {
            const swapX = x1;
            x1 = x2;
            x2 = swapX;
        }
        if (y1 > y2) {
            const swapY = y1;
            y1 = y2;
            y2 = swapY;
        }
        drawLine(matrix, x1, y1, x2, y1, color);
        if (y2 != y1) drawLine(matrix, x1, y2, x2, y2, color);
        if (y2 - y1 > 1) {
            drawLine(matrix, x1, y1 + 1, x1, y2 - 1, color);
            if (x2 != x1) drawLine(matrix, x2, y1 + 1, x2, y2 - 1, color);
        }
    }

    /** Draws a clipped inclusive filled rectangle into the matrix buffer. */
    export function fillRectangle(matrix: ShapeTarget, x1: number, y1: number, x2: number, y2: number, color: number): void {
        x1 = shapeCoordinate(x1);
        y1 = shapeCoordinate(y1);
        x2 = shapeCoordinate(x2);
        y2 = shapeCoordinate(y2);
        if (x1 > x2) {
            const swapX = x1;
            x1 = x2;
            x2 = swapX;
        }
        if (y1 > y2) {
            const swapY = y1;
            y1 = y2;
            y2 = swapY;
        }
        if (x1 < 0) x1 = 0;
        if (y1 < 0) y1 = 0;
        if (x2 >= matrix.width()) x2 = matrix.width() - 1;
        if (y2 >= matrix.height()) y2 = matrix.height() - 1;
        for (let y = y1; y <= y2; y++)
            for (let x = x1; x <= x2; x++) matrix.setPixel(x, y, color);
    }

    /** Draws a clipped circle into the matrix buffer, with work bounded by the visible area. */
    export function drawCircle(matrix: ShapeTarget, centerX: number, centerY: number, radius: number, color: number, filled: boolean): void {
        centerX = shapeCoordinate(centerX);
        centerY = shapeCoordinate(centerY);
        radius = Math.abs(shapeCoordinate(radius));
        const width = matrix.width();
        const height = matrix.height();
        if (centerX + radius < 0 || centerY + radius < 0 || centerX - radius >= width || centerY - radius >= height) return;
        const radiusSquared = radius * radius;
        const startY = Math.max(0, centerY - radius);
        const endY = Math.min(height - 1, centerY + radius);
        for (let y = startY; y <= endY; y++) {
            const dy = y - centerY;
            const dx = Math.round(Math.sqrt(radiusSquared - dy * dy));
            if (filled) {
                let startX = centerX - dx;
                let endX = centerX + dx;
                if (startX < 0) startX = 0;
                if (endX >= width) endX = width - 1;
                for (let x = startX; x <= endX; x++) matrix.setPixel(x, y, color);
            } else {
                matrix.setPixel(centerX - dx, y, color);
                matrix.setPixel(centerX + dx, y, color);
            }
        }
        if (!filled) {
            const startX = Math.max(0, centerX - radius);
            const endX = Math.min(width - 1, centerX + radius);
            for (let x = startX; x <= endX; x++) {
                const dx = x - centerX;
                const dy = Math.round(Math.sqrt(radiusSquared - dx * dx));
                matrix.setPixel(x, centerY - dy, color);
                matrix.setPixel(x, centerY + dy, color);
            }
        }
    }
}

namespace sarduMatrix {
    /** Draws a line, including both endpoints, without showing it. */
    //% blockId=sardu_matrix_draw_line block="%matrix draw line from x %x1 y %y1 to x %x2 y %y2|color %color=neopixel_colors"
    //% group="Static geometry" weight=90 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix x1.defl=0 y1.defl=0 x2.defl=7 y2.defl=7 color.defl=NeoPixelColors.White
    export function drawLine(matrix: Matrix, x1: number, y1: number, x2: number, y2: number, color: number): void {
        sarduMatrixInternal.drawLine(matrix, x1, y1, x2, y2, color);
    }

    /** Draws an inclusive rectangle outline without showing it. */
    //% blockId=sardu_matrix_draw_rectangle block="%matrix draw rectangle from x %x1 y %y1 to x %x2 y %y2|color %color=neopixel_colors"
    //% group="Static geometry" weight=80 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix x1.defl=0 y1.defl=0 x2.defl=7 y2.defl=7 color.defl=NeoPixelColors.White
    export function drawRectangle(matrix: Matrix, x1: number, y1: number, x2: number, y2: number, color: number): void {
        sarduMatrixInternal.drawRectangle(matrix, x1, y1, x2, y2, color);
    }

    /** Draws an inclusive filled rectangle without showing it. */
    //% blockId=sardu_matrix_fill_rectangle block="%matrix fill rectangle from x %x1 y %y1 to x %x2 y %y2|color %color=neopixel_colors"
    //% group="Static geometry" weight=70 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix x1.defl=0 y1.defl=0 x2.defl=7 y2.defl=7 color.defl=NeoPixelColors.White
    export function fillRectangle(matrix: Matrix, x1: number, y1: number, x2: number, y2: number, color: number): void {
        sarduMatrixInternal.fillRectangle(matrix, x1, y1, x2, y2, color);
    }

    /** Draws a circle outline without showing it. */
    //% blockId=sardu_matrix_draw_circle block="%matrix draw circle center x %centerX y %centerY radius %radius|color %color=neopixel_colors"
    //% group="Static geometry" weight=60 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix centerX.defl=7 centerY.defl=7 radius.defl=4 radius.min=0 color.defl=NeoPixelColors.White
    export function drawCircle(matrix: Matrix, centerX: number, centerY: number, radius: number, color: number): void {
        sarduMatrixInternal.drawCircle(matrix, centerX, centerY, radius, color, false);
    }

    /** Draws a filled circle without showing it. */
    //% blockId=sardu_matrix_fill_circle block="%matrix fill circle center x %centerX y %centerY radius %radius|color %color=neopixel_colors"
    //% group="Static geometry" weight=50 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix centerX.defl=7 centerY.defl=7 radius.defl=4 radius.min=0 color.defl=NeoPixelColors.White
    export function fillCircle(matrix: Matrix, centerX: number, centerY: number, radius: number, color: number): void {
        sarduMatrixInternal.drawCircle(matrix, centerX, centerY, radius, color, true);
    }
}
