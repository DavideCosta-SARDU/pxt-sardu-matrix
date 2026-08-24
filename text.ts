namespace sarduMatrixInternal {
    export function textWidth(text: string): number {
        if (!text || text.length == 0) return 0;
        return text.length * GLYPH_ADVANCE;
    }

    export function firstVisibleGlyph(text: string, x: number): number {
        if (!text || text.length == 0) return 0;
        let first = Math.ceil((-x - GLYPH_WIDTH + 1) / GLYPH_ADVANCE);
        if (first < 0) first = 0;
        if (first > text.length) first = text.length;
        return first;
    }

    export function lastVisibleGlyph(text: string, x: number, displayWidth: number): number {
        if (!text || text.length == 0 || displayWidth <= 0) return -1;
        let last = Math.floor((displayWidth - 1 - x) / GLYPH_ADVANCE);
        if (last >= text.length) last = text.length - 1;
        return last;
    }

    export function drawText(matrix: sarduMatrix.Matrix, text: string, x: number, y: number, color: number): void {
        if (!text || text.length == 0) return;
        x = Math.floor(x);
        y = Math.floor(y);
        const first = firstVisibleGlyph(text, x);
        const last = lastVisibleGlyph(text, x, matrix.width());
        if (first > last) return;

        for (let characterIndex = first; characterIndex <= last; characterIndex++) {
            const code = text.charCodeAt(characterIndex);
            const glyphX = x + characterIndex * GLYPH_ADVANCE;
            for (let column = 0; column < GLYPH_WIDTH; column++) {
                const bits = fontColumn(code, column);
                if (bits == 0) continue;
                for (let row = 0; row < GLYPH_HEIGHT; row++) {
                    if ((bits & (1 << row)) != 0)
                        matrix._setTextPixel(glyphX + column, y + row, color);
                }
            }
        }
    }

    export function scrollText(
        matrix: sarduMatrix.Matrix,
        text: string,
        startX: number,
        y: number,
        color: number,
        frameIntervalMs: number
    ): void {
        startX = Math.floor(startX);
        y = Math.floor(y);
        frameIntervalMs = Math.floor(frameIntervalMs);
        if (frameIntervalMs != frameIntervalMs) frameIntervalMs = 0;
        if (frameIntervalMs < 0) frameIntervalMs = 0;

        const operation = matrix._beginOperation();
        if (!text || text.length == 0) {
            matrix._clearBuffer();
            matrix.show();
            return;
        }

        const finalX = -textWidth(text);
        for (let x = startX; x >= finalX; x--) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            matrix._clearBuffer();
            drawText(matrix, text, x, y, color);
            matrix.show();
            const remaining = frameIntervalMs - (control.millis() - started);
            // Always yield, even at maximum speed, so button/radio handlers can
            // run interruptAndClear() between two physical WS2812 transfers.
            basic.pause(remaining > 0 ? remaining : 0);
        }

        // The final loop iteration is the blank frame: buffer and display are black.
    }
}
