namespace sarduMatrixInternal {
    // Independently assembled for SARDU-Matrix. Five columns and eight rows.
    // Printable ASCII has distinct uppercase and lowercase glyphs. Frequently
    // used Latin accented characters are composed from their real base glyph
    // and diacritic; selected Latin symbols have dedicated glyphs.
    const FONT = hex`000000000000005f00000007000700127f127f12242a7f2a12330b34320136495d22500004030000001c2241000041221c002a1c3e1c2a08083e080800403010000808080808006060000040300806013e5149453e44427f4040426151494641494949361814127f104f494949313e4949493001710905033649494936064949493e0000363600004036160000081422411414141414412214080002015109063e415d555e7e0909097e7f494949363e414141417f4141413e7f494949417f090909013e414949797f0808087f41417f41412040413f017f081422417f404040407f020c027f7f0608307f3e4141413e7f090909063e4151215e7f09192946464949493101017f01013f4040403f0f3040300f7f2018207f631408146303047804036151494543007f41410001060830400041417f00040201020440404040400001020400080836414100007f0000414136080808040c0804`;

    const LOWERCASE = hex`20545454787f484444383844444420384444487f3854545418087e0901020c5252523e7f0804047800447d40002040403d007f1028440000417f40007c047804787c0804047838444444387c14141408081414187c7c080404084854545420043f4440203c4040207c1c2040201c3c4030403c44281028440c5050503c4464544c44`;

    // Æ, æ, Œ, œ, ß, Ø, ø, ¿, ¡, °, €, £, ©, ®, ×, ÷
    const SPECIAL = hex`7e09097f4920545478543e41417f493844447c547e090949363e61514946384c54443830484d400000007d00000007060700143e55554148547e51423e4955493e3e4d55493e221408142208002a0008`;

    // Records: character code (little endian), base character, accent kind.
    const ACCENT_MAP = hex`c0004101c1004102c2004103c3004104c4004105c5004106c7004307c8004501c9004502ca004503cb004505cc004901cd004902ce004903cf004905d1004e04d2004f01d3004f02d4004f03d5004f04d6004f05d9005501da005502db005503dc005505dd00590278015905e0006101e1006102e2006103e3006104e4006105e5006106e7006307e8006501e9006502ea006503eb006505ec006901ed006902ee006903ef006905f1006e04f2006f01f3006f02f4006f03f5006f04f6006f05f9007501fa007502fb007503fc007505fd007902ff007905`;
    const ACCENT_COLUMNS = hex`00000000000001020000000002010000020102000201020100000100010000020102000000000000`;
    // Records: character code (little endian), Micro:Bit fallback character.
    const SPECIAL_MAP = hex`c60041e6006152014f53016fdf0042d8004ff8006fbf003fa10021b0006fac2045a3004ca90043ae0052d70078f7002f`;

    // The official Micro:Bit 5x5 system font, as distributed by MakeCode in
    // pxt-common-packages. Each record is a two-byte character code followed
    // by five bitmap columns and one blank advance column.
    const MICROBIT_FONT = hex`
2000000000000000 2100001700000000 2200000300030000 23000a1f0a1f0a00 24000a17151d0a00 2500130904121900
26000a15150a1000 2700000300000000 2800000e11000000 290000110e000000 2a00000a040a0000 2b0000040e040000
2c00001008000000 2d00000404040000 2e00000800000000 2f00100804020100 30000e11110e0000 310000121f100000
3200191515120000 33000911150b0000 34000c0a091f0800 3500171515150900 3600081416150800 3700110905030100
38000a1515150a00 390002150d050200 3a00000a00000000 3b0000100a000000 3c0000040a110000 3d00000a0a0a0000
3e0000110a040000 3f00020115050200 40000e1115090e00 41001e05051e0000 42001f15150a0000 43000e1111110000
44001f11110e0000 45001f1515110000 46001f0505010000 47000e1111150c00 48001f04041f0000 4900111f11000000
4a000911110f0100 4b001f040a110000 4c001f1010100000 4d001f0204021f00 4e001f0204081f00 4f000e11110e0000
50001f0505020000 5100060919160000 52001f05050a1000 5300121515090000 540001011f010100 55000f10100f0000
5600070810080700 57001f0804081f00 58001b04041b0000 590001021c020100 5a00191513110000 5b00001f11110000
5c00010204081000 5d000011111f0000 5e00000201020000 5f00101010101000 6000000102000000 61000c12121e1000
62001f1414080000 63000c1212120000 64000814141f0000 65000e1515120000 6600041e05010000 67000215150f0000
68001f0404180000 6900001d00000000 6a000010100d0000 6b001f040a100000 6c00000f10100000 6d001e0204021e00
6e001e02021c0000 6f000c12120c0000 70001e0a0a040000 7100040a0a1e0000 72001c0202020000 730010140a020000
7400000f14141000 75000e10101e1000 7600060810080600 77001e1008101e00 7800120c0c120000 7900121408040200
7a00121a16120000 7b0000041f110000 7c00001f00000000 7d00111f04000000 7e00000404080800`;

