/** Private - do not use. Internal matrix implementation. */
namespace sarduMatrixInternal {
    const scrollTextItem = 1;
    const scrollLineItem = 2;
    const scrollRectangleItem = 3;
    const scrollFilledRectangleItem = 4;
    const scrollCircleItem = 5;
    const scrollFilledCircleItem = 6;
    const scrollTextPathItem = 7;
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
        p6: number;
        p7: number;
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

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function queueScrollingText(
        matrix: sarduMatrix.Matrix, text: string, y: number, color: number,
        font: SarduMatrixFont, size: SarduMatrixFontSize, brightness: number,
        orientation: SarduMatrixTextOrientation, spacing: number
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

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function queueScrollingTextPath(
        matrix: sarduMatrix.Matrix, text: string,
        startX: number, startY: number, endX: number, endY: number,
        color: number, font: SarduMatrixFont, size: SarduMatrixFontSize,
        brightness: number, orientation: SarduMatrixTextOrientation
    ): void {
        if (!text || text.length == 0 || !prepareScrollQueue(matrix)) return;
        const item = new ScrollItem();
        item.kind = scrollTextPathItem;
        item.text = text;
        item.color = color;
        item.x = scrollCoordinate(startX == -1 ? matrix.width() : startX);
        item.p1 = scrollCoordinate(startY);
        item.p2 = scrollCoordinate(endX);
        item.p3 = scrollCoordinate(endY);
        item.p4 = font;
        item.p5 = size;
        item.p6 = limitByte(brightness);
        item.p7 = orientation;
        pendingScrollItems.push(item);
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
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

    /**
     * Private - do not use. Internal matrix implementation.
     */
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

    /**
     * Private - do not use. Internal matrix implementation.
     */
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
        } else if (item.kind == scrollCircleItem || item.kind == scrollFilledCircleItem) {
            drawCircle(matrix, x + item.p1, item.p2, item.p1, item.color, item.kind == scrollFilledCircleItem);
        }
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function startQueuedScrolling(
        matrix: sarduMatrix.Matrix,
        frameIntervalMs: number,
        mode: SarduMatrixScrollMode
    ): void {
        if (!matrix || pendingScrollMatrix != matrix || pendingScrollItems.length == 0) return;
        frameIntervalMs = Math.floor(frameIntervalMs);
        if (frameIntervalMs != frameIntervalMs || frameIntervalMs < 0) frameIntervalMs = 0;
        mode = mode == SarduMatrixScrollMode.Composed ? SarduMatrixScrollMode.Composed : SarduMatrixScrollMode.Exclusive;

        const items = pendingScrollItems;
        const contentWidth = pendingScrollWidth;
        pendingScrollMatrix = null;
        pendingScrollItems = [];
        pendingScrollWidth = 0;

        const operation = matrix._beginOperation();
        const background = mode == SarduMatrixScrollMode.Composed ? matrix._captureBuffer() : null;
        let hasComposition = false;
        for (let i = 0; i < items.length; i++)
            if (items[i].kind != scrollTextPathItem) hasComposition = true;

        if (hasComposition) {
            for (let offsetX = matrix.width(); offsetX >= -contentWidth; offsetX--) {
                if (!matrix._operationIsActive(operation)) return;
                const started = control.millis();
                if (mode == SarduMatrixScrollMode.Composed) matrix._restoreBuffer(background);
                else matrix._clearBuffer();
                for (let i = 0; i < items.length; i++)
                    if (items[i].kind != scrollTextPathItem) drawScrollItem(matrix, items[i], offsetX);
                matrix.show();
                const remaining = frameIntervalMs - (control.millis() - started);
                basic.pause(remaining > 0 ? remaining : 0);
            }
        }

        let hasPaths = false;
        let pathFrameCount = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind != scrollTextPathItem) continue;
            hasPaths = true;
            pathFrameCount = Math.max(
                pathFrameCount,
                Math.max(Math.abs(item.p2 - item.x), Math.abs(item.p3 - item.p1))
            );
        }

