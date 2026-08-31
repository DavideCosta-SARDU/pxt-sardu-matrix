/** A directly selectable pixel in a native MakeCode graphic block. */
enum MatrixGraphicPixel {
    //% block="◌" ariaLabel="transparent pixel; preserves the background in overlay mode"
    Transparent = -1,
    //% block="⚫" ariaLabel="black pixel; turns the LED off"
    Black = 0x000000,
    //% block="⚪" ariaLabel="white pixel"
    White = 0xffffff,
    //% block="🔴" ariaLabel="red pixel"
    Red = 0xff0000,
    //% block="🟠" ariaLabel="orange pixel"
    Orange = 0xff7f00,
    //% block="🟡" ariaLabel="yellow pixel"
    Yellow = 0xffff00,
    //% block="🟢" ariaLabel="green pixel"
    Green = 0x00ff00,
    //% block="🟩" ariaLabel="lime pixel"
    Lime = 0x80ff00,
    //% block="🔷" ariaLabel="cyan pixel"
    Cyan = 0x00ffff,
    //% block="🔵" ariaLabel="blue pixel"
    Blue = 0x0000ff,
    //% block="🔹" ariaLabel="navy pixel"
    Navy = 0x000080,
    //% block="🟣" ariaLabel="purple pixel"
    Purple = 0x8000ff,
    //% block="🟪" ariaLabel="magenta pixel"
    Magenta = 0xff00ff,
    //% block="◉" ariaLabel="gray pixel"
    Gray = 0x808080,
    //% block="🟤" ariaLabel="brown pixel"
    Brown = 0x8b4513,
    //% block="🟨" ariaLabel="gold pixel"
    Gold = 0xffd700
}

