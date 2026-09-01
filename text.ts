namespace sarduMatrixInternal {
    export function textWidth(
        text: string,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1
    ): number {
        if (!text || text.length == 0) return 0;
        font = normalizedFont(font);
        const scale = normalizedFontSize(size);
        let width = 0;
        for (let index = 0; index < text.length; index++) {
            if (index > 0) width += FONT_GAP;
            width += glyphWidth(font, text.charCodeAt(index));
        }
        return width * scale;
    }

    export function renderedFontHeight(
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1
    ): number {
        return fontBaseHeight(font) * normalizedFontSize(size);
    }

    export function normalizedTextOrientation(orientation: MatrixTextOrientation): MatrixTextOrientation {
        orientation = Math.floor(orientation) as MatrixTextOrientation;
        if (orientation != orientation || orientation < MatrixTextOrientation.Normal || orientation > MatrixTextOrientation.Clockwise270)
            return MatrixTextOrientation.Normal;
        return orientation;
    }

    export function renderedTextWidth(
        text: string,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
    ): number {
        if (!text || text.length == 0) return 0;
        orientation = normalizedTextOrientation(orientation);
        if (orientation == MatrixTextOrientation.Clockwise90 || orientation == MatrixTextOrientation.Clockwise270)
            return renderedFontHeight(font, size);
        return textWidth(text, font, size);
    }

    export function renderedTextHeight(
        text: string,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
    ): number {
        if (!text || text.length == 0) return 0;
        orientation = normalizedTextOrientation(orientation);
        if (orientation == MatrixTextOrientation.Clockwise90 || orientation == MatrixTextOrientation.Clockwise270)
            return textWidth(text, font, size);
        return renderedFontHeight(font, size);
    }

    export function firstVisibleGlyph(
        text: string,
        x: number,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1
    ): number {
        if (!text || text.length == 0) return 0;
        const scale = normalizedFontSize(size);
        let penX = Math.floor(x);
        for (let index = 0; index < text.length; index++) {
            const width = glyphWidth(font, text.charCodeAt(index)) * scale;
            if (penX + width > 0) return index;
            penX += glyphAdvance(font, text.charCodeAt(index)) * scale;
        }
        return text.length;
    }

    export function lastVisibleGlyph(
        text: string,
        x: number,
        displayWidth: number,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1
    ): number {
        if (!text || text.length == 0 || displayWidth <= 0) return -1;
        const scale = normalizedFontSize(size);
        let penX = Math.floor(x);
        let last = -1;
        for (let index = 0; index < text.length; index++) {
            const width = glyphWidth(font, text.charCodeAt(index)) * scale;
            if (penX < displayWidth && penX + width > 0) last = index;
            if (penX >= displayWidth) break;
            penX += glyphAdvance(font, text.charCodeAt(index)) * scale;
        }
        return last;
    }

    export function drawText(
        matrix: sarduMatrix.Matrix,
        text: string,
        x: number,
        y: number,
        color: number,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        brightness: number = 128,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
    ): void {
        if (!text || text.length == 0) return;
        x = Math.floor(x);
        y = Math.floor(y);
        font = normalizedFont(font);
        orientation = normalizedTextOrientation(orientation);
        const scale = normalizedFontSize(size);
        const baseHeight = fontBaseHeight(font) * scale;
        const baseWidth = textWidth(text, font, size);
        const glyphHeight = fontBaseHeight(font);
        const visibleColor = scaleColor(color, brightness);
        let xx = 1;
        let xy = 0;
        let xOffset = 0;
        let yx = 0;
        let yy = 1;
        let yOffset = 0;
        if (orientation == MatrixTextOrientation.Clockwise90) {
            xx = 0; xy = -1; xOffset = baseHeight - 1;
            yx = 1; yy = 0;
        } else if (orientation == MatrixTextOrientation.UpsideDown180) {
            xx = -1; xOffset = baseWidth - 1;
            yy = -1; yOffset = baseHeight - 1;
        } else if (orientation == MatrixTextOrientation.Clockwise270) {
            xx = 0; xy = 1;
            yx = -1; yy = 0; yOffset = baseWidth - 1;
        }
        let penX = 0;

        for (let characterIndex = 0; characterIndex < text.length; characterIndex++) {
            const code = text.charCodeAt(characterIndex);
            const width = glyphWidth(font, code);
            const microBitBuffer = font == MatrixFont.MicroBitExtended ? microBitGlyph(code) : null;
            for (let column = 0; column < width; column++) {
                const bits = fontColumn(code, column, font, microBitBuffer);
                if (bits == 0) continue;
                for (let row = 0; row < glyphHeight; row++) {
                    if ((bits & (1 << row)) == 0) continue;
                    for (let scaleX = 0; scaleX < scale; scaleX++) {
                        for (let scaleY = 0; scaleY < scale; scaleY++) {
                            const localX = penX + column * scale + scaleX;
                            const localY = row * scale + scaleY;
                            matrix._setTextPixel(
                                x + xOffset + localX * xx + localY * xy,
                                y + yOffset + localX * yx + localY * yy,
                                visibleColor
                            );
                        }
                    }
                }
            }
            penX += glyphAdvance(font, code) * scale;
        }
    }

    function clampCoordinate(value: number, maximum: number): number {
        value = Math.floor(value);
        if (value != value || value < 0) return 0;
        if (value > maximum) return maximum;
        return value;
    }

    export function centeredCoordinate(start: number, end: number, contentSize: number, maximum: number): number {
        if (maximum < 0) return 0;
        start = clampCoordinate(start, maximum);
        end = clampCoordinate(end, maximum);
        if (start > end) {
            const swap = start;
            start = end;
            end = swap;
        }
        return start + Math.floor((end - start + 1 - contentSize) / 2);
    }

    function scrollTextPath(
        matrix: sarduMatrix.Matrix,
        text: string,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        stepX: number,
        stepY: number,
        color: number,
        frameIntervalMs: number,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        brightness: number = 128,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
        mode: MatrixScrollMode = MatrixScrollMode.Exclusive
    ): void {
        startX = Math.floor(startX);
        startY = Math.floor(startY);
        endX = Math.floor(endX);
        endY = Math.floor(endY);
        frameIntervalMs = Math.floor(frameIntervalMs);
        if (frameIntervalMs != frameIntervalMs || frameIntervalMs < 0) frameIntervalMs = 0;
        orientation = normalizedTextOrientation(orientation);
        mode = mode == MatrixScrollMode.Composed ? MatrixScrollMode.Composed : MatrixScrollMode.Exclusive;

        const operation = matrix._beginOperation();
        if (!text || text.length == 0) {
            if (mode == MatrixScrollMode.Exclusive) {
                matrix._clearBuffer();
                matrix.show();
            }
            return;
        }

        const background = mode == MatrixScrollMode.Composed
            ? matrix._captureBuffer()
            : null;

        let x = startX;
        let y = startY;
        while (true) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            if (mode == MatrixScrollMode.Composed)
                matrix._restoreBuffer(background);
            else
                matrix._clearBuffer();
            drawText(matrix, text, x, y, color, font, size, brightness, orientation);
            matrix.show();
            const remaining = frameIntervalMs - (control.millis() - started);
            // Always yield so button and radio handlers can stop the animation.
            basic.pause(remaining > 0 ? remaining : 0);
            if (x == endX && y == endY) break;
            x += stepX;
            y += stepY;
        }
    }

    export function scrollText(
        matrix: sarduMatrix.Matrix,
        text: string,
        startX: number,
        y: number,
        color: number,
        frameIntervalMs: number,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        brightness: number = 128,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
        mode: MatrixScrollMode = MatrixScrollMode.Exclusive
    ): void {
        const finalX = -renderedTextWidth(text, font, size, orientation);
        startX = Math.floor(startX);
        if (startX < finalX) return;
        scrollTextPath(
            matrix, text, startX, y, finalX, y, -1, 0,
            color, frameIntervalMs, font, size, brightness, orientation, mode
        );
    }

    export function scrollTextFromEdge(
        matrix: sarduMatrix.Matrix,
        text: string,
        edge: MatrixScrollEdge,
        color: number,
        frameIntervalMs: number,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        brightness: number = 128,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
        mode: MatrixScrollMode = MatrixScrollMode.Exclusive
    ): void {
        edge = Math.floor(edge) as MatrixScrollEdge;
        if (edge < MatrixScrollEdge.Right || edge > MatrixScrollEdge.Bottom) edge = MatrixScrollEdge.Right;
        orientation = normalizedTextOrientation(orientation);
        const contentWidth = renderedTextWidth(text, font, size, orientation);
        const contentHeight = renderedTextHeight(text, font, size, orientation);
        const centeredX = centeredCoordinate(0, matrix.width() - 1, contentWidth, matrix.width() - 1);
        const centeredY = centeredCoordinate(0, matrix.height() - 1, contentHeight, matrix.height() - 1);

        let startX = centeredX;
        let startY = centeredY;
        let endX = centeredX;
        let endY = centeredY;
        let stepX = 0;
        let stepY = 0;
        if (edge == MatrixScrollEdge.Left) {
            startX = -contentWidth; endX = matrix.width(); stepX = 1;
        } else if (edge == MatrixScrollEdge.Top) {
            startY = -contentHeight; endY = matrix.height(); stepY = 1;
        } else if (edge == MatrixScrollEdge.Bottom) {
            startY = matrix.height(); endY = -contentHeight; stepY = -1;
        } else {
            startX = matrix.width(); endX = -contentWidth; stepX = -1;
        }
        scrollTextPath(
            matrix, text, startX, startY, endX, endY, stepX, stepY,
            color, frameIntervalMs, font, size, brightness, orientation, mode
        );
    }
}
