namespace sarduMatrix {
    const NATIVE_GRAPHIC_TRANSPARENT = -1;

    /** A transparent cell that preserves the underlying pixel in overlay mode. */
    //% blockId=sardu_matrix_graphic_transparent block="transparent"
    //% group="Graphics" weight=79
    export function graphicTransparent(): number {
        return NATIVE_GRAPHIC_TRANSPARENT;
    }

    /** A real LED color, including black. */
    //% blockId=sardu_matrix_graphic_color block="%value"
    //% group="Graphics" weight=78
    //% shim=TD_ID colorSecondary="#FFFFFF"
    //% value.fieldEditor="colornumber" value.fieldOptions.decompileLiterals=true
    //% value.defl=0xFF0000
    //% value.fieldOptions.colours='["#000000","#FFFFFF","#FF0000","#FF7F00","#FFFF00","#00FF00","#00FFFF","#0000FF","#8000FF","#FF00FF","#808080","#8B4513","#80FF00","#000080","#FFD700"]'
    //% value.fieldOptions.columns=5 value.fieldOptions.className='rgbColorPicker'
    export function graphicColor(value: number): number {
        return value & 0xffffff;
    }

    function graphicFromNativeRows(width: number, height: number, rows: number[][]): MatrixGraphic {
        const cells: number[] = [];
        const palette: number[] = [];
        for (let y = 0; y < height; y++) {
            const row = y < rows.length ? rows[y] : null;
            for (let x = 0; x < width; x++) {
                let color = row && x < row.length ? row[x] : NATIVE_GRAPHIC_TRANSPARENT;
                if (color >= 0) {
                    color &= 0xffffff;
                    let found = false;
                    for (let p = 0; p < palette.length; p++) found = found || palette[p] == color;
                    if (!found && palette.length < 15) palette.push(color);
                }
                cells.push(color);
            }
        }
        if (palette.length == 0) palette.push(0);
        const payload = Math.idiv(width * height + 1, 2);
        const data = control.createBuffer(8 + palette.length * 3 + payload);
        data[0] = 0x53; data[1] = 0x4d; data[2] = 0x47; data[3] = 0x31;
        data[4] = width; data[5] = height; data[6] = 4; data[7] = palette.length;
        for (let p = 0; p < palette.length; p++) {
            data[8 + p * 3] = (palette[p] >> 16) & 0xff;
            data[9 + p * 3] = (palette[p] >> 8) & 0xff;
            data[10 + p * 3] = palette[p] & 0xff;
        }
        const start = 8 + palette.length * 3;
        for (let i = 0; i < cells.length; i++) {
            let index = 0;
            if (cells[i] >= 0) {
                const color = cells[i] & 0xffffff;
                for (let p = 0; p < palette.length; p++) if (palette[p] == color) index = p + 1;
                if (index == 0) index = 1;
            }
            const offset = start + Math.idiv(i, 2);
            if (i % 2 == 0) data[offset] = index << 4;
            else data[offset] |= index;
        }
        return graphicFromBuffer(data);
    }

    //% blockId=sardu_matrix_graphic_row8 block="%p1 %p2 %p3 %p4 %p5 %p6 %p7 %p8"
    //% blockHidden=true inlineInputMode=inline
    //% p1.shadow=sardu_matrix_graphic_transparent
    //% p2.shadow=sardu_matrix_graphic_transparent
    //% p3.shadow=sardu_matrix_graphic_transparent
    //% p4.shadow=sardu_matrix_graphic_transparent
    //% p5.shadow=sardu_matrix_graphic_transparent
    //% p6.shadow=sardu_matrix_graphic_transparent
    //% p7.shadow=sardu_matrix_graphic_transparent
    //% p8.shadow=sardu_matrix_graphic_transparent
    export function graphicRow8(p1: number, p2: number, p3: number, p4: number, p5: number, p6: number, p7: number, p8: number): number[] {
        return [p1, p2, p3, p4, p5, p6, p7, p8];
    }

