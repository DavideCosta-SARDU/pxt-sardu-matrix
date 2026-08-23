namespace sarduMatrix {
    /** A configurable RGB LED matrix. */
    export class Matrix {
        private config: sarduMatrixInternal.MatrixConfig;
        private strip: neopixel.Strip;

        constructor(config: sarduMatrixInternal.MatrixConfig, pin: DigitalPin) {
            this.config = config;
            this.strip = neopixel.create(pin, config.ledCount, NeoPixelMode.RGB);
        }

        /** Sets one logical pixel. Call show to update the physical display. */
        //% blockId=sardu_matrix_set_pixel block="%matrix set pixel x %x y %y to %color=neopixel_colors"
        //% group="Pixels" weight=90
        //% x.defl=0 y.defl=0 color.defl=NeoPixelColors.White
        setPixel(x: number, y: number, color: number): void {
            x = Math.floor(x);
            y = Math.floor(y);
            const index = sarduMatrixInternal.physicalIndex(this.config, x, y);
            if (index >= 0) this.strip.setPixelColor(index, color);
        }

        /** Clears the RGB buffer. Call show to update the physical display. */
        //% blockId=sardu_matrix_clear block="%matrix clear"
        //% group="Display" weight=70
        clear(): void {
            this.strip.clear();
        }

        /** Sends the RGB buffer to the physical display. */
        //% blockId=sardu_matrix_show block="%matrix show"
        //% group="Display" weight=69
        show(): void {
            this.strip.show();
        }

        /** Sets brightness for pixels written after this call. */
        //% blockId=sardu_matrix_set_brightness block="%matrix set brightness %brightness"
        //% group="Display" weight=68 brightness.min=0 brightness.max=255 brightness.defl=128
        setBrightness(brightness: number): void {
            brightness = Math.floor(brightness);
            if (brightness != brightness) brightness = 0;
            if (brightness < 0) brightness = 0;
            if (brightness > 255) brightness = 255;
            this.strip.setBrightness(brightness);
        }

        /** Draws one line of text into the RGB buffer without showing it. */
        //% blockId=sardu_matrix_draw_text block="%matrix draw text %text at x %x y %y in %color=neopixel_colors"
        //% group="Text" weight=80
        //% text.defl="Hello" x.defl=0 y.defl=0 color.defl=NeoPixelColors.White
        drawText(text: string, x: number, y: number, color: number): void {
            sarduMatrixInternal.drawText(this, text, x, y, color);
        }

        /** Scrolls one line from right to left, then leaves the display black. */
        //% blockId=sardu_matrix_scroll_text block="%matrix scroll text %text in %color=neopixel_colors every %frameIntervalMs ms"
        //% group="Scrolling" weight=75
        //% text.defl="Hello" color.defl=NeoPixelColors.White frameIntervalMs.defl=100 frameIntervalMs.min=0
        scrollText(text: string, color: number, frameIntervalMs: number = 100): void {
            sarduMatrixInternal.scrollText(this, text, color, frameIntervalMs);
        }

        /** Returns the logical display width. */
        //% blockId=sardu_matrix_width block="%matrix width"
        //% group="More" weight=20 advanced=true
        width(): number {
            return this.config.width;
        }

        /** Returns the logical display height. */
        //% blockId=sardu_matrix_height block="%matrix height"
        //% group="More" weight=19 advanced=true
        height(): number {
            return this.config.height;
        }

        /** Returns the number of configured RGB LEDs. */
        //% blockId=sardu_matrix_led_count block="%matrix LED count"
        //% group="More" weight=18 advanced=true
        ledCount(): number {
            return this.config.ledCount;
        }

        /** Returns the exact size of the NeoPixel RGB buffer in bytes. */
        //% blockId=sardu_matrix_rgb_buffer_bytes block="%matrix RGB buffer bytes"
        //% group="More" weight=17 advanced=true
        rgbBufferBytes(): number {
            return this.config.rgbBytes;
        }

        //% blockHidden=true
        _setTextPixel(x: number, y: number, color: number): void {
            this.setPixel(x, y, color);
        }
    }
}
