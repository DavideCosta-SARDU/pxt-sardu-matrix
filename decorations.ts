namespace sarduMatrixInternal {
    // Fourteen independently designed 8 x 8 monochrome masks, one byte per row.
    const BUILT_IN_ICONS = hex`
0066ffff7e3c1800 0066998142241800
3c42a581a599423c 3c42a58199a5423c
185a3cff3c5a1800 00010386cc783000
8142241818244281 183c7e1818181800
181818187e3c1800 10307fff7f301000
080cfefffe0c0800 995a3c7e7e3c5a99
387cf0e0e0f07c38 0c18307e0c183020`;

    export function gradientColor(
        firstColor: number,
        secondColor: number,
        position: number,
        lastPosition: number,
        brightness: number
    ): number {
        if (lastPosition <= 0) return scaleColor(firstColor, brightness);
        if (position < 0) position = 0;
        if (position > lastPosition) position = lastPosition;
        const firstWeight = lastPosition - position;
        return scaleColor(packRgb(
            Math.idiv(((firstColor >> 16) & 255) * firstWeight + ((secondColor >> 16) & 255) * position + Math.idiv(lastPosition, 2), lastPosition),
            Math.idiv(((firstColor >> 8) & 255) * firstWeight + ((secondColor >> 8) & 255) * position + Math.idiv(lastPosition, 2), lastPosition),
            Math.idiv((firstColor & 255) * firstWeight + (secondColor & 255) * position + Math.idiv(lastPosition, 2), lastPosition)
        ), brightness);
    }

    export function brightnessGradientColor(
        color: number,
        firstBrightness: number,
        secondBrightness: number,
        position: number,
        lastPosition: number
    ): number {
        firstBrightness = limitByte(firstBrightness);
        secondBrightness = limitByte(secondBrightness);
        if (lastPosition <= 0) return scaleColor(color, firstBrightness);
        if (position < 0) position = 0;
        if (position > lastPosition) position = lastPosition;
        const level = Math.idiv(
            firstBrightness * (lastPosition - position) + secondBrightness * position + Math.idiv(lastPosition, 2),
            lastPosition
        );
        return scaleColor(color, level);
    }

    export function drawGradientText(
        matrix: sarduMatrix.Matrix,
        text: string,
        x: number,
        y: number,
        firstColor: number,
        secondColor: number,
        direction: MatrixWipeDirection,
        font: MatrixFont,
        size: MatrixFontSize,
        brightness: number,
        orientation: MatrixTextOrientation,
        finalBrightness: number = -1
    ): void {
        if (!matrix || !text || text.length == 0) return;
        x = Math.floor(x);
        y = Math.floor(y);
        font = normalizedFont(font);
        orientation = normalizedTextOrientation(orientation);
        const scale = normalizedFontSize(size);
        const baseWidth = textWidth(text, font, size);
        const baseHeight = fontBaseHeight(font) * scale;
        const finalWidth = renderedTextWidth(text, font, size, orientation);
        const finalHeight = renderedTextHeight(text, font, size, orientation);
        const vertical = direction == MatrixWipeDirection.TopToBottom || direction == MatrixWipeDirection.BottomToTop;
        const reverse = direction == MatrixWipeDirection.RightToLeft || direction == MatrixWipeDirection.BottomToTop;
        const lastPosition = (vertical ? finalHeight : finalWidth) - 1;
        let xx = 1;
        let xy = 0;
        let xOffset = 0;
        let yx = 0;
        let yy = 1;
        let yOffset = 0;
        if (orientation == MatrixTextOrientation.Clockwise90) {
            xx = 0; xy = -1; xOffset = baseHeight - 1;
            yx = 1; yy = 0;
        } else if (orientation == MatrixTextOrientation.UpsideDown180) {
            xx = -1; xOffset = baseWidth - 1;
            yy = -1; yOffset = baseHeight - 1;
        } else if (orientation == MatrixTextOrientation.Clockwise270) {
            xx = 0; xy = 1;
            yx = -1; yy = 0; yOffset = baseWidth - 1;
        }

        let penX = 0;
        for (let characterIndex = 0; characterIndex < text.length; characterIndex++) {
            const code = text.charCodeAt(characterIndex);
            const width = glyphWidth(font, code);
            const microBitBuffer = isMicroBitFont(font) ? microBitGlyph(code) : null;
            for (let column = 0; column < width; column++) {
                const bits = fontColumn(code, column, font, microBitBuffer);
                if (bits == 0) continue;
                for (let row = 0; row < fontBaseHeight(font); row++) {
                    if ((bits & (1 << row)) == 0) continue;
                    for (let scaleX = 0; scaleX < scale; scaleX++) {
                        for (let scaleY = 0; scaleY < scale; scaleY++) {
                            const localX = penX + column * scale + scaleX;
                            const localY = row * scale + scaleY;
                            const finalX = xOffset + localX * xx + localY * xy;
                            const finalY = yOffset + localX * yx + localY * yy;
                            let position = vertical ? finalY : finalX;
                            if (reverse) position = lastPosition - position;
                            const pixelColor = finalBrightness < 0
                                ? gradientColor(firstColor, secondColor, position, lastPosition, brightness)
                                : brightnessGradientColor(firstColor, brightness, finalBrightness, position, lastPosition);
                            matrix._setTextPixel(x + finalX, y + finalY, pixelColor);
                        }
                    }
                }
            }
            penX += glyphAdvance(font, code) * scale;
        }
    }

    export function scrollGradientTextFromEdge(
        matrix: sarduMatrix.Matrix,
        text: string,
        edge: MatrixScrollEdge,
        firstColor: number,
        secondColor: number,
        direction: MatrixWipeDirection,
        frameIntervalMs: number,
        font: MatrixFont,
        size: MatrixFontSize,
        brightness: number,
        orientation: MatrixTextOrientation,
        mode: MatrixScrollMode,
        finalBrightness: number = -1
    ): void {
        if (!matrix) return;
        edge = Math.floor(edge) as MatrixScrollEdge;
        if (edge < MatrixScrollEdge.Right || edge > MatrixScrollEdge.Bottom) edge = MatrixScrollEdge.Right;
        orientation = normalizedTextOrientation(orientation);

        const contentWidth = renderedTextWidth(text, font, size, orientation);
        const contentHeight = renderedTextHeight(text, font, size, orientation);
        const centeredX = centeredCoordinate(0, matrix.width() - 1, contentWidth, matrix.width() - 1);
        const centeredY = centeredCoordinate(0, matrix.height() - 1, contentHeight, matrix.height() - 1);
        let startX = centeredX;
        let startY = centeredY;
        let endX = centeredX;
        let endY = centeredY;
        if (edge == MatrixScrollEdge.Left) {
            startX = -contentWidth; endX = matrix.width();
        } else if (edge == MatrixScrollEdge.Top) {
            startY = -contentHeight; endY = matrix.height();
        } else if (edge == MatrixScrollEdge.Bottom) {
            startY = matrix.height(); endY = -contentHeight;
        } else {
            startX = matrix.width(); endX = -contentWidth;
        }

        scrollGradientTextBetween(
            matrix, text, startX, startY, endX, endY,
            firstColor, secondColor, direction, frameIntervalMs,
            font, size, brightness, orientation, mode, finalBrightness
        );
    }

    export function scrollGradientTextBetween(
        matrix: sarduMatrix.Matrix,
        text: string,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        firstColor: number,
        secondColor: number,
        direction: MatrixWipeDirection,
        frameIntervalMs: number,
        font: MatrixFont,
        size: MatrixFontSize,
        brightness: number,
        orientation: MatrixTextOrientation,
        mode: MatrixScrollMode,
        finalBrightness: number = -1
    ): void {
        startX = Math.floor(startX);
        startY = Math.floor(startY);
        endX = Math.floor(endX);
        endY = Math.floor(endY);
        frameIntervalMs = Math.floor(frameIntervalMs);
        if (frameIntervalMs != frameIntervalMs || frameIntervalMs < 0) frameIntervalMs = 0;
        orientation = normalizedTextOrientation(orientation);
        mode = mode == MatrixScrollMode.Composed ? MatrixScrollMode.Composed : MatrixScrollMode.Exclusive;
        const operation = matrix._beginOperation();
        if (!text || text.length == 0) {
            if (mode == MatrixScrollMode.Exclusive) {
                matrix._clearBuffer();
                matrix.show();
            }
            return;
        }
        const background = mode == MatrixScrollMode.Composed ? matrix._captureBuffer() : null;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const frameCount = Math.max(Math.abs(deltaX), Math.abs(deltaY));
        for (let frame = 0; frame <= frameCount; frame++) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            const x = frameCount == 0 ? endX : Math.round(startX + deltaX * frame / frameCount);
            const y = frameCount == 0 ? endY : Math.round(startY + deltaY * frame / frameCount);
            if (mode == MatrixScrollMode.Composed) matrix._restoreBuffer(background);
            else matrix._clearBuffer();
            drawGradientText(
                matrix, text, x, y, firstColor, secondColor, direction,
                font, size, brightness, orientation, finalBrightness
            );
            matrix.show();
            const remaining = frameIntervalMs - (control.millis() - started);
            basic.pause(remaining > 0 ? remaining : 0);
        }
    }

    export function drawBuiltInIcon(
        matrix: sarduMatrix.Matrix,
        icon: MatrixIcon,
        x: number,
        y: number,
        color: number,
        size: number,
        brightness: number
    ): void {
        if (!matrix) return;
        icon = Math.floor(icon) as MatrixIcon;
        if (icon < MatrixIcon.FilledHeart || icon > MatrixIcon.Lightning) icon = MatrixIcon.FilledHeart;
        x = Math.floor(x);
        y = Math.floor(y);
        size = Math.floor(size);
        if (size < 1) size = 1;
        if (size > 4) size = 4;
        color = scaleColor(color, brightness);
        const offset = icon * 8;
        for (let row = 0; row < 8; row++) {
            const bits = BUILT_IN_ICONS[offset + row];
            for (let column = 0; column < 8; column++) {
                if ((bits & (1 << (7 - column))) == 0) continue;
                for (let scaleY = 0; scaleY < size; scaleY++)
                    for (let scaleX = 0; scaleX < size; scaleX++)
                        matrix.setPixel(x + column * size + scaleX, y + row * size + scaleY, color);
            }
        }
    }
}