    //% blockId=sardu_matrix_graphic_row16 block="%p1 %p2 %p3 %p4 %p5 %p6 %p7 %p8 %p9 %p10 %p11 %p12 %p13 %p14 %p15 %p16"
    //% blockHidden=true inlineInputMode=inline
    //% p1.shadow=sardu_matrix_graphic_transparent
    //% p2.shadow=sardu_matrix_graphic_transparent
    //% p3.shadow=sardu_matrix_graphic_transparent
    //% p4.shadow=sardu_matrix_graphic_transparent
    //% p5.shadow=sardu_matrix_graphic_transparent
    //% p6.shadow=sardu_matrix_graphic_transparent
    //% p7.shadow=sardu_matrix_graphic_transparent
    //% p8.shadow=sardu_matrix_graphic_transparent
    //% p9.shadow=sardu_matrix_graphic_transparent
    //% p10.shadow=sardu_matrix_graphic_transparent
    //% p11.shadow=sardu_matrix_graphic_transparent
    //% p12.shadow=sardu_matrix_graphic_transparent
    //% p13.shadow=sardu_matrix_graphic_transparent
    //% p14.shadow=sardu_matrix_graphic_transparent
    //% p15.shadow=sardu_matrix_graphic_transparent
    //% p16.shadow=sardu_matrix_graphic_transparent
    export function graphicRow16(p1: number, p2: number, p3: number, p4: number, p5: number, p6: number, p7: number, p8: number, p9: number, p10: number, p11: number, p12: number, p13: number, p14: number, p15: number, p16: number): number[] {
        return [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16];
    }

    //% blockId=sardu_matrix_graphic_row32 block="%p1 %p2 %p3 %p4 %p5 %p6 %p7 %p8 %p9 %p10 %p11 %p12 %p13 %p14 %p15 %p16 %p17 %p18 %p19 %p20 %p21 %p22 %p23 %p24 %p25 %p26 %p27 %p28 %p29 %p30 %p31 %p32"
    //% blockHidden=true inlineInputMode=inline
    //% p1.shadow=sardu_matrix_graphic_transparent
    //% p2.shadow=sardu_matrix_graphic_transparent
    //% p3.shadow=sardu_matrix_graphic_transparent
    //% p4.shadow=sardu_matrix_graphic_transparent
    //% p5.shadow=sardu_matrix_graphic_transparent
    //% p6.shadow=sardu_matrix_graphic_transparent
    //% p7.shadow=sardu_matrix_graphic_transparent
    //% p8.shadow=sardu_matrix_graphic_transparent
    //% p9.shadow=sardu_matrix_graphic_transparent
    //% p10.shadow=sardu_matrix_graphic_transparent
    //% p11.shadow=sardu_matrix_graphic_transparent
    //% p12.shadow=sardu_matrix_graphic_transparent
    //% p13.shadow=sardu_matrix_graphic_transparent
    //% p14.shadow=sardu_matrix_graphic_transparent
    //% p15.shadow=sardu_matrix_graphic_transparent
    //% p16.shadow=sardu_matrix_graphic_transparent
    //% p17.shadow=sardu_matrix_graphic_transparent
    //% p18.shadow=sardu_matrix_graphic_transparent
    //% p19.shadow=sardu_matrix_graphic_transparent
    //% p20.shadow=sardu_matrix_graphic_transparent
    //% p21.shadow=sardu_matrix_graphic_transparent
    //% p22.shadow=sardu_matrix_graphic_transparent
    //% p23.shadow=sardu_matrix_graphic_transparent
    //% p24.shadow=sardu_matrix_graphic_transparent
    //% p25.shadow=sardu_matrix_graphic_transparent
    //% p26.shadow=sardu_matrix_graphic_transparent
    //% p27.shadow=sardu_matrix_graphic_transparent
    //% p28.shadow=sardu_matrix_graphic_transparent
    //% p29.shadow=sardu_matrix_graphic_transparent
    //% p30.shadow=sardu_matrix_graphic_transparent
    //% p31.shadow=sardu_matrix_graphic_transparent
    //% p32.shadow=sardu_matrix_graphic_transparent
    export function graphicRow32(p1: number, p2: number, p3: number, p4: number, p5: number, p6: number, p7: number, p8: number, p9: number, p10: number, p11: number, p12: number, p13: number, p14: number, p15: number, p16: number, p17: number, p18: number, p19: number, p20: number, p21: number, p22: number, p23: number, p24: number, p25: number, p26: number, p27: number, p28: number, p29: number, p30: number, p31: number, p32: number): number[] {
        return [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32];
    }

    /** Creates a 8 x 8 graphic directly inside MakeCode. */
    //% blockId=sardu_matrix_graphic_8x8 block="graphic 8 x 8|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8"
    //% group="Graphics" weight=77 inlineInputMode=external
    //% r1.shadow=sardu_matrix_graphic_row8
    //% r2.shadow=sardu_matrix_graphic_row8
    //% r3.shadow=sardu_matrix_graphic_row8
    //% r4.shadow=sardu_matrix_graphic_row8
    //% r5.shadow=sardu_matrix_graphic_row8
    //% r6.shadow=sardu_matrix_graphic_row8
    //% r7.shadow=sardu_matrix_graphic_row8
    //% r8.shadow=sardu_matrix_graphic_row8
    export function graphic8x8(r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[]): MatrixGraphic {
        return graphicFromNativeRows(8, 8, [r1, r2, r3, r4, r5, r6, r7, r8]);
    }