namespace sarduMatrix {
    function drawNativeRows(matrix: Matrix, width: number, height: number, rows: number[][], x: number, y: number, mode: MatrixGraphicMode): void {
        x = Math.floor(x);
        y = Math.floor(y);
        const replace = mode == MatrixGraphicMode.ReplaceArea;
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            const row = rowIndex < rows.length ? rows[rowIndex] : null;
            for (let column = 0; column < width; column++) {
                const color = row && column < row.length ? row[column] : MatrixGraphicPixel.Transparent;
                if (color >= 0) matrix.setPixel(x + column, y + rowIndex, color);
                else if (replace) matrix.setPixel(x + column, y + rowIndex, 0);
            }
        }
    }

    //% blockId=sardu_matrix_graphic_row8 block="%p1 %p2 %p3 %p4 %p5 %p6 %p7 %p8"
    //% blockHidden=true inlineInputMode=inline
    export function graphicRow8(p1: MatrixGraphicPixel, p2: MatrixGraphicPixel, p3: MatrixGraphicPixel, p4: MatrixGraphicPixel, p5: MatrixGraphicPixel, p6: MatrixGraphicPixel, p7: MatrixGraphicPixel, p8: MatrixGraphicPixel): number[] {
        return [p1, p2, p3, p4, p5, p6, p7, p8];
    }

    //% blockId=sardu_matrix_graphic_row16 block="%p1 %p2 %p3 %p4 %p5 %p6 %p7 %p8 %p9 %p10 %p11 %p12 %p13 %p14 %p15 %p16"
    //% blockHidden=true inlineInputMode=inline
    export function graphicRow16(p1: MatrixGraphicPixel, p2: MatrixGraphicPixel, p3: MatrixGraphicPixel, p4: MatrixGraphicPixel, p5: MatrixGraphicPixel, p6: MatrixGraphicPixel, p7: MatrixGraphicPixel, p8: MatrixGraphicPixel, p9: MatrixGraphicPixel, p10: MatrixGraphicPixel, p11: MatrixGraphicPixel, p12: MatrixGraphicPixel, p13: MatrixGraphicPixel, p14: MatrixGraphicPixel, p15: MatrixGraphicPixel, p16: MatrixGraphicPixel): number[] {
        return [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16];
    }

    //% blockId=sardu_matrix_graphic_row32 block="%p1 %p2 %p3 %p4 %p5 %p6 %p7 %p8 %p9 %p10 %p11 %p12 %p13 %p14 %p15 %p16 %p17 %p18 %p19 %p20 %p21 %p22 %p23 %p24 %p25 %p26 %p27 %p28 %p29 %p30 %p31 %p32"
    //% blockHidden=true inlineInputMode=inline
    export function graphicRow32(p1: MatrixGraphicPixel, p2: MatrixGraphicPixel, p3: MatrixGraphicPixel, p4: MatrixGraphicPixel, p5: MatrixGraphicPixel, p6: MatrixGraphicPixel, p7: MatrixGraphicPixel, p8: MatrixGraphicPixel, p9: MatrixGraphicPixel, p10: MatrixGraphicPixel, p11: MatrixGraphicPixel, p12: MatrixGraphicPixel, p13: MatrixGraphicPixel, p14: MatrixGraphicPixel, p15: MatrixGraphicPixel, p16: MatrixGraphicPixel, p17: MatrixGraphicPixel, p18: MatrixGraphicPixel, p19: MatrixGraphicPixel, p20: MatrixGraphicPixel, p21: MatrixGraphicPixel, p22: MatrixGraphicPixel, p23: MatrixGraphicPixel, p24: MatrixGraphicPixel, p25: MatrixGraphicPixel, p26: MatrixGraphicPixel, p27: MatrixGraphicPixel, p28: MatrixGraphicPixel, p29: MatrixGraphicPixel, p30: MatrixGraphicPixel, p31: MatrixGraphicPixel, p32: MatrixGraphicPixel): number[] {
        return [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32];
    }

    /**
     * Draws a 16 x 16 grid in the matrix buffer. Hollow cells are transparent; black turns LEDs off. Call show afterwards.
     * @param matrix target matrix
     * @param x left coordinate
     * @param y top coordinate
     * @param mode how transparent cells interact with existing pixels
     */
    //% blockId=sardu_matrix_draw_native_16x16 block="%matrix draw 16 x 16 graphic (◌ transparent)|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8|%r9|%r10|%r11|%r12|%r13|%r14|%r15|%r16|at x %x y %y mode %mode"
    //% group="Graphics" weight=77 advanced=true inlineInputMode=external
    //% help=github:pxt-sardu-matrix/docs/graphics
    //% matrix.defl=matrix x.defl=0 y.defl=0 mode.defl=MatrixGraphicMode.Overlay
    //% r1.shadow=sardu_matrix_graphic_row16
    //% r2.shadow=sardu_matrix_graphic_row16
    //% r3.shadow=sardu_matrix_graphic_row16
    //% r4.shadow=sardu_matrix_graphic_row16
    //% r5.shadow=sardu_matrix_graphic_row16
    //% r6.shadow=sardu_matrix_graphic_row16
    //% r7.shadow=sardu_matrix_graphic_row16
    //% r8.shadow=sardu_matrix_graphic_row16
    //% r9.shadow=sardu_matrix_graphic_row16
    //% r10.shadow=sardu_matrix_graphic_row16
    //% r11.shadow=sardu_matrix_graphic_row16
    //% r12.shadow=sardu_matrix_graphic_row16
    //% r13.shadow=sardu_matrix_graphic_row16
    //% r14.shadow=sardu_matrix_graphic_row16
    //% r15.shadow=sardu_matrix_graphic_row16
    //% r16.shadow=sardu_matrix_graphic_row16
    export function drawNative16x16(matrix: Matrix, r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[], r9: number[], r10: number[], r11: number[], r12: number[], r13: number[], r14: number[], r15: number[], r16: number[], x: number = 0, y: number = 0, mode: MatrixGraphicMode = MatrixGraphicMode.Overlay): void {
        drawNativeRows(matrix, 16, 16, [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16], x, y, mode);
    }

    /**
     * Draws an 8 x 8 grid in the matrix buffer. Hollow cells are transparent; black turns LEDs off. Call show afterwards.
     * @param matrix target matrix
     * @param x left coordinate
     * @param y top coordinate
     * @param mode how transparent cells interact with existing pixels
     */
    //% blockId=sardu_matrix_draw_native_8x8 block="%matrix draw 8 x 8 graphic (◌ transparent)|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8|at x %x y %y mode %mode"
    //% group="Graphics" weight=76 advanced=true inlineInputMode=external
    //% help=github:pxt-sardu-matrix/docs/graphics
    //% matrix.defl=matrix x.defl=0 y.defl=0 mode.defl=MatrixGraphicMode.Overlay
    //% r1.shadow=sardu_matrix_graphic_row8
    //% r2.shadow=sardu_matrix_graphic_row8
    //% r3.shadow=sardu_matrix_graphic_row8
    //% r4.shadow=sardu_matrix_graphic_row8
    //% r5.shadow=sardu_matrix_graphic_row8
    //% r6.shadow=sardu_matrix_graphic_row8
    //% r7.shadow=sardu_matrix_graphic_row8
    //% r8.shadow=sardu_matrix_graphic_row8
    export function drawNative8x8(matrix: Matrix, r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[], x: number = 0, y: number = 0, mode: MatrixGraphicMode = MatrixGraphicMode.Overlay): void {
        drawNativeRows(matrix, 8, 8, [r1, r2, r3, r4, r5, r6, r7, r8], x, y, mode);
    }

    /**
     * Draws a 32 x 8 grid in the matrix buffer. Hollow cells are transparent; black turns LEDs off. Call show afterwards.
     * @param matrix target matrix
     * @param x left coordinate
     * @param y top coordinate
     * @param mode how transparent cells interact with existing pixels
     */
    //% blockId=sardu_matrix_draw_native_32x8 block="%matrix draw 32 x 8 graphic (◌ transparent)|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8|at x %x y %y mode %mode"
    //% group="Graphics" weight=75 advanced=true inlineInputMode=external
    //% help=github:pxt-sardu-matrix/docs/graphics
    //% matrix.defl=matrix x.defl=0 y.defl=0 mode.defl=MatrixGraphicMode.Overlay
    //% r1.shadow=sardu_matrix_graphic_row32
    //% r2.shadow=sardu_matrix_graphic_row32
    //% r3.shadow=sardu_matrix_graphic_row32
    //% r4.shadow=sardu_matrix_graphic_row32
    //% r5.shadow=sardu_matrix_graphic_row32
    //% r6.shadow=sardu_matrix_graphic_row32
    //% r7.shadow=sardu_matrix_graphic_row32
    //% r8.shadow=sardu_matrix_graphic_row32
    export function drawNative32x8(matrix: Matrix, r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[], x: number = 0, y: number = 0, mode: MatrixGraphicMode = MatrixGraphicMode.Overlay): void {
        drawNativeRows(matrix, 32, 8, [r1, r2, r3, r4, r5, r6, r7, r8], x, y, mode);
    }

    /**
     * Draws an 8 x 32 grid in the matrix buffer. Hollow cells are transparent; black turns LEDs off. Call show afterwards.
     * @param matrix target matrix
     * @param x left coordinate
     * @param y top coordinate
     * @param mode how transparent cells interact with existing pixels
     */
    //% blockId=sardu_matrix_draw_native_8x32 block="%matrix draw 8 x 32 graphic (◌ transparent)|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8|%r9|%r10|%r11|%r12|%r13|%r14|%r15|%r16|%r17|%r18|%r19|%r20|%r21|%r22|%r23|%r24|%r25|%r26|%r27|%r28|%r29|%r30|%r31|%r32|at x %x y %y mode %mode"
    //% group="Graphics" weight=74 advanced=true inlineInputMode=external
    //% help=github:pxt-sardu-matrix/docs/graphics
    //% matrix.defl=matrix x.defl=0 y.defl=0 mode.defl=MatrixGraphicMode.Overlay
    //% r1.shadow=sardu_matrix_graphic_row8
    //% r2.shadow=sardu_matrix_graphic_row8
    //% r3.shadow=sardu_matrix_graphic_row8
    //% r4.shadow=sardu_matrix_graphic_row8
    //% r5.shadow=sardu_matrix_graphic_row8
    //% r6.shadow=sardu_matrix_graphic_row8
    //% r7.shadow=sardu_matrix_graphic_row8
    //% r8.shadow=sardu_matrix_graphic_row8
    //% r9.shadow=sardu_matrix_graphic_row8
    //% r10.shadow=sardu_matrix_graphic_row8
    //% r11.shadow=sardu_matrix_graphic_row8
    //% r12.shadow=sardu_matrix_graphic_row8
    //% r13.shadow=sardu_matrix_graphic_row8
    //% r14.shadow=sardu_matrix_graphic_row8
    //% r15.shadow=sardu_matrix_graphic_row8
    //% r16.shadow=sardu_matrix_graphic_row8
    //% r17.shadow=sardu_matrix_graphic_row8
    //% r18.shadow=sardu_matrix_graphic_row8
    //% r19.shadow=sardu_matrix_graphic_row8
    //% r20.shadow=sardu_matrix_graphic_row8
    //% r21.shadow=sardu_matrix_graphic_row8
    //% r22.shadow=sardu_matrix_graphic_row8
    //% r23.shadow=sardu_matrix_graphic_row8
    //% r24.shadow=sardu_matrix_graphic_row8
    //% r25.shadow=sardu_matrix_graphic_row8
    //% r26.shadow=sardu_matrix_graphic_row8
    //% r27.shadow=sardu_matrix_graphic_row8
    //% r28.shadow=sardu_matrix_graphic_row8
    //% r29.shadow=sardu_matrix_graphic_row8
    //% r30.shadow=sardu_matrix_graphic_row8
    //% r31.shadow=sardu_matrix_graphic_row8
    //% r32.shadow=sardu_matrix_graphic_row8
    export function drawNative8x32(matrix: Matrix, r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[], r9: number[], r10: number[], r11: number[], r12: number[], r13: number[], r14: number[], r15: number[], r16: number[], r17: number[], r18: number[], r19: number[], r20: number[], r21: number[], r22: number[], r23: number[], r24: number[], r25: number[], r26: number[], r27: number[], r28: number[], r29: number[], r30: number[], r31: number[], r32: number[], x: number = 0, y: number = 0, mode: MatrixGraphicMode = MatrixGraphicMode.Overlay): void {
        drawNativeRows(matrix, 8, 32, [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, r30, r31, r32], x, y, mode);
    }

    /**
     * Draws a 16 x 8 grid in the matrix buffer. Hollow cells are transparent; black turns LEDs off. Call show afterwards.
     * @param matrix target matrix
     * @param x left coordinate
     * @param y top coordinate
     * @param mode how transparent cells interact with existing pixels
     */
    //% blockId=sardu_matrix_draw_native_16x8 block="%matrix draw 16 x 8 graphic (◌ transparent)|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8|at x %x y %y mode %mode"
    //% group="Graphics" weight=73 advanced=true inlineInputMode=external
    //% help=github:pxt-sardu-matrix/docs/graphics
    //% matrix.defl=matrix x.defl=0 y.defl=0 mode.defl=MatrixGraphicMode.Overlay
    //% r1.shadow=sardu_matrix_graphic_row16
    //% r2.shadow=sardu_matrix_graphic_row16
    //% r3.shadow=sardu_matrix_graphic_row16
    //% r4.shadow=sardu_matrix_graphic_row16
    //% r5.shadow=sardu_matrix_graphic_row16
    //% r6.shadow=sardu_matrix_graphic_row16
    //% r7.shadow=sardu_matrix_graphic_row16
    //% r8.shadow=sardu_matrix_graphic_row16
    export function drawNative16x8(matrix: Matrix, r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[], x: number = 0, y: number = 0, mode: MatrixGraphicMode = MatrixGraphicMode.Overlay): void {
        drawNativeRows(matrix, 16, 8, [r1, r2, r3, r4, r5, r6, r7, r8], x, y, mode);
    }

    /**
     * Draws an 8 x 16 grid in the matrix buffer. Hollow cells are transparent; black turns LEDs off. Call show afterwards.
     * @param matrix target matrix
     * @param x left coordinate
     * @param y top coordinate
     * @param mode how transparent cells interact with existing pixels
     */
    //% blockId=sardu_matrix_draw_native_8x16 block="%matrix draw 8 x 16 graphic (◌ transparent)|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8|%r9|%r10|%r11|%r12|%r13|%r14|%r15|%r16|at x %x y %y mode %mode"
    //% group="Graphics" weight=72 advanced=true inlineInputMode=external
    //% help=github:pxt-sardu-matrix/docs/graphics
    //% matrix.defl=matrix x.defl=0 y.defl=0 mode.defl=MatrixGraphicMode.Overlay
    //% r1.shadow=sardu_matrix_graphic_row8
    //% r2.shadow=sardu_matrix_graphic_row8
    //% r3.shadow=sardu_matrix_graphic_row8
    //% r4.shadow=sardu_matrix_graphic_row8
    //% r5.shadow=sardu_matrix_graphic_row8
    //% r6.shadow=sardu_matrix_graphic_row8
    //% r7.shadow=sardu_matrix_graphic_row8
    //% r8.shadow=sardu_matrix_graphic_row8
    //% r9.shadow=sardu_matrix_graphic_row8
    //% r10.shadow=sardu_matrix_graphic_row8
    //% r11.shadow=sardu_matrix_graphic_row8
    //% r12.shadow=sardu_matrix_graphic_row8
    //% r13.shadow=sardu_matrix_graphic_row8
    //% r14.shadow=sardu_matrix_graphic_row8
    //% r15.shadow=sardu_matrix_graphic_row8
    //% r16.shadow=sardu_matrix_graphic_row8
    export function drawNative8x16(matrix: Matrix, r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[], r9: number[], r10: number[], r11: number[], r12: number[], r13: number[], r14: number[], r15: number[], r16: number[], x: number = 0, y: number = 0, mode: MatrixGraphicMode = MatrixGraphicMode.Overlay): void {
        drawNativeRows(matrix, 8, 16, [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16], x, y, mode);
    }

}
