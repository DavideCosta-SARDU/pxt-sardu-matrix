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
        brightness: number = 255
    ): void {
        if (!text || text.length == 0) return;
        x = Math.floor(x);
        y = Math.floor(y);
        font = normalizedFont(font);
        const scale = normalizedFontSize(size);
        const height = fontBaseHeight(font);
        const visibleColor = scaleColor(color, brightness);
        let penX = x;

        for (let characterIndex = 0; characterIndex < text.length; characterIndex++) {
            const code = text.charCodeAt(characterIndex);
            const width = glyphWidth(font, code);
            const renderedWidth = width * scale;
            if (penX >= matrix.width()) break;
            if (penX + renderedWidth > 0) {
                const microBitBuffer = font == MatrixFont.MicroBitExtended ? microBitGlyph(code) : null;
                for (let column = 0; column < width; column++) {
                    const bits = fontColumn(code, column, font, microBitBuffer);
                    if (bits == 0) continue;
                    for (let row = 0; row < height; row++) {
                        if ((bits & (1 << row)) == 0) continue;
                        for (let scaleX = 0; scaleX < scale; scaleX++) {
                            for (let scaleY = 0; scaleY < scale; scaleY++) {
                                matrix._setTextPixel(
                                    penX + column * scale + scaleX,
                                    y + row * scale + scaleY,
                                    visibleColor
                                );
                            }
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

    export function scrollText(
        matrix: sarduMatrix.Matrix,
        text: string,
        startX: number,
        y: number,
        color: number,
        frameIntervalMs: number,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        brightness: number = 255
    ): void {
        startX = Math.floor(startX);
        y = Math.floor(y);
        frameIntervalMs = Math.floor(frameIntervalMs);
        if (frameIntervalMs != frameIntervalMs || frameIntervalMs < 0) frameIntervalMs = 0;

        const operation = matrix._beginOperation();
        if (!text || text.length == 0) {
            matrix._clearBuffer();
            matrix.show();
            return;
        }

        const finalX = -textWidth(text, font, size);
        for (let x = startX; x >= finalX; x--) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            matrix._clearBuffer();
            drawText(matrix, text, x, y, color, font, size, brightness);
            matrix.show();
            const remaining = frameIntervalMs - (control.millis() - started);
            // Always yield so button and radio handlers can stop the animation.
            basic.pause(remaining > 0 ? remaining : 0);
        }
    }
}