namespace sarduMatrix {
    /** Draws static text filled with a two-color gradient without showing it. */
    //% blockId=sardu_matrix_draw_gradient_text block="$matrix draw gradient text $text at x $x y $y from $firstColor=neopixel_colors to $secondColor=neopixel_colors $direction|| font $font size $size brightness $brightness orientation $orientation"
    //% group="Static text" weight=70 help=github:pxt-sardu-matrix/docs/gradient-and-icons
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=7 expandableArgumentBreaks="4"
    //% matrix.shadow=variables_get matrix.defl=matrix text.defl="Hello" x.defl=0 y.defl=0 firstColor.defl=NeoPixelColors.Red secondColor.defl=NeoPixelColors.Blue direction.defl=MatrixWipeDirection.LeftToRight font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal
    export function drawGradientText(
        matrix: Matrix,
        text: string,
        x: number = 0,
        y: number = 0,
        firstColor: number = NeoPixelColors.Red,
        secondColor: number = NeoPixelColors.Blue,
        direction: MatrixWipeDirection = MatrixWipeDirection.LeftToRight,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        brightness: number = 128,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
    ): void {
        sarduMatrixInternal.drawGradientText(matrix, text, x, y, firstColor, secondColor, direction, font, size, brightness, orientation, -1);
    }