        if (hasPaths) {
            for (let frame = 0; frame <= pathFrameCount; frame++) {
                if (!matrix._operationIsActive(operation)) return;
                const started = control.millis();
                if (mode == SarduMatrixScrollMode.Composed) matrix._restoreBuffer(background);
                else matrix._clearBuffer();
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.kind != scrollTextPathItem) continue;
                    const itemFrames = Math.max(Math.abs(item.p2 - item.x), Math.abs(item.p3 - item.p1));
                    const itemFrame = Math.min(frame, itemFrames);
                    const x = itemFrames == 0 ? item.p2 : Math.round(item.x + (item.p2 - item.x) * itemFrame / itemFrames);
                    const y = itemFrames == 0 ? item.p3 : Math.round(item.p1 + (item.p3 - item.p1) * itemFrame / itemFrames);
                    drawText(matrix, item.text, x, y, item.color, item.p4, item.p5, item.p6, item.p7);
                }
                matrix.show();
                const remaining = frameIntervalMs - (control.millis() - started);
                basic.pause(remaining > 0 ? remaining : 0);
            }
        }
    }
}

/** Configurable RGB matrix creation, drawing and animation. */
namespace sarduMatrix {
    /**
     * Adds a text path that starts only when start scrolling is called.
     * @param matrix target matrix
     * @param text text to render
     * @param startX initial horizontal coordinate in pixels
     * @param startY initial vertical coordinate in pixels
     * @param endX final horizontal coordinate in pixels
     * @param endY final vertical coordinate in pixels
     * @param color RGB color, chosen with the color picker or an RGB/HSL block
     * @param font font used to render the text
     * @param size integer scale from 1 to 4
     * @param brightness brightness from 0 to 255
     * @param orientation rotation of the rendered text
     */
    //% blockId=sardu_matrix_add_scrolling_text_path block="$matrix add text $text with path from x $startX y $startY to x $endX y $endY||color $color=neopixel_colors font $font size $size brightness $brightness orientation $orientation"
    //% group="Scrolling text" weight=72 help=github:pxt-sardu-matrix/docs/api
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=7 expandableArgumentBreaks="6"
    //% matrix.shadow=variables_get matrix.defl=matrix text.defl="Hello" startX.defl=-1 startY.defl=0 endX.defl=0 endY.defl=0 color.defl=NeoPixelColors.White font.defl=SarduMatrixFont.Sardu size.defl=SarduMatrixFontSize.X1 brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=SarduMatrixTextOrientation.Normal
    //% color.snippet="neopixel.colors(NeoPixelColors.White)" color.pySnippet="neopixel.colors(NeoPixelColors.WHITE)"
    export function addScrollingTextPath(
        matrix: Matrix, text: string,
        startX: number, startY: number, endX: number, endY: number,
        color: number = NeoPixelColors.White,
        font: SarduMatrixFont = SarduMatrixFont.Sardu,
        size: SarduMatrixFontSize = SarduMatrixFontSize.X1,
        brightness: number = 128,
        orientation: SarduMatrixTextOrientation = SarduMatrixTextOrientation.Normal
    ): void {
        sarduMatrixInternal.queueScrollingTextPath(
            matrix, text, startX, startY, endX, endY,
            color, font, size, brightness, orientation
        );
    }

    /**
     * Adds a line to the pending scrolling composition.
     * @param matrix target matrix
     * @param width logical width in pixels
     * @param startY initial vertical coordinate in pixels
     * @param endY final vertical coordinate in pixels
     * @param color RGB color, chosen with the color picker or an RGB/HSL block
     * @param spacing blank pixels after this scrolling item
     */
    //% blockId=sardu_matrix_add_scrolling_line block="%matrix add scrolling line width %width from y %startY to y %endY|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=90 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix width.min=1 width.defl=8 startY.defl=0 endY.defl=7 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    //% color.snippet="neopixel.colors(NeoPixelColors.White)" color.pySnippet="neopixel.colors(NeoPixelColors.WHITE)"
    export function addScrollingLine(matrix: Matrix, width: number = 8, startY: number = 0, endY: number = 7, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingLine(matrix, width, startY, endY, color, spacing);
    }

