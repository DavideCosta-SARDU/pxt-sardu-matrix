namespace sarduMatrixInternal {
    // Independently drawn for SARDU-Matrix. Five columns, seven lit rows and one
    // blank baseline/spacing row. Lowercase letters intentionally reuse the
    // matching uppercase glyph to keep the font at 345 bytes.
    const FONT = hex`000000000000005f00000007000700127f127f12242a7f2a12330b34320136495d22500004030000001c2241000041221c002a1c3e1c2a08083e080800403010000808080808006060000040300806013e5149453e44427f4040426151494641494949361814127f104f494949313e4949493001710905033649494936064949493e0000363600004036160000081422411414141414412214080002015109063e415d555e7e0909097e7f494949363e414141417f4141413e7f494949417f090909013e414949797f0808087f41417f41412040413f017f081422417f404040407f020c027f7f0608307f3e4141413e7f090909063e4151215e7f09192946464949493101017f01013f4040403f0f3040300f7f2018207f631408146303047804036151494543007f41410001060830400041417f00040201020440404040400001020400080836414100007f0000414136080808040c0804`;

    export const GLYPH_WIDTH = 5;
    export const GLYPH_ADVANCE = 6;
    export const GLYPH_HEIGHT = 8;

    function glyphIndex(characterCode: number): number {
        // The compact font uses uppercase shapes for a-z.
        if (characterCode >= 97 && characterCode <= 122) characterCode -= 32;
        if (characterCode >= 32 && characterCode <= 96) return characterCode - 32;
        if (characterCode >= 123 && characterCode <= 126) return 65 + characterCode - 123;
        return 31; // '?'
    }

    export function fontColumn(characterCode: number, column: number): number {
        if (column < 0 || column >= GLYPH_WIDTH) return 0;
        return FONT[glyphIndex(characterCode) * GLYPH_WIDTH + column];
    }
}
