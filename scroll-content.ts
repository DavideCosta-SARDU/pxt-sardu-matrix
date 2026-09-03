namespace sarduMatrixInternal {
    const scrollTextItem = 1;
    const scrollLineItem = 2;
    const scrollRectangleItem = 3;
    const scrollFilledRectangleItem = 4;
    const scrollCircleItem = 5;
    const scrollFilledCircleItem = 6;
    const maximumScrollItems = 32;

    class ScrollItem {
        kind: number;
        x: number;
        color: number;
        text: string;
        p1: number;
        p2: number;
        p3: number;
        p4: number;
        p5: number;
    }

    let pendingScrollMatrix: sarduMatrix.Matrix = null;
    let pendingScrollItems: ScrollItem[] = [];
    let pendingScrollWidth = 0;

    function scrollDimension(value: number, minimum: number): number {
        value = Math.floor(Math.abs(value));
        if (value != value || value < minimum) value = minimum;
        if (value > 1024) value = 1024;
        return value;
    }

    function scrollCoordinate(value: number): number {
        value = Math.floor(value);
        if (value != value) return 0;
        if (value > 1024) return 1024;
        if (value < -1024) return -1024;
        return value;
    }

    function prepareScrollQueue(matrix: sarduMatrix.Matrix): boolean {
        if (!matrix) return false;
        if (pendingScrollMatrix != matrix) {
            pendingScrollMatrix = matrix;
            pendingScrollItems = [];
            pendingScrollWidth = 0;
        }
        return pendingScrollItems.length < maximumScrollItems;
    }

    function appendScrollItem(matrix: sarduMatrix.Matrix, item: ScrollItem, width: number, spacing: number): void {
        if (!prepareScrollQueue(matrix)) return;
        item.x = pendingScrollWidth;
        pendingScrollItems.push(item);
        pendingScrollWidth += width + scrollDimension(spacing, 0);
    }

    export function queueScrollingText(
        matrix: sarduMatrix.Matrix, text: string, y: number, color: number,
        font: MatrixFont, size: MatrixFontSize, brightness: number,
        orientation: MatrixTextOrientation, spacing: number
    ): void {
        if (!text || text.length == 0) return;
        const item = new ScrollItem();
        item.kind = scrollTextItem;
        item.text = text;
        item.color = color;
        item.p1 = scrollCoordinate(y);
        item.p2 = font;
        item.p3 = size;
        item.p4 = limitByte(brightness);
        item.p5 = orientation;
        appendScrollItem(matrix, item, renderedTextWidth(text, font, size, orientation), spacing);
    }

    export function queueScrollingLine(
        matrix: sarduMatrix.Matrix, width: number, startY: number, endY: number,
        color: number, spacing: number
    ): void {
        const item = new ScrollItem();
        item.kind = scrollLineItem;
        item.color = color;
        item.p1 = scrollDimension(width, 1);
        item.p2 = scrollCoordinate(startY);
        item.p3 = scrollCoordinate(endY);
        appendScrollItem(matrix, item, item.p1, spacing);
    }

    export function queueScrollingRectangle(
        matrix: sarduMatrix.Matrix, width: number, height: number, y: number,
        color: number, filled: boolean, spacing: number
    ): void {
        const item = new ScrollItem();
        item.kind = filled ? scrollFilledRectangleItem : scrollRectangleItem;
        item.color = color;
        item.p1 = scrollDimension(width, 1);
        item.p2 = scrollDimension(height, 1);
        item.p3 = scrollCoordinate(y);
        appendScrollItem(matrix, item, item.p1, spacing);
    }

    export function queueScrollingCircle(
        matrix: sarduMatrix.Matrix, radius: number, centerY: number,
        color: number, filled: boolean, spacing: number
    ): void {
        const item = new ScrollItem();
        item.kind = filled ? scrollFilledCircleItem : scrollCircleItem;
        item.color = color;
        item.p1 = scrollDimension(radius, 0);
        item.p2 = scrollCoordinate(centerY);
        appendScrollItem(matrix, item, item.p1 * 2 + 1, spacing);
    }

    function drawScrollItem(matrix: sarduMatrix.Matrix, item: ScrollItem, offsetX: number): void {
        const x = offsetX + item.x;
        if (item.kind == scrollTextItem) {
            drawText(matrix, item.text, x, item.p1, item.color, item.p2, item.p3, item.p4, item.p5);
        } else if (item.kind == scrollLineItem) {
            drawLine(matrix, x, item.p2, x + item.p1 - 1, item.p3, item.color);
        } else if (item.kind == scrollRectangleItem || item.kind == scrollFilledRectangleItem) {
            if (item.kind == scrollFilledRectangleItem)
                fillRectangle(matrix, x, item.p3, x + item.p1 - 1, item.p3 + item.p2 - 1, item.color);
            else
                drawRectangle(matrix, x, item.p3, x + item.p1 - 1, item.p3 + item.p2 - 1, item.color);
        } else {
            drawCircle(matrix, x + item.p1, item.p2, item.p1, item.color, item.kind == scrollFilledCircleItem);
        }
    }

    export function startQueuedScrolling(
        matrix: sarduMatrix.Matrix,
        frameIntervalMs: number,
        mode: MatrixScrollMode
    ): void {
        if (!matrix || pendingScrollMatrix != matrix || pendingScrollItems.length == 0) return;
        frameIntervalMs = Math.floor(frameIntervalMs);
        if (frameIntervalMs != frameIntervalMs || frameIntervalMs < 0) frameIntervalMs = 0;
        mode = mode == MatrixScrollMode.Composed ? MatrixScrollMode.Composed : MatrixScrollMode.Exclusive;

        const items = pendingScrollItems;
        const contentWidth = pendingScrollWidth;
        pendingScrollMatrix = null;
        pendingScrollItems = [];
        pendingScrollWidth = 0;

        const operation = matrix._beginOperation();
        const background = mode == MatrixScrollMode.Composed ? matrix._captureBuffer() : null;
        for (let offsetX = matrix.width(); offsetX >= -contentWidth; offsetX--) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            if (mode == MatrixScrollMode.Composed) matrix._restoreBuffer(background);
            else matrix._clearBuffer();
            for (let i = 0; i < items.length; i++) drawScrollItem(matrix, items[i], offsetX);
            matrix.show();
            const remaining = frameIntervalMs - (control.millis() - started);
            basic.pause(remaining > 0 ? remaining : 0);
        }
    }
}