    /**
     * Adds a rectangle outline to the pending scrolling composition.
     * @param matrix target matrix
     * @param width logical width in pixels
     * @param height logical height in pixels
     * @param y vertical coordinate in pixels; zero is the top edge
     * @param color RGB color, chosen with the color picker or an RGB/HSL block
     * @param spacing blank pixels after this scrolling item
     */
    //% blockId=sardu_matrix_add_scrolling_rectangle block="%matrix add scrolling rectangle width %width height %height at y %y|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=80 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix width.min=1 width.defl=8 height.min=1 height.defl=8 y.defl=0 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    //% color.snippet="neopixel.colors(NeoPixelColors.White)" color.pySnippet="neopixel.colors(NeoPixelColors.WHITE)"
    export function addScrollingRectangle(matrix: Matrix, width: number = 8, height: number = 8, y: number = 0, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingRectangle(matrix, width, height, y, color, false, spacing);
    }

    /**
     * Adds a filled rectangle to the pending scrolling composition.
     * @param matrix target matrix
     * @param width logical width in pixels
     * @param height logical height in pixels
     * @param y vertical coordinate in pixels; zero is the top edge
     * @param color RGB color, chosen with the color picker or an RGB/HSL block
     * @param spacing blank pixels after this scrolling item
     */
    //% blockId=sardu_matrix_add_scrolling_filled_rectangle block="%matrix add scrolling filled rectangle width %width height %height at y %y|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=70 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix width.min=1 width.defl=8 height.min=1 height.defl=8 y.defl=0 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    //% color.snippet="neopixel.colors(NeoPixelColors.White)" color.pySnippet="neopixel.colors(NeoPixelColors.WHITE)"
    export function addScrollingFilledRectangle(matrix: Matrix, width: number = 8, height: number = 8, y: number = 0, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingRectangle(matrix, width, height, y, color, true, spacing);
    }

    /**
     * Adds a circle outline to the pending scrolling composition.
     * @param matrix target matrix
     * @param radius circle radius in pixels
     * @param centerY vertical coordinate of the circle center
     * @param color RGB color, chosen with the color picker or an RGB/HSL block
     * @param spacing blank pixels after this scrolling item
     */
    //% blockId=sardu_matrix_add_scrolling_circle block="%matrix add scrolling circle radius %radius center y %centerY|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=60 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix radius.min=0 radius.defl=4 centerY.defl=7 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    //% color.snippet="neopixel.colors(NeoPixelColors.White)" color.pySnippet="neopixel.colors(NeoPixelColors.WHITE)"
    export function addScrollingCircle(matrix: Matrix, radius: number = 4, centerY: number = 7, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingCircle(matrix, radius, centerY, color, false, spacing);
    }

    /**
     * Adds a filled circle to the pending scrolling composition.
     * @param matrix target matrix
     * @param radius circle radius in pixels
     * @param centerY vertical coordinate of the circle center
     * @param color RGB color, chosen with the color picker or an RGB/HSL block
     * @param spacing blank pixels after this scrolling item
     */
    //% blockId=sardu_matrix_add_scrolling_filled_circle block="%matrix add scrolling filled circle radius %radius center y %centerY|color %color=neopixel_colors spacing %spacing"
    //% group="Scrolling geometry" weight=50 help=github:pxt-sardu-matrix/docs/shapes
    //% matrix.shadow=variables_get matrix.defl=matrix radius.min=0 radius.defl=4 centerY.defl=7 color.defl=NeoPixelColors.White spacing.min=0 spacing.defl=1
    //% color.snippet="neopixel.colors(NeoPixelColors.White)" color.pySnippet="neopixel.colors(NeoPixelColors.WHITE)"
    export function addScrollingFilledCircle(matrix: Matrix, radius: number = 4, centerY: number = 7, color: number = NeoPixelColors.White, spacing: number = 1): void {
        sarduMatrixInternal.queueScrollingCircle(matrix, radius, centerY, color, true, spacing);
    }

}
