namespace sarduMatrix {
    /** A configurable RGB LED matrix. */
    export class Matrix {
        private config: sarduMatrixInternal.MatrixConfig;
        private strip: neopixel.Strip;
        private operationVersion: number;

        constructor(config: sarduMatrixInternal.MatrixConfig, pin: DigitalPin, brightness: number = 128) {
            this.config = config;
            this.strip = neopixel.create(pin, config.ledCount, NeoPixelMode.RGB);
            this.strip.setBrightness(sarduMatrixInternal.limitByte(brightness));
            this.operationVersion = 0;
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

        /** Stops long-running output, clears the RGB buffer and immediately updates the display. */
        //% blockId=sardu_matrix_interrupt_and_clear block="%matrix stop and clear matrix"
        //% group="Display" weight=72
        interruptAndClear(): void {
            this.operationVersion++;
            this.strip.clear();
            this.strip.show();
        }

        /** Clears the RGB buffer and immediately updates the physical display. */
        //% blockId=sardu_matrix_clear block="%matrix clear"
        //% group="Display" weight=71
        clear(): void {
            this.strip.clear();
            this.strip.show();
        }

        /** Clears only the RGB buffer. Call show to update the physical display. */
        //% blockId=sardu_matrix_clear_buffer block="%matrix clear buffer"
        //% group="More" weight=21 advanced=true
        clearBuffer(): void {
            this.strip.clear();
        }

        /** Sends the RGB buffer to the physical display. */
        //% blockId=sardu_matrix_show block="%matrix show"
        //% group="Display" weight=70
        show(): void {
            this.strip.show();
        }

        /** Sets brightness for pixels written after this call. */
        //% blockId=sardu_matrix_set_brightness block="%matrix set brightness %brightness"
        //% group="More" weight=16 advanced=true brightness.min=0 brightness.max=255 brightness.defl=128
        setBrightness(brightness: number): void {
            brightness = Math.floor(brightness);
            if (brightness != brightness) brightness = 0;
            if (brightness < 0) brightness = 0;
            if (brightness > 255) brightness = 255;
            this.strip.setBrightness(brightness);
        }

        /** Draws static text at explicit coordinates without showing it. */
        //% blockId=sardu_matrix_draw_text block="%matrix draw static text %text at x %x y %y|font %font size %size color %color=neopixel_colors brightness %brightness"
        //% group="Static text" weight=80
        //% text.defl="Hello" x.defl=0 y.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=255
        drawText(
            text: string,
            x: number,
            y: number,
            color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 255
        ): void {
            sarduMatrixInternal.drawText(this, text, x, y, color, font, size, brightness);
        }

        /** Draws static text centered across the matrix width at an explicit Y coordinate. */
        //% blockId=sardu_matrix_draw_text_centered_width block="%matrix draw static text %text centered in width at y %y|font %font size %size color %color=neopixel_colors brightness %brightness"
        //% group="Static text" weight=79
        //% text.defl="Hello" y.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=255
        drawTextCenteredWidth(
            text: string,
            y: number,
            color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 255
        ): void {
            const x = sarduMatrixInternal.centeredCoordinate(
                0, this.config.width - 1,
                sarduMatrixInternal.textWidth(text, font, size),
                this.config.width - 1
            );
            this.drawText(text, x, y, color, font, size, brightness);
        }

        /** Draws static text centered across the matrix height at an explicit X coordinate. */
        //% blockId=sardu_matrix_draw_text_centered_height block="%matrix draw static text %text centered in height at x %x|font %font size %size color %color=neopixel_colors brightness %brightness"
        //% group="Static text" weight=78
        //% text.defl="Hello" x.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=255
        drawTextCenteredHeight(
            text: string,
            x: number,
            color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 255
        ): void {
            const y = sarduMatrixInternal.centeredCoordinate(
                0, this.config.height - 1,
                sarduMatrixInternal.renderedFontHeight(font, size),
                this.config.height - 1
            );
            this.drawText(text, x, y, color, font, size, brightness);
        }

        /** Draws static text centered both horizontally and vertically. */
        //% blockId=sardu_matrix_draw_text_centered block="%matrix draw static text %text centered in width and height|font %font size %size color %color=neopixel_colors brightness %brightness"
        //% group="Static text" weight=77
        //% text.defl="Hello" font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=255
        drawTextCentered(
            text: string,
            color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 255
        ): void {
            const x = sarduMatrixInternal.centeredCoordinate(
                0, this.config.width - 1,
                sarduMatrixInternal.textWidth(text, font, size),
                this.config.width - 1
            );
            const y = sarduMatrixInternal.centeredCoordinate(
                0, this.config.height - 1,
                sarduMatrixInternal.renderedFontHeight(font, size),
                this.config.height - 1
            );
            this.drawText(text, x, y, color, font, size, brightness);
        }

        /** Draws text horizontally centered between two inclusive X coordinates. */
        //% blockId=sardu_matrix_draw_text_centered_width_range block="%matrix draw static text %text centered from x %startX to x %endX at y %y|font %font size %size color %color=neopixel_colors brightness %brightness"
        //% group="More" weight=15 advanced=true
        //% text.defl="Hello" startX.defl=0 endX.defl=15 y.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=255
        drawTextCenteredWidthRange(
            text: string, startX: number, endX: number, y: number, color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 255
        ): void {
            const x = sarduMatrixInternal.centeredCoordinate(
                startX, endX, sarduMatrixInternal.textWidth(text, font, size), this.config.width - 1
            );
            this.drawText(text, x, y, color, font, size, brightness);
        }

        /** Draws text vertically centered between two inclusive Y coordinates. */
        //% blockId=sardu_matrix_draw_text_centered_height_range block="%matrix draw static text %text centered from y %startY to y %endY at x %x|font %font size %size color %color=neopixel_colors brightness %brightness"
        //% group="More" weight=14 advanced=true
        //% text.defl="Hello" startY.defl=0 endY.defl=15 x.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=255
        drawTextCenteredHeightRange(
            text: string, startY: number, endY: number, x: number, color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 255
        ): void {
            const y = sarduMatrixInternal.centeredCoordinate(
                startY, endY, sarduMatrixInternal.renderedFontHeight(font, size), this.config.height - 1
            );
            this.drawText(text, x, y, color, font, size, brightness);
        }

        /** Draws text centered inside the inclusive rectangle delimited by A and B. */
        //% blockId=sardu_matrix_draw_text_centered_area block="%matrix draw static text %text centered in area A x %startX y %startY B x %endX y %endY|font %font size %size color %color=neopixel_colors brightness %brightness"
        //% group="More" weight=13 advanced=true
        //% text.defl="Hello" startX.defl=0 startY.defl=0 endX.defl=15 endY.defl=15 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=255
        drawTextCenteredArea(
            text: string, startX: number, startY: number, endX: number, endY: number, color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 255
        ): void {
            const x = sarduMatrixInternal.centeredCoordinate(
                startX, endX, sarduMatrixInternal.textWidth(text, font, size), this.config.width - 1
            );
            const y = sarduMatrixInternal.centeredCoordinate(
                startY, endY, sarduMatrixInternal.renderedFontHeight(font, size), this.config.height - 1
            );
            this.drawText(text, x, y, color, font, size, brightness);
        }

        /** Scrolls one line left from the selected X and Y coordinates, then leaves the display black. */
        //% blockId=sardu_matrix_scroll_text block="%matrix scroll text %text from x %x y %y|font %font size %size color %color=neopixel_colors brightness %brightness every %frameIntervalMs ms"
        //% group="Scrolling text" weight=75
        //% text.defl="Hello" x.defl=16 y.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=255 frameIntervalMs.defl=100 frameIntervalMs.min=0
        scrollText(
            text: string,
            x: number = 16,
            y: number = 0,
            color: number = NeoPixelColors.White,
            frameIntervalMs: number = 100,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 255
        ): void {
            sarduMatrixInternal.scrollText(this, text, x, y, color, frameIntervalMs, font, size, brightness);
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

        //% blockHidden=true
        _clearBuffer(): void {
            this.strip.clear();
        }

        //% blockHidden=true
        _beginOperation(): number {
            this.operationVersion++;
            return this.operationVersion;
        }

        //% blockHidden=true
        _operationIsActive(version: number): boolean {
            return version == this.operationVersion;
        }
    }
}