    /** Draws static text with one color fading between two brightness levels without showing it. */
    //% blockId=sardu_matrix_draw_brightness_gradient_text block="$matrix draw brightness gradient text $text at x $x y $y color $color=neopixel_colors from $firstBrightness to $finalBrightness $direction|| font $font size $size orientation $orientation"
    //% group="Static text" weight=69 help=github:pxt-sardu-matrix/docs/gradient-and-icons
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=8 expandableArgumentBreaks="3"
    //% matrix.shadow=variables_get matrix.defl=matrix text.defl="Hello" x.defl=0 y.defl=0 color.defl=NeoPixelColors.White firstBrightness.min=0 firstBrightness.max=255 firstBrightness.defl=128 finalBrightness.min=0 finalBrightness.max=255 finalBrightness.defl=8 direction.defl=MatrixWipeDirection.LeftToRight font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 orientation.defl=MatrixTextOrientation.Normal
    export function drawBrightnessGradientText(
        matrix: Matrix,
        text: string,
        x: number = 0,
        y: number = 0,
        color: number = NeoPixelColors.White,
        firstBrightness: number = 128,
        finalBrightness: number = 8,
        direction: MatrixWipeDirection = MatrixWipeDirection.LeftToRight,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
    ): void {
        sarduMatrixInternal.drawGradientText(
            matrix, text, x, y, color, color, direction, font, size,
            firstBrightness, orientation, finalBrightness
        );
    }