    export const SARDU_GLYPH_WIDTH = 5;
    export const FONT_GAP = 1;

    function glyphIndex(characterCode: number): number {
        if (characterCode >= 32 && characterCode <= 96) return characterCode - 32;
        if (characterCode >= 123 && characterCode <= 126) return 65 + characterCode - 123;
        return 31; // '?'
    }

    function plainColumn(characterCode: number, column: number): number {
        if (characterCode >= 97 && characterCode <= 122)
            return LOWERCASE[(characterCode - 97) * SARDU_GLYPH_WIDTH + column];
        return FONT[glyphIndex(characterCode) * SARDU_GLYPH_WIDTH + column];
    }

    function accentValue(characterCode: number, field: number): number {
        for (let record = 0; record < ACCENT_MAP.length; record += 4)
            if ((ACCENT_MAP[record] | (ACCENT_MAP[record + 1] << 8)) == characterCode)
                return ACCENT_MAP[record + field];
        return 0;
    }

    // 1 grave, 2 acute, 3 circumflex, 4 tilde, 5 diaeresis, 6 ring, 7 cedilla.
    function accentKind(characterCode: number): number {
        return accentValue(characterCode, 3);
    }

    function accentColumn(kind: number, column: number): number {
        if (kind < 0 || kind > 7 || column < 0 || column >= 5) return 0;
        return ACCENT_COLUMNS[kind * 5 + column];
    }

    function specialIndex(characterCode: number): number {
        for (let record = 0; record < SPECIAL_MAP.length; record += 3)
            if ((SPECIAL_MAP[record] | (SPECIAL_MAP[record + 1] << 8)) == characterCode)
                return Math.idiv(record, 3);
        return -1;
    }

    function sarduColumn(characterCode: number, column: number): number {
        if (column < 0 || column >= SARDU_GLYPH_WIDTH) return 0;
        const special = specialIndex(characterCode);
        if (special >= 0) return SPECIAL[special * SARDU_GLYPH_WIDTH + column];

        const base = accentValue(characterCode, 2);
        if (base != 0) {
            const kind = accentKind(characterCode);
            const bits = plainColumn(base, column);
            if (kind == 7) return bits | (column == 2 ? 128 : 0);
            return ((bits << 1) & 255) | accentColumn(kind, column);
        }

        if ((characterCode >= 32 && characterCode <= 126) ||
            (characterCode >= 97 && characterCode <= 122))
            return plainColumn(characterCode, column);
        return plainColumn(63, column); // '?'
    }

    function microBitCharacter(characterCode: number): number {
        const base = accentValue(characterCode, 2);
        if (base != 0) return base;
        const special = specialIndex(characterCode);
        if (special >= 0) return SPECIAL_MAP[special * 3 + 2];
        if (characterCode >= 32 && characterCode <= 126) return characterCode;
        return 63;
    }

    // Native builds expose five horizontal bitmap rows. The TypeScript body
    // converts the same official column table to that format for the simulator.
    //% shim=images::charCodeBuffer
    function systemFontGlyph(characterCode: number): Buffer {
        const glyph = control.createBuffer(5);
        const offset = (characterCode - 32) * 8 + 2;
        for (let row = 0; row < 5; row++) {
            let bits = 0;
            for (let column = 0; column < 5; column++) {
                if ((MICROBIT_FONT[offset + column] & (1 << row)) != 0)
                    bits |= 1 << (4 - column);
            }
            glyph[row] = bits;
        }
        return glyph;
    }

    export function microBitGlyph(characterCode: number): Buffer {
        return systemFontGlyph(microBitCharacter(characterCode));
    }

    function microBitColumn(characterCode: number, column: number, glyph: Buffer): number {
        if (column < 0 || column >= 5 || !glyph || glyph.length < 5) return 0;
        let bits = 0;
        for (let row = 0; row < 5; row++) {
            if ((glyph[row] & (1 << (4 - column))) != 0) bits |= 1 << (row + 1);
        }
        const kind = accentKind(characterCode);
        if (kind == 7 && column == 2) bits |= 64;
        else bits |= accentColumn(kind, column);
        return bits;
    }

