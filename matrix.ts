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
        //% group="Display" weight=69
        interruptAndClear(): void {
            this.operationVersion++;
            this.strip.clear();
            this.strip.show();
        }

        /** Clears the RGB buffer and immediately updates the physical display. */
        //% blockId=sardu_matrix_clear block="%matrix clear"
        //% group="Display" weight=70
        clear(): void {
            this.strip.clear();
            this.strip.show();
        }

        /** Clears inclusive logical columns and immediately updates the display. */
        //% blockId=sardu_matrix_clear_columns block="%matrix clear columns from x %startX to x %endX"
        //% group="Display" weight=24 advanced=true
        //% startX.defl=0 endX.defl=15
        clearColumns(startX: number, endX: number): void {
            this._clearAreaBuffer(startX, 0, endX, this.config.height - 1);
            this.show();
        }

        /** Clears inclusive logical rows and immediately updates the display. */
        //% blockId=sardu_matrix_clear_rows block="%matrix clear rows from y %startY to y %endY"
        //% group="Display" weight=23 advanced=true
        //% startY.defl=0 endY.defl=15
        clearRows(startY: number, endY: number): void {
            this._clearAreaBuffer(0, startY, this.config.width - 1, endY);
            this.show();
        }

        /** Clears an inclusive logical rectangle and immediately updates the display. */
        //% blockId=sardu_matrix_clear_area block="%matrix clear area from x %startX y %startY to x %endX y %endY"
        //% group="Display" weight=22 advanced=true
        //% startX.defl=0 startY.defl=0 endX.defl=15 endY.defl=15
        clearArea(startX: number, startY: number, endX: number, endY: number): void {
            this._clearAreaBuffer(startX, startY, endX, endY);
            this.show();
        }

        /** Clears only the RGB buffer. Call show to update the physical display. */
        //% blockId=sardu_matrix_clear_buffer block="%matrix clear buffer"
        //% group="Display" weight=21 advanced=true
        clearBuffer(): void {
            this.strip.clear();
        }

        /** Sends the RGB buffer to the physical display. */
        //% blockId=sardu_matrix_show block="%matrix show"
        //% group="Display" weight=72
        show(): void {
            this.strip.show();
        }

        /** Sets brightness for pixels written after this call. */
        //% blockId=sardu_matrix_set_brightness block="%matrix set brightness %brightness"
        //% group="Display" weight=16 advanced=true brightness.min=0 brightness.max=255 brightness.defl=128
        setBrightness(brightness: number): void {
            brightness = Math.floor(brightness);
            if (brightness != brightness) brightness = 0;
            if (brightness < 0) brightness = 0;
            if (brightness > 255) brightness = 255;
            this.strip.setBrightness(brightness);
        }

        /** Draws static text at explicit coordinates without showing it. */
        // Keep block placeholders in the same order as the TypeScript parameters.
        //% blockId=sardu_matrix_draw_text block="%matrix draw static text %text at x %x y %y|color %color=neopixel_colors font %font size %size brightness %brightness orientation %orientation"
        //% group="Static text" weight=80
        //% text.defl="Hello" x.defl=0 y.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal
        drawText(
            text: string,
            x: number,
            y: number,
            color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 128,
            orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
        ): void {
            sarduMatrixInternal.drawText(this, text, x, y, color, font, size, brightness, orientation);
        }

        /** Draws static text centered across the matrix width at an explicit Y coordinate. */
        //% blockId=sardu_matrix_draw_text_centered_width block="%matrix draw static text %text centered in width at y %y|color %color=neopixel_colors font %font size %size brightness %brightness orientation %orientation"
        //% group="Static text" weight=79
        //% text.defl="Hello" y.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal
        drawTextCenteredWidth(
            text: string,
            y: number,
            color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 128,
            orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
        ): void {
            const x = sarduMatrixInternal.centeredCoordinate(
                0, this.config.width - 1,
                sarduMatrixInternal.renderedTextWidth(text, font, size, orientation),
                this.config.width - 1
            );
            this.drawText(text, x, y, color, font, size, brightness, orientation);
        }

        /** Draws static text centered across the matrix height at an explicit X coordinate. */
        //% blockId=sardu_matrix_draw_text_centered_height block="%matrix draw static text %text centered in height at x %x|color %color=neopixel_colors font %font size %size brightness %brightness orientation %orientation"
        //% group="Static text" weight=78
        //% text.defl="Hello" x.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal
        drawTextCenteredHeight(
            text: string,
            x: number,
            color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 128,
            orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
        ): void {
            const y = sarduMatrixInternal.centeredCoordinate(
                0, this.config.height - 1,
                sarduMatrixInternal.renderedTextHeight(text, font, size, orientation),
                this.config.height - 1
            );
            this.drawText(text, x, y, color, font, size, brightness, orientation);
        }

        /** Draws static text centered both horizontally and vertically. */
        //% blockId=sardu_matrix_draw_text_centered block="%matrix draw static text %text centered in width and height|color %color=neopixel_colors font %font size %size brightness %brightness orientation %orientation"
        //% group="Static text" weight=77
        //% text.defl="Hello" font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal
        drawTextCentered(
            text: string,
            color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 128,
            orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
        ): void {
            const x = sarduMatrixInternal.centeredCoordinate(
                0, this.config.width - 1,
                sarduMatrixInternal.renderedTextWidth(text, font, size, orientation),
                this.config.width - 1
            );
            const y = sarduMatrixInternal.centeredCoordinate(
                0, this.config.height - 1,
                sarduMatrixInternal.renderedTextHeight(text, font, size, orientation),
                this.config.height - 1
            );
            this.drawText(text, x, y, color, font, size, brightness, orientation);
        }

        /** Draws text horizontally centered between two inclusive X coordinates. */
        //% blockId=sardu_matrix_draw_text_centered_width_range block="%matrix draw static text %text centered from x %startX to x %endX at y %y|color %color=neopixel_colors font %font size %size brightness %brightness orientation %orientation"
        //% group="Static text" weight=15 advanced=true
        //% text.defl="Hello" startX.defl=0 endX.defl=15 y.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal
        drawTextCenteredWidthRange(
            text: string, startX: number, endX: number, y: number, color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 128,
            orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
        ): void {
            const x = sarduMatrixInternal.centeredCoordinate(
                startX, endX, sarduMatrixInternal.renderedTextWidth(text, font, size, orientation), this.config.width - 1
            );
            this.drawText(text, x, y, color, font, size, brightness, orientation);
        }

        /** Draws text vertically centered between two inclusive Y coordinates. */
        //% blockId=sardu_matrix_draw_text_centered_height_range block="%matrix draw static text %text centered from y %startY to y %endY at x %x|color %color=neopixel_colors font %font size %size brightness %brightness orientation %orientation"
        //% group="Static text" weight=14 advanced=true
        //% text.defl="Hello" startY.defl=0 endY.defl=15 x.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal
        drawTextCenteredHeightRange(
            text: string, startY: number, endY: number, x: number, color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 128,
            orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
        ): void {
            const y = sarduMatrixInternal.centeredCoordinate(
                startY, endY, sarduMatrixInternal.renderedTextHeight(text, font, size, orientation), this.config.height - 1
            );
            this.drawText(text, x, y, color, font, size, brightness, orientation);
        }

        /** Draws text centered inside the inclusive rectangle delimited by A and B. */
        //% blockId=sardu_matrix_draw_text_centered_area block="%matrix draw static text %text centered in area A x %startX y %startY B x %endX y %endY|color %color=neopixel_colors font %font size %size brightness %brightness orientation %orientation"
        //% group="Static text" weight=13 advanced=true
        //% text.defl="Hello" startX.defl=0 startY.defl=0 endX.defl=15 endY.defl=15 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal
        drawTextCenteredArea(
            text: string, startX: number, startY: number, endX: number, endY: number, color: number,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 128,
            orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
        ): void {
            const x = sarduMatrixInternal.centeredCoordinate(
                startX, endX, sarduMatrixInternal.renderedTextWidth(text, font, size, orientation), this.config.width - 1
            );
            const y = sarduMatrixInternal.centeredCoordinate(
                startY, endY, sarduMatrixInternal.renderedTextHeight(text, font, size, orientation), this.config.height - 1
            );
            this.drawText(text, x, y, color, font, size, brightness, orientation);
        }

        /** Scrolls one line left from selected coordinates, clearing or preserving the existing scene. */
        //% blockId=sardu_matrix_scroll_text block="%matrix scroll text %text from x %x y %y|color %color=neopixel_colors every %frameIntervalMs ms font %font size %size brightness %brightness orientation %orientation mode %mode"
        //% group="Scrolling text" weight=75
        //% text.defl="Hello" x.shadow=sardu_matrix_width y.defl=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 color.defl=NeoPixelColors.White brightness.min=0 brightness.max=255 brightness.defl=128 frameIntervalMs.defl=100 frameIntervalMs.min=0 orientation.defl=MatrixTextOrientation.Normal mode.defl=MatrixScrollMode.Exclusive
        scrollText(
            text: string,
            x: number = 16,
            y: number = 0,
            color: number = NeoPixelColors.White,
            frameIntervalMs: number = 100,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 128,
            orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
            mode: MatrixScrollMode = MatrixScrollMode.Exclusive
        ): void {
            sarduMatrixInternal.scrollText(this, text, x, y, color, frameIntervalMs, font, size, brightness, orientation, mode);
        }

        /** Scrolls a centered text line from one matrix edge, clearing or preserving the existing scene. */
        //% blockId=sardu_matrix_scroll_text_from_edge block="%matrix scroll text %text from edge %edge|color %color=neopixel_colors every %frameIntervalMs ms font %font size %size brightness %brightness orientation %orientation mode %mode"
        //% group="Scrolling text" weight=76
        //% text.defl="Hello" edge.defl=MatrixScrollEdge.Right color.defl=NeoPixelColors.White frameIntervalMs.defl=100 frameIntervalMs.min=0 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal mode.defl=MatrixScrollMode.Exclusive
        scrollTextFromEdge(
            text: string,
            edge: MatrixScrollEdge = MatrixScrollEdge.Right,
            color: number = NeoPixelColors.White,
            frameIntervalMs: number = 100,
            font: MatrixFont = MatrixFont.Sardu,
            size: MatrixFontSize = MatrixFontSize.X1,
            brightness: number = 128,
            orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
            mode: MatrixScrollMode = MatrixScrollMode.Exclusive
        ): void {
            sarduMatrixInternal.scrollTextFromEdge(
                this, text, edge, color, frameIntervalMs, font, size, brightness, orientation, mode
            );
        }

        /** Returns the logical display width. */
        //% blockId=sardu_matrix_width block="%matrix width"
        //% group="Display" weight=20 advanced=true
        width(): number {
            return this.config.width;
        }

        /** Returns the logical display height. */
        //% blockId=sardu_matrix_height block="%matrix height"
        //% group="Display" weight=19 advanced=true
        height(): number {
            return this.config.height;
        }

        /** Returns the number of configured RGB LEDs. */
        //% blockId=sardu_matrix_led_count block="%matrix LED count"
        //% group="Display" weight=18 advanced=true
        ledCount(): number {
            return this.config.ledCount;
        }

        /** Returns the exact size of the NeoPixel RGB buffer in bytes. */
        //% blockId=sardu_matrix_rgb_buffer_bytes block="%matrix RGB buffer bytes"
        //% group="Display" weight=17 advanced=true
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

        private _clearAreaBuffer(startX: number, startY: number, endX: number, endY: number): void {
            startX = Math.floor(startX);
            startY = Math.floor(startY);
            endX = Math.floor(endX);
            endY = Math.floor(endY);
            if (startX != startX || startY != startY || endX != endX || endY != endY) return;
            if (startX > endX) { const swapX = startX; startX = endX; endX = swapX; }
            if (startY > endY) { const swapY = startY; startY = endY; endY = swapY; }
            if (endX < 0 || endY < 0 || startX >= this.config.width || startY >= this.config.height) return;
            if (startX < 0) startX = 0;
            if (startY < 0) startY = 0;
            if (endX >= this.config.width) endX = this.config.width - 1;
            if (endY >= this.config.height) endY = this.config.height - 1;
            for (let y = startY; y <= endY; y++)
                for (let x = startX; x <= endX; x++) this.setPixel(x, y, 0);
        }

        //% blockHidden=true
        _captureBuffer(): Buffer {
            return this.strip.buf.slice();
        }

        //% blockHidden=true
        _restoreBuffer(saved: Buffer): void {
            if (saved && saved.length == this.strip.buf.length) this.strip.buf.write(0, saved);
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