    /** Creates a 16 x 16 graphic directly inside MakeCode. */
    //% blockId=sardu_matrix_graphic_16x16 block="graphic 16 x 16|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8|%r9|%r10|%r11|%r12|%r13|%r14|%r15|%r16"
    //% group="Graphics" weight=76 inlineInputMode=external
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
    export function graphic16x16(r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[], r9: number[], r10: number[], r11: number[], r12: number[], r13: number[], r14: number[], r15: number[], r16: number[]): MatrixGraphic {
        return graphicFromNativeRows(16, 16, [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16]);
    }

    /** Creates a 32 x 8 graphic directly inside MakeCode. */
    //% blockId=sardu_matrix_graphic_32x8 block="graphic 32 x 8|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8"
    //% group="Graphics" weight=75 inlineInputMode=external
    //% r1.shadow=sardu_matrix_graphic_row32
    //% r2.shadow=sardu_matrix_graphic_row32
    //% r3.shadow=sardu_matrix_graphic_row32
    //% r4.shadow=sardu_matrix_graphic_row32
    //% r5.shadow=sardu_matrix_graphic_row32
    //% r6.shadow=sardu_matrix_graphic_row32
    //% r7.shadow=sardu_matrix_graphic_row32
    //% r8.shadow=sardu_matrix_graphic_row32
    export function graphic32x8(r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[]): MatrixGraphic {
        return graphicFromNativeRows(32, 8, [r1, r2, r3, r4, r5, r6, r7, r8]);
    }

    /** Creates a 8 x 32 graphic directly inside MakeCode. */
    //% blockId=sardu_matrix_graphic_8x32 block="graphic 8 x 32|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8|%r9|%r10|%r11|%r12|%r13|%r14|%r15|%r16|%r17|%r18|%r19|%r20|%r21|%r22|%r23|%r24|%r25|%r26|%r27|%r28|%r29|%r30|%r31|%r32"
    //% group="Graphics" weight=74 inlineInputMode=external
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
    export function graphic8x32(r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[], r9: number[], r10: number[], r11: number[], r12: number[], r13: number[], r14: number[], r15: number[], r16: number[], r17: number[], r18: number[], r19: number[], r20: number[], r21: number[], r22: number[], r23: number[], r24: number[], r25: number[], r26: number[], r27: number[], r28: number[], r29: number[], r30: number[], r31: number[], r32: number[]): MatrixGraphic {
        return graphicFromNativeRows(8, 32, [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, r30, r31, r32]);
    }

    /** Creates a 16 x 8 graphic directly inside MakeCode. */
    //% blockId=sardu_matrix_graphic_16x8 block="graphic 16 x 8|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8"
    //% group="Graphics" weight=73 inlineInputMode=external
    //% r1.shadow=sardu_matrix_graphic_row16
    //% r2.shadow=sardu_matrix_graphic_row16
    //% r3.shadow=sardu_matrix_graphic_row16
    //% r4.shadow=sardu_matrix_graphic_row16
    //% r5.shadow=sardu_matrix_graphic_row16
    //% r6.shadow=sardu_matrix_graphic_row16
    //% r7.shadow=sardu_matrix_graphic_row16
    //% r8.shadow=sardu_matrix_graphic_row16
    export function graphic16x8(r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[]): MatrixGraphic {
        return graphicFromNativeRows(16, 8, [r1, r2, r3, r4, r5, r6, r7, r8]);
    }

    /** Creates a 8 x 16 graphic directly inside MakeCode. */
    //% blockId=sardu_matrix_graphic_8x16 block="graphic 8 x 16|%r1|%r2|%r3|%r4|%r5|%r6|%r7|%r8|%r9|%r10|%r11|%r12|%r13|%r14|%r15|%r16"
    //% group="Graphics" weight=72 inlineInputMode=external
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
    export function graphic8x16(r1: number[], r2: number[], r3: number[], r4: number[], r5: number[], r6: number[], r7: number[], r8: number[], r9: number[], r10: number[], r11: number[], r12: number[], r13: number[], r14: number[], r15: number[], r16: number[]): MatrixGraphic {
        return graphicFromNativeRows(8, 16, [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16]);
    }

}

