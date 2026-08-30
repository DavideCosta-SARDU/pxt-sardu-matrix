namespace sarduMatrix {
    const GRAPHIC_HEADER_BYTES = 8;
    const GRAPHIC_ENCODING_MASK = 1;
    const GRAPHIC_ENCODING_INDEXED4 = 4;

    /** A compact graphic created with the SARDU Matrix graphic editor. */
    //% fixedInstances
    export class MatrixGraphic {
        private data: Buffer;

        constructor(data: Buffer) {
            this.data = data;
        }

        //% blockHidden=true
        _data(): Buffer {
            return this.data;
        }
    }

    /** Creates a compact graphic from editor-generated data. */
    //% blockHidden=true
    export function graphicFromBuffer(data: Buffer): MatrixGraphic {
        return new MatrixGraphic(data);
    }

    /** Selects a graphic. */
    //% blockId=sardu_matrix_graphic_picker block="%graphic"
    //% blockHidden=true shim=TD_ID
    export function _graphicPicker(graphic: MatrixGraphic): MatrixGraphic {
        return graphic;
    }

    function validGraphic(data: Buffer): boolean {
        if (!data || data.length < GRAPHIC_HEADER_BYTES) return false;
        if (data[0] != 0x53 || data[1] != 0x4d || data[2] != 0x47 || data[3] != 0x31) return false;
        const width = data[4];
        const height = data[5];
        const encoding = data[6];
        const colors = data[7];
        if (width <= 0 || height <= 0 || colors <= 0 || colors > 15) return false;
        const pixels = width * height;
        const payload = encoding == GRAPHIC_ENCODING_MASK
            ? Math.idiv(pixels + 7, 8)
            : encoding == GRAPHIC_ENCODING_INDEXED4 ? Math.idiv(pixels + 1, 2) : -1;
        return payload >= 0 && data.length == GRAPHIC_HEADER_BYTES + colors * 3 + payload;
    }

    function graphicIndex(data: Buffer, pixel: number): number {
        const offset = GRAPHIC_HEADER_BYTES + data[7] * 3;
        if (data[6] == GRAPHIC_ENCODING_MASK)
            return (data[offset + Math.idiv(pixel, 8)] & (1 << (7 - pixel % 8))) != 0 ? 1 : 0;
        const packed = data[offset + Math.idiv(pixel, 2)];
        return pixel % 2 == 0 ? packed >> 4 : packed & 0x0f;
    }

    export function drawGraphic(
        matrix: Matrix,
        graphic: MatrixGraphic,
        x: number,
        y: number,
        mode: MatrixGraphicMode
    ): void {
        const data = graphic ? graphic._data() : null;
        if (!validGraphic(data)) return;
        x = Math.floor(x);
        y = Math.floor(y);
        const replace = mode == MatrixGraphicMode.ReplaceArea;
        const width = data[4];
        const height = data[5];
        const colors = data[7];
        for (let gy = 0; gy < height; gy++) {
            for (let gx = 0; gx < width; gx++) {
                const index = graphicIndex(data, gy * width + gx);
                if (index == 0) {
                    if (replace) matrix.setPixel(x + gx, y + gy, 0);
                } else if (index <= colors) {
                    const palette = GRAPHIC_HEADER_BYTES + (index - 1) * 3;
                    matrix.setPixel(x + gx, y + gy,
                        (data[palette] << 16) | (data[palette + 1] << 8) | data[palette + 2]);
                }
            }
        }
    }
}