    /** Scrolls text from an edge with a two-color gradient attached to the moving glyphs. */
    //% blockId=sardu_matrix_scroll_gradient_text_from_edge block="$matrix scroll gradient text $text from edge $edge from $firstColor=neopixel_colors to $secondColor=neopixel_colors $direction every $frameIntervalMs ms|| font $font size $size brightness $brightness orientation $orientation mode $mode"
    //% group="Scrolling text" weight=70 help=github:pxt-sardu-matrix/docs/gradient-and-icons
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=8 expandableArgumentBreaks="4"
    //% matrix.shadow=variables_get matrix.defl=matrix text.defl="Hello" edge.defl=MatrixScrollEdge.Right firstColor.defl=NeoPixelColors.Red secondColor.defl=NeoPixelColors.Blue direction.defl=MatrixWipeDirection.LeftToRight frameIntervalMs.min=0 frameIntervalMs.defl=100 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal mode.defl=MatrixScrollMode.Exclusive
    export function scrollGradientTextFromEdge(
        matrix: Matrix,
        text: string,
        edge: MatrixScrollEdge = MatrixScrollEdge.Right,
        firstColor: number = NeoPixelColors.Red,
        secondColor: number = NeoPixelColors.Blue,
        direction: MatrixWipeDirection = MatrixWipeDirection.LeftToRight,
        frameIntervalMs: number = 100,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        brightness: number = 128,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
        mode: MatrixScrollMode = MatrixScrollMode.Exclusive
    ): void {
        sarduMatrixInternal.scrollGradientTextFromEdge(
            matrix, text, edge, firstColor, secondColor, direction, frameIntervalMs,
            font, size, brightness, orientation, mode, -1
        );
    }

    /** Scrolls one-color text from an edge with a brightness gradient attached to the moving glyphs. */
    //% blockId=sardu_matrix_scroll_brightness_gradient_text_from_edge block="$matrix scroll brightness gradient text $text from edge $edge color $color=neopixel_colors from $firstBrightness to $finalBrightness $direction every $frameIntervalMs ms|| font $font size $size orientation $orientation mode $mode"
    //% group="Scrolling text" weight=69 help=github:pxt-sardu-matrix/docs/gradient-and-icons
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=9 expandableArgumentBreaks="4"
    //% matrix.shadow=variables_get matrix.defl=matrix text.defl="Hello" edge.defl=MatrixScrollEdge.Right color.defl=NeoPixelColors.White firstBrightness.min=0 firstBrightness.max=255 firstBrightness.defl=128 finalBrightness.min=0 finalBrightness.max=255 finalBrightness.defl=8 direction.defl=MatrixWipeDirection.LeftToRight frameIntervalMs.min=0 frameIntervalMs.defl=100 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 orientation.defl=MatrixTextOrientation.Normal mode.defl=MatrixScrollMode.Exclusive
    export function scrollBrightnessGradientTextFromEdge(
        matrix: Matrix,
        text: string,
        edge: MatrixScrollEdge = MatrixScrollEdge.Right,
        color: number = NeoPixelColors.White,
        firstBrightness: number = 128,
        finalBrightness: number = 8,
        direction: MatrixWipeDirection = MatrixWipeDirection.LeftToRight,
        frameIntervalMs: number = 100,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
        mode: MatrixScrollMode = MatrixScrollMode.Exclusive
    ): void {
        sarduMatrixInternal.scrollGradientTextFromEdge(
            matrix, text, edge, color, color, direction, frameIntervalMs,
            font, size, firstBrightness, orientation, mode, finalBrightness
        );
    }

