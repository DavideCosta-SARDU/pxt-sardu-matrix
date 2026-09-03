namespace sarduMatrixInternal {
    export function packRgb(red: number, green: number, blue: number): number {
        return ((red & 255) << 16) | ((green & 255) << 8) | (blue & 255);
    }

    export function limitByte(value: number): number {
        value = Math.round(value);
        if (value != value || value < 0) return 0;
        if (value > 255) return 255;
        return value;
    }

    export function scaleColor(color: number, brightness: number): number {
        brightness = limitByte(brightness);
        const red = Math.idiv(((color >> 16) & 255) * brightness + 127, 255);
        const green = Math.idiv(((color >> 8) & 255) * brightness + 127, 255);
        const blue = Math.idiv((color & 255) * brightness + 127, 255);
        return packRgb(red, green, blue);
    }

    function limitPercent(value: number): number {
        if (value != value || value < 0) return 0;
        if (value > 100) return 100;
        return value;
    }

    export function hslToColor(hue: number, saturation: number, lightness: number): number {
        if (hue != hue || hue < 0) hue = 0;
        if (hue > 360) hue = 360;
        if (hue == 360) hue = 0;
        saturation = limitPercent(saturation) / 100;
        lightness = limitPercent(lightness) / 100;

        const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const huePart = hue / 60;
        const second = chroma * (1 - Math.abs((huePart % 2) - 1));
        let red = 0;
        let green = 0;
        let blue = 0;
        const sector = Math.floor(huePart);
        if (sector == 0) { red = chroma; green = second; }
        else if (sector == 1) { red = second; green = chroma; }
        else if (sector == 2) { green = chroma; blue = second; }
        else if (sector == 3) { green = second; blue = chroma; }
        else if (sector == 4) { red = second; blue = chroma; }
        else { red = chroma; blue = second; }

        const match = lightness - chroma / 2;
        return packRgb(
            limitByte((red + match) * 255),
            limitByte((green + match) * 255),
            limitByte((blue + match) * 255)
        );
    }
}

namespace sarduMatrix {
    /** Creates a color from red, green and blue components. */
    //% blockId=sardu_matrix_rgb_color block="RGB color red %red green %green blue %blue"
    //% group="Colors" weight=90 help=github:pxt-sardu-matrix/docs/api
    //% red.min=0 red.max=255 red.defl=255 green.min=0 green.max=255 green.defl=255 blue.min=0 blue.max=255 blue.defl=255
    export function rgbColor(red: number, green: number, blue: number): number {
        return sarduMatrixInternal.packRgb(
            sarduMatrixInternal.limitByte(red),
            sarduMatrixInternal.limitByte(green),
            sarduMatrixInternal.limitByte(blue)
        );
    }

    /** Creates a color using hue, saturation and HSL lightness. */
    //% blockId=sardu_matrix_hsl_color block="HSL color hue %hue saturation %saturation lightness %lightness"
    //% group="Colors" weight=89 help=github:pxt-sardu-matrix/docs/api
    //% hue.min=0 hue.max=360 hue.defl=0 saturation.min=0 saturation.max=100 saturation.defl=100 lightness.min=0 lightness.max=100 lightness.defl=50
    export function hslColor(hue: number, saturation: number, lightness: number): number {
        return sarduMatrixInternal.hslToColor(hue, saturation, lightness);
    }
}