namespace sarduMatrix {
    /** Adds a line to the pending scrolling composition. */
    //% blockId=sardu_matrix_add_scrolling_line block="%matrix add scrolling line width %width from y %startY to y %endY|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=90 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix width.min=1 width.defl=8 startY.defl=0 endY.defl=7 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    export function addScrollingLine(matrix: Matrix, width: number = 8, startY: number = 0, endY: number = 7, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingLine(matrix, width, startY, endY, color, spacing);
    }

    /** Adds a rectangle outline to the pending scrolling composition. */
    //% blockId=sardu_matrix_add_scrolling_rectangle block="%matrix add scrolling rectangle width %width height %height at y %y|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=80 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix width.min=1 width.defl=8 height.min=1 height.defl=8 y.defl=0 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    export function addScrollingRectangle(matrix: Matrix, width: number = 8, height: number = 8, y: number = 0, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingRectangle(matrix, width, height, y, color, false, spacing);
    }

    /** Adds a filled rectangle to the pending scrolling composition. */
    //% blockId=sardu_matrix_add_scrolling_filled_rectangle block="%matrix add scrolling filled rectangle width %width height %height at y %y|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=70 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix width.min=1 width.defl=8 height.min=1 height.defl=8 y.defl=0 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    export function addScrollingFilledRectangle(matrix: Matrix, width: number = 8, height: number = 8, y: number = 0, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingRectangle(matrix, width, height, y, color, true, spacing);
    }

    /** Adds a circle outline to the pending scrolling composition. */
    //% blockId=sardu_matrix_add_scrolling_circle block="%matrix add scrolling circle radius %radius center y %centerY|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=60 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix radius.min=0 radius.defl=4 centerY.defl=7 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    export function addScrollingCircle(matrix: Matrix, radius: number = 4, centerY: number = 7, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingCircle(matrix, radius, centerY, color, false, spacing);
    }

    /** Adds a filled circle to the pending scrolling composition. */
    //% blockId=sardu_matrix_add_scrolling_filled_circle block="%matrix add scrolling filled circle radius %radius center y %centerY|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=50 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix radius.min=0 radius.defl=4 centerY.defl=7 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    export function addScrollingFilledCircle(matrix: Matrix, radius: number = 4, centerY: number = 7, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingCircle(matrix, radius, centerY, color, true, spacing);
    }

}