    /** Scrolls two-color gradient text between two freely selected coordinates. */
    //% blockId=sardu_matrix_scroll_gradient_text_between block="$matrix scroll gradient text $text from x $startX y $startY to x $endX y $endY|| from $firstColor=neopixel_colors to $secondColor=neopixel_colors $direction every $frameIntervalMs ms font $font size $size brightness $brightness orientation $orientation mode $mode"
    //% group="Scrolling text" weight=68 help=github:pxt-sardu-matrix/docs/gradient-and-icons
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=7 expandableArgumentBreaks="5"
    //% matrix.shadow=variables_get matrix.defl=matrix text.defl="Hello" startX.shadow=sardu_matrix_width startY.defl=0 endX.defl=0 endY.defl=0 firstColor.defl=NeoPixelColors.Red secondColor.defl=NeoPixelColors.Blue direction.defl=MatrixWipeDirection.LeftToRight frameIntervalMs.min=0 frameIntervalMs.defl=100 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 brightness.min=0 brightness.max=255 brightness.defl=128 orientation.defl=MatrixTextOrientation.Normal mode.defl=MatrixScrollMode.Exclusive
    export function scrollGradientTextBetween(
        matrix: Matrix,
        text: string,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        firstColor: number = NeoPixelColors.Red,
        secondColor: number = NeoPixelColors.Blue,
        direction: MatrixWipeDirection = MatrixWipeDirection.LeftToRight,
        frameIntervalMs: number = 100,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        brightness: number = 128,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
        mode: MatrixScrollMode = MatrixScrollMode.Exclusive
    ): void {
        if (!matrix) return;
        sarduMatrixInternal.scrollGradientTextBetween(
            matrix, text, startX, startY, endX, endY,
            firstColor, secondColor, direction, frameIntervalMs,
            font, size, brightness, orientation, mode, -1
        );
    }

    /** Scrolls one-color brightness-gradient text between two freely selected coordinates. */
    //% blockId=sardu_matrix_scroll_brightness_gradient_text_between block="$matrix scroll brightness gradient text $text from x $startX y $startY to x $endX y $endY|| color $color=neopixel_colors from $firstBrightness to $finalBrightness $direction every $frameIntervalMs ms font $font size $size orientation $orientation mode $mode"
    //% group="Scrolling text" weight=67 help=github:pxt-sardu-matrix/docs/gradient-and-icons
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=7 expandableArgumentBreaks="5"
    //% matrix.shadow=variables_get matrix.defl=matrix text.defl="Hello" startX.shadow=sardu_matrix_width startY.defl=0 endX.defl=0 endY.defl=0 color.defl=NeoPixelColors.White firstBrightness.min=0 firstBrightness.max=255 firstBrightness.defl=128 finalBrightness.min=0 finalBrightness.max=255 finalBrightness.defl=8 direction.defl=MatrixWipeDirection.LeftToRight frameIntervalMs.min=0 frameIntervalMs.defl=100 font.defl=MatrixFont.Sardu size.defl=MatrixFontSize.X1 orientation.defl=MatrixTextOrientation.Normal mode.defl=MatrixScrollMode.Exclusive
    export function scrollBrightnessGradientTextBetween(
        matrix: Matrix,
        text: string,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        color: number = NeoPixelColors.White,
        firstBrightness: number = 128,
        finalBrightness: number = 8,
        direction: MatrixWipeDirection = MatrixWipeDirection.LeftToRight,
        frameIntervalMs: number = 100,
        font: MatrixFont = MatrixFont.Sardu,
        size: MatrixFontSize = MatrixFontSize.X1,
        orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
        mode: MatrixScrollMode = MatrixScrollMode.Exclusive
    ): void {
        if (!matrix) return;
        sarduMatrixInternal.scrollGradientTextBetween(
            matrix, text, startX, startY, endX, endY,
            color, color, direction, frameIntervalMs,
            font, size, firstBrightness, orientation, mode, finalBrightness
        );
    }

    /** Draws a built-in 8 x 8 icon without showing it. */
    //% blockId=sardu_matrix_draw_icon block="$matrix draw icon $icon at x $x y $y color $color=neopixel_colors|| size $size brightness $brightness"
    //% group="Icons" weight=90 help=github:pxt-sardu-matrix/docs/gradient-and-icons
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=5 expandableArgumentBreaks="2"
    //% matrix.shadow=variables_get matrix.defl=matrix icon.defl=MatrixIcon.FilledHeart x.defl=0 y.defl=0 color.defl=NeoPixelColors.Red size.min=1 size.max=4 size.defl=1 brightness.min=0 brightness.max=255 brightness.defl=128
    export function drawIcon(matrix: Matrix, icon: MatrixIcon, x: number = 0, y: number = 0, color: number = NeoPixelColors.Red, size: number = 1, brightness: number = 128): void {
        sarduMatrixInternal.drawBuiltInIcon(matrix, icon, x, y, color, size, brightness);
    }
}
