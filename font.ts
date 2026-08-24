namespace sarduMatrixInternal {
    // Independently assembled for SARDU-Matrix. Five columns and eight rows.
    // Printable ASCII has distinct uppercase and lowercase glyphs. Frequently
    // used Latin accented characters are composed from their real base glyph
    // and diacritic; selected Latin symbols have dedicated glyphs.
    const FONT = hex`000000000000005f00000007000700127f127f12242a7f2a12330b34320136495d22500004030000001c2241000041221c002a1c3e1c2a08083e080800403010000808080808006060000040300806013e5149453e44427f4040426151494641494949361814127f104f494949313e4949493001710905033649494936064949493e0000363600004036160000081422411414141414412214080002015109063e415d555e7e0909097e7f494949363e414141417f4141413e7f494949417f090909013e414949797f0808087f41417f41412040413f017f081422417f404040407f020c027f7f0608307f3e4141413e7f090909063e4151215e7f09192946464949493101017f01013f4040403f0f3040300f7f2018207f631408146303047804036151494543007f41410001060830400041417f00040201020440404040400001020400080836414100007f0000414136080808040c0804`;

    const LOWERCASE = hex`20545454787f484444383844444420384444487f3854545418087e0901020c5252523e7f0804047800447d40002040403d007f1028440000417f40007c047804787c0804047838444444387c14141408081414187c7c080404084854545420043f4440203c4040207c1c2040201c3c4030403c44281028440c5050503c4464544c44`;

    // Æ, æ, Œ, œ, ß, Ø, ø, ¿, ¡, °, €, £, ©, ®, ×, ÷
    const SPECIAL = hex`7e09097f4920545478543e41417f493844447c547e090949363e61514946384c54443830484d400000007d00000007060700143e55554148547e51423e4955493e3e4d55493e221408142208002a0008`;

    export const GLYPH_WIDTH = 5;
    export const GLYPH_ADVANCE = 6;
    export const GLYPH_HEIGHT = 8;

    function glyphIndex(characterCode: number): number {
        if (characterCode >= 32 && characterCode <= 96) return characterCode - 32;
        if (characterCode >= 123 && characterCode <= 126) return 65 + characterCode - 123;
        return 31; // '?'
    }

    function plainColumn(characterCode: number, column: number): number {
        if (characterCode >= 97 && characterCode <= 122)
            return LOWERCASE[(characterCode - 97) * GLYPH_WIDTH + column];
        return FONT[glyphIndex(characterCode) * GLYPH_WIDTH + column];
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

    export function fontColumn(characterCode: number, column: number): number {
        if (column < 0 || column >= GLYPH_WIDTH) return 0;
        const special = specialIndex(characterCode);
        if (special >= 0) return SPECIAL[special * GLYPH_WIDTH + column];

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
}
