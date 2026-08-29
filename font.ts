namespace sarduMatrixInternal {
    // Independently assembled for SARDU-Matrix. Five columns and eight rows.
    // Printable ASCII has distinct uppercase and lowercase glyphs. Frequently
    // used Latin accented characters are composed from their real base glyph
    // and diacritic; selected Latin symbols have dedicated glyphs.
    const FONT = hex`000000000000005f00000007000700127f127f12242a7f2a12330b34320136495d22500004030000001c2241000041221c002a1c3e1c2a08083e080800403010000808080808006060000040300806013e5149453e44427f4040426151494641494949361814127f104f494949313e4949493001710905033649494936064949493e0000363600004036160000081422411414141414412214080002015109063e415d555e7e0909097e7f494949363e414141417f4141413e7f494949417f090909013e414949797f0808087f41417f41412040413f017f081422417f404040407f020c027f7f0608307f3e4141413e7f090909063e4151215e7f09192946464949493101017f01013f4040403f0f3040300f7f2018207f631408146303047804036151494543007f41410001060830400041417f00040201020440404040400001020400080836414100007f0000414136080808040c0804`;

    const LOWERCASE = hex`20545454787f484444383844444420384444487f3854545418087e0901020c5252523e7f0804047800447d40002040403d007f1028440000417f40007c047804787c0804047838444444387c14141408081414187c7c080404084854545420043f4440203c4040207c1c2040201c3c4030403c44281028440c5050503c4464544c44`;

    // Æ, æ, Œ, œ, ß, Ø, ø, ¿, ¡, °, €, £, ©, ®, ×, ÷
    const SPECIAL = hex`7e09097f4920545478543e41417f493844447c547e090949363e61514946384c54443830484d400000007d00000007060700143e55554148547e51423e4955493e3e4d55493e221408142208002a0008`;

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

    function accentedBase(characterCode: number): number {
        switch (characterCode) {
            case 192: case 193: case 194: case 195: case 196: case 197: return 65; // A
            case 199: return 67; // C
            case 200: case 201: case 202: case 203: return 69; // E
            case 204: case 205: case 206: case 207: return 73; // I
            case 209: return 78; // N
            case 210: case 211: case 212: case 213: case 214: return 79; // O
            case 217: case 218: case 219: case 220: return 85; // U
            case 221: case 376: return 89; // Y
            case 224: case 225: case 226: case 227: case 228: case 229: return 97; // a
            case 231: return 99; // c
            case 232: case 233: case 234: case 235: return 101; // e
            case 236: case 237: case 238: case 239: return 105; // i
            case 241: return 110; // n
            case 242: case 243: case 244: case 245: case 246: return 111; // o
            case 249: case 250: case 251: case 252: return 117; // u
            case 253: case 255: return 121; // y
            default: return 0;
        }
    }

    // 1 grave, 2 acute, 3 circumflex, 4 tilde, 5 diaeresis, 6 ring, 7 cedilla.
    function accentKind(characterCode: number): number {
        switch (characterCode) {
            case 192: case 200: case 204: case 210: case 217:
            case 224: case 232: case 236: case 242: case 249: return 1;
            case 193: case 201: case 205: case 211: case 218: case 221:
            case 225: case 233: case 237: case 243: case 250: case 253: return 2;
            case 194: case 202: case 206: case 212: case 219:
            case 226: case 234: case 238: case 244: case 251: return 3;
            case 195: case 209: case 213: case 227: case 241: case 245: return 4;
            case 196: case 203: case 207: case 214: case 220: case 376:
            case 228: case 235: case 239: case 246: case 252: case 255: return 5;
            case 197: case 229: return 6;
            case 199: case 231: return 7;
            default: return 0;
        }
    }

    function accentColumn(kind: number, column: number): number {
        if (kind == 1) return column == 1 ? 1 : (column == 2 ? 2 : 0);
        if (kind == 2) return column == 2 ? 2 : (column == 3 ? 1 : 0);
        if (kind == 3) return column == 1 || column == 3 ? 2 : (column == 2 ? 1 : 0);
        if (kind == 4) return column == 0 || column == 2 ? 2 : (column == 1 || column == 3 ? 1 : 0);
        if (kind == 5) return column == 1 || column == 3 ? 1 : 0;
        if (kind == 6) return column == 1 || column == 3 ? 2 : (column == 2 ? 1 : 0);
        return 0;
    }

    function specialIndex(characterCode: number): number {
        switch (characterCode) {
            case 198: return 0;  // Æ
            case 230: return 1;  // æ
            case 338: return 2;  // Œ
            case 339: return 3;  // œ
            case 223: return 4;  // ß
            case 216: return 5;  // Ø
            case 248: return 6;  // ø
            case 191: return 7;  // ¿
            case 161: return 8;  // ¡
            case 176: return 9;  // °
            case 8364: return 10; // €
            case 163: return 11; // £
            case 169: return 12; // ©
            case 174: return 13; // ®
            case 215: return 14; // ×
            case 247: return 15; // ÷
            default: return -1;
        }
    }

    function sarduColumn(characterCode: number, column: number): number {
        if (column < 0 || column >= SARDU_GLYPH_WIDTH) return 0;
        const special = specialIndex(characterCode);
        if (special >= 0) return SPECIAL[special * SARDU_GLYPH_WIDTH + column];

        const base = accentedBase(characterCode);
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
        const base = accentedBase(characterCode);
        if (base != 0) return base;
        switch (characterCode) {
            case 198: return 65;  // Æ -> A
            case 230: return 97;  // æ -> a
            case 338: return 79;  // Œ -> O
            case 339: return 111; // œ -> o
            case 223: return 66;  // ß -> B
            case 216: return 79;  // Ø -> O
            case 248: return 111; // ø -> o
            case 191: return 63;  // ¿ -> ?
            case 161: return 33;  // ¡ -> !
            case 176: return 111; // ° -> o
            case 8364: return 69; // € -> E
            case 163: return 76;  // £ -> L
            case 169: return 67;  // © -> C
            case 174: return 82;  // ® -> R
            case 215: return 120; // × -> x
            case 247: return 47;  // ÷ -> /
            default:
                if (characterCode >= 32 && characterCode <= 126) return characterCode;
                return 63;
        }
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
        if (kind == 1 && (column == 1 || column == 2)) bits |= column == 1 ? 1 : 2;
        else if (kind == 2 && (column == 2 || column == 3)) bits |= column == 2 ? 2 : 1;
        else if (kind == 3) bits |= column == 1 || column == 3 ? 2 : (column == 2 ? 1 : 0);
        else if (kind == 4) bits |= column == 0 || column == 2 ? 2 : (column == 1 || column == 3 ? 1 : 0);
        else if (kind == 5 && (column == 1 || column == 3)) bits |= 1;
        else if (kind == 6) bits |= column == 1 || column == 3 ? 2 : (column == 2 ? 1 : 0);
        else if (kind == 7 && column == 2) bits |= 64;
        return bits;
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

    export function normalizedFont(font: MatrixFont): MatrixFont {
        if (font == MatrixFont.MicroBitExtended || font == MatrixFont.SarduProportional) return font;
        return MatrixFont.Sardu;
    }

    export function normalizedFontSize(size: MatrixFontSize): number {
        size = Math.floor(size) as MatrixFontSize;
        if (size < MatrixFontSize.X1) return 1;
        if (size > MatrixFontSize.X4) return 4;
        return size;
    }

    export function fontBaseHeight(font: MatrixFont): number {
        return normalizedFont(font) == MatrixFont.MicroBitExtended ? 7 : 8;
    }

    export function glyphWidth(font: MatrixFont, characterCode: number): number {
        font = normalizedFont(font);
        if (font == MatrixFont.SarduProportional)
            return proportionalRight(characterCode) - proportionalLeft(characterCode) + 1;
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
        if (font == MatrixFont.MicroBitExtended) {
            if (!microBitBuffer) microBitBuffer = microBitGlyph(characterCode);
            return microBitColumn(characterCode, column, microBitBuffer);
        }
        if (font == MatrixFont.SarduProportional)
            return sarduColumn(characterCode, proportionalLeft(characterCode) + column);
        return sarduColumn(characterCode, column);
    }
}