    function microBitProportionalLeft(characterCode: number, glyph: Buffer): number {
        for (let column = 0; column < 5; column++)
            if (microBitColumn(characterCode, column, glyph) != 0) return column;
        return 0;
    }

    function microBitProportionalRight(characterCode: number, glyph: Buffer): number {
        for (let column = 4; column >= 0; column--)
            if (microBitColumn(characterCode, column, glyph) != 0) return column;
        return characterCode == 32 ? 2 : 0;
    }

    function proportionalLeft(characterCode: number): number {
        for (let column = 0; column < SARDU_GLYPH_WIDTH; column++)
            if (sarduColumn(characterCode, column) != 0) return column;
        return 0;
    }

    function proportionalRight(characterCode: number): number {
        for (let column = SARDU_GLYPH_WIDTH - 1; column >= 0; column--)
            if (sarduColumn(characterCode, column) != 0) return column;
        return characterCode == 32 ? 2 : 0;
    }

    function compactColumn(characterCode: number, column: number): number {
        if (column < 0 || column >= 4) return 0;
        if (column == 0) return sarduColumn(characterCode, 0);
        if (column == 1) return sarduColumn(characterCode, 1) | sarduColumn(characterCode, 2);
        if (column == 2) return sarduColumn(characterCode, 2) | sarduColumn(characterCode, 3);
        return sarduColumn(characterCode, 4);
    }

    function compactProportionalLeft(characterCode: number): number {
        for (let column = 0; column < 4; column++)
            if (compactColumn(characterCode, column) != 0) return column;
        return 0;
    }

    function compactProportionalRight(characterCode: number): number {
        for (let column = 3; column >= 0; column--)
            if (compactColumn(characterCode, column) != 0) return column;
        return characterCode == 32 ? 1 : 0;
    }

    export function normalizedFont(font: MatrixFont): MatrixFont {
        if (font == MatrixFont.MicroBitExtended || font == MatrixFont.SarduProportional || font == MatrixFont.MicroBitProportional || font == MatrixFont.SarduCompact || font == MatrixFont.SarduCompactProportional) return font;
        return MatrixFont.Sardu;
    }

    export function isMicroBitFont(font: MatrixFont): boolean {
        return font == MatrixFont.MicroBitExtended || font == MatrixFont.MicroBitProportional;
    }

    export function normalizedFontSize(size: MatrixFontSize): number {
        size = Math.floor(size) as MatrixFontSize;
        if (size < MatrixFontSize.X1) return 1;
        if (size > MatrixFontSize.X4) return 4;
        return size;
    }

    export function fontBaseHeight(font: MatrixFont): number {
        return isMicroBitFont(normalizedFont(font)) ? 7 : 8;
    }

    export function glyphWidth(font: MatrixFont, characterCode: number): number {
        font = normalizedFont(font);
        if (font == MatrixFont.SarduProportional)
            return proportionalRight(characterCode) - proportionalLeft(characterCode) + 1;
        if (font == MatrixFont.MicroBitProportional) {
            const glyph = microBitGlyph(characterCode);
            return microBitProportionalRight(characterCode, glyph) - microBitProportionalLeft(characterCode, glyph) + 1;
        }
        if (font == MatrixFont.SarduCompactProportional)
            return compactProportionalRight(characterCode) - compactProportionalLeft(characterCode) + 1;
        if (font == MatrixFont.SarduCompact) return 4;
        return 5;
    }

    export function glyphAdvance(font: MatrixFont, characterCode: number): number {
        return glyphWidth(font, characterCode) + FONT_GAP;
    }

    export function fontColumn(
        characterCode: number,
        column: number,
        font: MatrixFont = MatrixFont.Sardu,
        microBitBuffer: Buffer = null
    ): number {
        font = normalizedFont(font);
        if (isMicroBitFont(font)) {
            if (!microBitBuffer) microBitBuffer = microBitGlyph(characterCode);
            if (font == MatrixFont.MicroBitProportional)
                column += microBitProportionalLeft(characterCode, microBitBuffer);
            return microBitColumn(characterCode, column, microBitBuffer);
        }
        if (font == MatrixFont.SarduProportional)
            return sarduColumn(characterCode, proportionalLeft(characterCode) + column);
        if (font == MatrixFont.SarduCompactProportional)
            return compactColumn(characterCode, compactProportionalLeft(characterCode) + column);
        if (font == MatrixFont.SarduCompact)
            return compactColumn(characterCode, column);
        return sarduColumn(characterCode, column);
    }
}
