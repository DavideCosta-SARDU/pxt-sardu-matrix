/** Private - do not use. Internal matrix implementation. */
namespace sarduMatrixInternal {
    function effectInteger(value: number, minimum: number, maximum: number): number {
        value = Math.floor(value);
        if (value != value || value < minimum) return minimum;
        if (value > maximum) return maximum;
        return value;
    }

    function fillEffectFrame(matrix: sarduMatrix.Matrix, color: number): void {
        for (let y = 0; y < matrix.height(); y++)
            for (let x = 0; x < matrix.width(); x++) matrix.setPixel(x, y, color);
    }

    function drawEffectLine(matrix: sarduMatrix.Matrix, vertical: boolean, position: number, color: number): void {
        if (vertical) {
            for (let x = 0; x < matrix.width(); x++) matrix.setPixel(x, position, color);
        } else {
            for (let y = 0; y < matrix.height(); y++) matrix.setPixel(position, y, color);
        }
    }

    function finishEffect(
        matrix: sarduMatrix.Matrix, operation: number,
        background: Buffer, endState: SarduMatrixEffectEndState
    ): void {
        if (!matrix._operationIsActive(operation)) return;
        if (endState == SarduMatrixEffectEndState.Restore) {
            matrix._restoreBuffer(background);
            matrix.show();
        } else if (endState == SarduMatrixEffectEndState.Clear) {
            matrix._clearBuffer();
            matrix.show();
        }
    }

    function effectPause(matrix: sarduMatrix.Matrix, operation: number, started: number, intervalMs: number): boolean {
        const remaining = intervalMs - (control.millis() - started);
        basic.pause(remaining > 0 ? remaining : 0);
        return matrix._operationIsActive(operation);
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function stepEffectBufferToward(current: Buffer, target: Buffer, stepsLeft: number): void {
        if (!current || !target || current.length != target.length) return;
        stepsLeft = effectInteger(stepsLeft, 1, 1000);
        for (let i = 0; i < current.length; i++)
            current[i] += Math.idiv(target[i] - current[i], stepsLeft);
    }

    let effectRandomState = 0x13579bdf;

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function seedEffectRandom(seed: number): void {
        effectRandomState = seed | 0;
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function nextEffectRandom(maxExclusive: number): number {
        effectRandomState = (effectRandomState * 1664525 + 1013904223) | 0;
        return (effectRandomState & 0x7fffffff) % maxExclusive;
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function fadeEffect(
        matrix: sarduMatrix.Matrix, color: number,
        durationMs: number, frames: number, endState: SarduMatrixEffectEndState,
        brightness: number
    ): void {
        if (!matrix) return;
        durationMs = effectInteger(durationMs, 0, 600000);
        frames = effectInteger(frames, 1, 255);
        const intervalMs = Math.idiv(durationMs, frames);
        const background = matrix._captureBuffer();
        fillEffectFrame(matrix, scaleColor(color, brightness));
        const target = matrix._captureBuffer();
        const current = background.slice();
        matrix._restoreBuffer(background);
        const operation = matrix._beginOperation();

        for (let frame = 1; frame <= frames; frame++) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            stepEffectBufferToward(current, target, frames - frame + 1);
            matrix._restoreBuffer(current);
            matrix.show();
            if (!effectPause(matrix, operation, started, intervalMs)) return;
        }
        finishEffect(matrix, operation, background, endState);
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function blinkEffect(
        matrix: sarduMatrix.Matrix, repetitions: number,
        onMs: number, offMs: number, endState: SarduMatrixEffectEndState
    ): void {
        if (!matrix) return;
        repetitions = effectInteger(repetitions, 1, 1000);
        onMs = effectInteger(onMs, 0, 600000);
        offMs = effectInteger(offMs, 0, 600000);
        const background = matrix._captureBuffer();
        const operation = matrix._beginOperation();
        for (let repetition = 0; repetition < repetitions; repetition++) {
            let started = control.millis();
            matrix._restoreBuffer(background);
            matrix.show();
            if (!effectPause(matrix, operation, started, onMs)) return;
            started = control.millis();
            matrix._clearBuffer();
            matrix.show();
            if (!effectPause(matrix, operation, started, offMs)) return;
        }
        finishEffect(matrix, operation, background, endState);
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function wipeEffect(
        matrix: sarduMatrix.Matrix, color: number, direction: SarduMatrixWipeDirection,
        start: number, frameIntervalMs: number, endState: SarduMatrixEffectEndState,
        brightness: number
    ): void {
        if (!matrix) return;
        frameIntervalMs = effectInteger(frameIntervalMs, 0, 600000);
        if (direction < SarduMatrixWipeDirection.LeftToRight || direction > SarduMatrixWipeDirection.BottomToTop)
            direction = SarduMatrixWipeDirection.LeftToRight;
        color = scaleColor(color, brightness);
        const background = matrix._captureBuffer();
        const operation = matrix._beginOperation();
        matrix._clearBuffer();
        const vertical = direction == SarduMatrixWipeDirection.TopToBottom || direction == SarduMatrixWipeDirection.BottomToTop;
        const size = vertical ? matrix.height() : matrix.width();
        start = effectInteger(start, 0, size - 1);
        const forward = direction == SarduMatrixWipeDirection.LeftToRight || direction == SarduMatrixWipeDirection.TopToBottom;
        const steps = forward ? size - start : start + 1;
        for (let step = 0; step < steps; step++) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            drawEffectLine(matrix, vertical, forward ? start + step : start - step, color);
            matrix.show();
            if (!effectPause(matrix, operation, started, frameIntervalMs)) return;
        }
        finishEffect(matrix, operation, background, endState);
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function opposedWipeEffect(
        matrix: sarduMatrix.Matrix, firstColor: number, secondColor: number,
        vertical: boolean, meeting: number, contentOnly: boolean,
        frameIntervalMs: number, endState: SarduMatrixEffectEndState, brightness: number
    ): void {
        if (!matrix) return;
        frameIntervalMs = effectInteger(frameIntervalMs, 0, 600000);
        firstColor = scaleColor(firstColor, brightness);
        secondColor = scaleColor(secondColor, brightness);
        const background = matrix._captureBuffer();
        const operation = matrix._beginOperation();
        const size = vertical ? matrix.height() : matrix.width();
        meeting = effectInteger(meeting, 0, size - 1);
        let first = 0;
        let second = size - 1;
        matrix._clearBuffer();
        while (first <= meeting || second > meeting) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            if (first <= meeting) drawEffectLine(matrix, vertical, first++, firstColor);
            if (second > meeting) drawEffectLine(matrix, vertical, second--, secondColor);
            if (contentOnly) {
                const maskedFrame = matrix._captureBuffer();
                maskRainbowFrame(background, maskedFrame);
                matrix._restoreBuffer(maskedFrame);
            }
            matrix.show();
            if (!effectPause(matrix, operation, started, frameIntervalMs)) return;
        }
        finishEffect(matrix, operation, background, endState);
    }

    function drawRainbowFrame(matrix: sarduMatrix.Matrix, axis: SarduMatrixRainbowAxis, phase: number): void {
        const horizontal = axis != SarduMatrixRainbowAxis.Vertical;
        const length = horizontal ? matrix.width() : matrix.height();
        for (let y = 0; y < matrix.height(); y++) {
            for (let x = 0; x < matrix.width(); x++) {
                const position = horizontal ? x : y;
                const hue = (phase + Math.idiv(position * 360, length)) % 360;
                matrix.setPixel(x, y, hslToColor(hue, 100, 50));
            }
        }
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function maskRainbowFrame(content: Buffer, rainbow: Buffer): void {
        if (!content || !rainbow || content.length != rainbow.length) return;
        for (let offset = 0; offset + 2 < content.length; offset += 3) {
            const contentPeak = Math.max(content[offset], Math.max(content[offset + 1], content[offset + 2]));
            const rainbowPeak = Math.max(rainbow[offset], Math.max(rainbow[offset + 1], rainbow[offset + 2]));
            if (contentPeak == 0 || rainbowPeak == 0) {
                rainbow[offset] = 0;
                rainbow[offset + 1] = 0;
                rainbow[offset + 2] = 0;
            } else {
                rainbow[offset] = Math.idiv(rainbow[offset] * contentPeak + Math.idiv(rainbowPeak, 2), rainbowPeak);
                rainbow[offset + 1] = Math.idiv(rainbow[offset + 1] * contentPeak + Math.idiv(rainbowPeak, 2), rainbowPeak);
                rainbow[offset + 2] = Math.idiv(rainbow[offset + 2] * contentPeak + Math.idiv(rainbowPeak, 2), rainbowPeak);
            }
        }
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function rainbowCycleEffect(
        matrix: sarduMatrix.Matrix, axis: SarduMatrixRainbowAxis,
        frames: number, frameIntervalMs: number, endState: SarduMatrixEffectEndState
    ): void {
        if (!matrix) return;
        frames = effectInteger(frames, 1, 1000);
        frameIntervalMs = effectInteger(frameIntervalMs, 0, 600000);
        const background = matrix._captureBuffer();
        const operation = matrix._beginOperation();
        for (let frame = 0; frame < frames; frame++) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            drawRainbowFrame(matrix, axis, Math.idiv(frame * 360, frames));
            const rainbow = matrix._captureBuffer();
            maskRainbowFrame(background, rainbow);
            matrix._restoreBuffer(rainbow);
            matrix.show();
            if (!effectPause(matrix, operation, started, frameIntervalMs)) return;
        }
        finishEffect(matrix, operation, background, endState);
    }

    /**
     * Private - do not use. Internal matrix implementation.
     */
    export function sparklesEffect(
        matrix: sarduMatrix.Matrix, color: number, density: number,
        durationMs: number, frameIntervalMs: number,
        mode: SarduMatrixScrollMode, endState: SarduMatrixEffectEndState,
        brightness: number
    ): void {
        if (!matrix) return;
        density = effectInteger(density, 1, 100);
        durationMs = effectInteger(durationMs, 0, 600000);
        frameIntervalMs = effectInteger(frameIntervalMs, 1, 600000);
        mode = mode == SarduMatrixScrollMode.Composed ? SarduMatrixScrollMode.Composed : SarduMatrixScrollMode.Exclusive;
        color = scaleColor(color, brightness);
        const background = matrix._captureBuffer();
        const operation = matrix._beginOperation();
        seedEffectRandom(control.millis() ^ operation ^ matrix.ledCount());
        const frameCount = Math.max(1, Math.idiv(durationMs + frameIntervalMs - 1, frameIntervalMs));
        const sparkleCount = Math.max(1, Math.idiv(matrix.ledCount() * density + 99, 100));
        for (let frame = 0; frame < frameCount; frame++) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            if (mode == SarduMatrixScrollMode.Composed) matrix._restoreBuffer(background);
            else matrix._clearBuffer();
            for (let sparkle = 0; sparkle < sparkleCount; sparkle++) {
                matrix.setPixel(
                    nextEffectRandom(matrix.width()),
                    nextEffectRandom(matrix.height()),
                    color
                );
            }
            matrix.show();
            if (!effectPause(matrix, operation, started, frameIntervalMs)) return;
        }
        finishEffect(matrix, operation, background, endState);
    }
}

/** Configurable RGB matrix creation, drawing and animation. */
namespace sarduMatrix {
    /**
     * Fades the current matrix content to a selected color.
     * @param matrix target matrix
     * @param color RGB color, chosen with the color picker or an RGB/HSL block
     * @param durationMs effect duration in milliseconds
     * @param frames number of animation frames
     * @param endState display state when the effect finishes
     * @param brightness brightness from 0 to 255
     */
    //% blockId=sardu_matrix_fade_to_color block="$matrix fade content to $color=neopixel_colors in (ms) $durationMs||frames $frames end $endState brightness $brightness"
    //% group="Effects" weight=90 help=github:pxt-sardu-matrix/docs/effects
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=3 expandableArgumentBreaks="3"
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.Black durationMs.min=0 durationMs.defl=1000 frames.min=1 frames.max=255 frames.defl=20 endState.defl=SarduMatrixEffectEndState.Leave brightness.min=0 brightness.max=255 brightness.defl=128
    //% color.snippet="neopixel.colors(NeoPixelColors.Black)" color.pySnippet="neopixel.colors(NeoPixelColors.BLACK)"
    export function fadeToColor(matrix: Matrix, color: number = NeoPixelColors.Black, durationMs: number = 1000, frames: number = 20, endState: SarduMatrixEffectEndState = SarduMatrixEffectEndState.Leave, brightness: number = 128): void {
        sarduMatrixInternal.fadeEffect(matrix, color, durationMs, frames, endState, brightness);
    }

    /**
     * Blinks the content already present in the matrix buffer.
     * @param matrix target matrix
     * @param repetitions number of blink cycles
     * @param onMs visible time per blink in milliseconds
     * @param offMs dark time per blink in milliseconds
     * @param endState display state when the effect finishes
     */
    //% blockId=sardu_matrix_blink_color block="$matrix blink content $repetitions times||on (ms) $onMs off (ms) $offMs end $endState"
    //% group="Effects" weight=80 help=github:pxt-sardu-matrix/docs/effects
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=2 expandableArgumentBreaks="3"
    //% matrix.shadow=variables_get matrix.defl=matrix repetitions.min=1 repetitions.defl=3 onMs.min=0 onMs.defl=300 offMs.min=0 offMs.defl=300 endState.defl=SarduMatrixEffectEndState.Restore
    export function blinkContent(matrix: Matrix, repetitions: number = 3, onMs: number = 300, offMs: number = 300, endState: SarduMatrixEffectEndState = SarduMatrixEffectEndState.Restore): void {
        sarduMatrixInternal.blinkEffect(matrix, repetitions, onMs, offMs, endState);
    }

    /**
     * Progressively fills the matrix from a selected logical coordinate.
     * @param matrix target matrix
     * @param color RGB color, chosen with the color picker or an RGB/HSL block
     * @param direction direction of the gradient or wipe
     * @param start initial wipe coordinate on the selected axis
     * @param frameIntervalMs pause between animation frames in milliseconds
     * @param endState display state when the effect finishes
     * @param brightness brightness from 0 to 255
     */
    //% blockId=sardu_matrix_color_wipe block="$matrix wipe $color=neopixel_colors $direction from $start||every (ms) $frameIntervalMs end $endState brightness $brightness"
    //% group="Effects" weight=70 help=github:pxt-sardu-matrix/docs/effects
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=4 expandableArgumentBreaks="3"
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.White direction.defl=SarduMatrixWipeDirection.LeftToRight start.min=0 start.defl=0 frameIntervalMs.min=0 frameIntervalMs.defl=50 endState.defl=SarduMatrixEffectEndState.Leave brightness.min=0 brightness.max=255 brightness.defl=128
    //% color.snippet="neopixel.colors(NeoPixelColors.White)" color.pySnippet="neopixel.colors(NeoPixelColors.WHITE)"
    export function colorWipe(matrix: Matrix, color: number = NeoPixelColors.White, direction: SarduMatrixWipeDirection = SarduMatrixWipeDirection.LeftToRight, start: number = 0, frameIntervalMs: number = 50, endState: SarduMatrixEffectEndState = SarduMatrixEffectEndState.Leave, brightness: number = 128): void {
        sarduMatrixInternal.wipeEffect(matrix, color, direction, start, frameIntervalMs, endState, brightness);
    }

    /**
     * Colors current content as a static or animated rainbow.
     * @param matrix target matrix
     * @param axis scan axis
     * @param frames number of animation frames
     * @param frameIntervalMs pause between animation frames in milliseconds
     * @param endState display state when the effect finishes
     */
    //% blockId=sardu_matrix_rainbow_cycle block="$matrix rainbow content $axis $frames frames||every (ms) $frameIntervalMs end $endState"
    //% group="Effects" weight=60 help=github:pxt-sardu-matrix/docs/effects
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=3 expandableArgumentBreaks="2"
    //% matrix.shadow=variables_get matrix.defl=matrix axis.defl=SarduMatrixRainbowAxis.Horizontal frames.min=1 frames.defl=1 frameIntervalMs.min=0 frameIntervalMs.defl=50 endState.defl=SarduMatrixEffectEndState.Leave
    export function rainbowCycle(matrix: Matrix, axis: SarduMatrixRainbowAxis = SarduMatrixRainbowAxis.Horizontal, frames: number = 1, frameIntervalMs: number = 50, endState: SarduMatrixEffectEndState = SarduMatrixEffectEndState.Leave): void {
        sarduMatrixInternal.rainbowCycleEffect(matrix, axis, frames, frameIntervalMs, endState);
    }

    /**
     * Shows random sparkles, alone or over the current matrix content.
     * @param matrix target matrix
     * @param color RGB color, chosen with the color picker or an RGB/HSL block
     * @param density percentage of pixels selected for sparkles, from 1 to 100
     * @param durationMs effect duration in milliseconds
     * @param frameIntervalMs pause between animation frames in milliseconds
     * @param mode how the operation interacts with the existing background
     * @param endState display state when the effect finishes
     * @param brightness brightness from 0 to 255
     */
    //% blockId=sardu_matrix_sparkles block="$matrix sparkles $color=neopixel_colors density $density percent||duration (ms) $durationMs every (ms) $frameIntervalMs mode $mode end $endState brightness $brightness"
    //% group="Effects" weight=40 help=github:pxt-sardu-matrix/docs/effects
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=3 expandableArgumentBreaks="5"
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.White density.min=1 density.max=100 density.defl=10 durationMs.min=0 durationMs.defl=2000 frameIntervalMs.min=1 frameIntervalMs.defl=100 mode.defl=SarduMatrixScrollMode.Exclusive endState.defl=SarduMatrixEffectEndState.Restore brightness.min=0 brightness.max=255 brightness.defl=128
    //% color.snippet="neopixel.colors(NeoPixelColors.White)" color.pySnippet="neopixel.colors(NeoPixelColors.WHITE)"
    export function sparkles(matrix: Matrix, color: number = NeoPixelColors.White, density: number = 10, durationMs: number = 2000, frameIntervalMs: number = 100, mode: SarduMatrixScrollMode = SarduMatrixScrollMode.Exclusive, endState: SarduMatrixEffectEndState = SarduMatrixEffectEndState.Restore, brightness: number = 128): void {
        sarduMatrixInternal.sparklesEffect(matrix, color, density, durationMs, frameIntervalMs, mode, endState, brightness);
    }

    /**
     * Fills from opposite edges to a selected X or Y meeting coordinate.
     * @param matrix target matrix
     * @param firstColor first RGB color
     * @param secondColor second RGB color
     * @param axis scan axis
     * @param meeting coordinate where the two wipes meet
     * @param contentOnly whether only existing non-black pixels are recolored
     * @param frameIntervalMs pause between animation frames in milliseconds
     * @param endState display state when the effect finishes
     * @param brightness brightness from 0 to 255
     */
    //% blockId=sardu_matrix_opposed_color_wipe block="$matrix collision $firstColor=neopixel_colors $secondColor=neopixel_colors $axis meet at X/Y $meeting only content $contentOnly||every (ms) $frameIntervalMs end $endState brightness $brightness"
    //% group="Effects" weight=65 help=github:pxt-sardu-matrix/docs/effects
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=6 expandableArgumentBreaks="3"
    //% matrix.shadow=variables_get matrix.defl=matrix firstColor.defl=NeoPixelColors.Red secondColor.defl=NeoPixelColors.Blue axis.defl=SarduMatrixRainbowAxis.Horizontal meeting.min=0 meeting.defl=7 contentOnly.defl=false frameIntervalMs.min=0 frameIntervalMs.defl=50 endState.defl=SarduMatrixEffectEndState.Leave brightness.min=0 brightness.max=255 brightness.defl=128
    //% firstColor.snippet="neopixel.colors(NeoPixelColors.Red)" firstColor.pySnippet="neopixel.colors(NeoPixelColors.RED)" secondColor.snippet="neopixel.colors(NeoPixelColors.Blue)" secondColor.pySnippet="neopixel.colors(NeoPixelColors.BLUE)"
    export function opposedColorWipe(matrix: Matrix, firstColor: number = NeoPixelColors.Red, secondColor: number = NeoPixelColors.Blue, axis: SarduMatrixRainbowAxis = SarduMatrixRainbowAxis.Horizontal, meeting: number = 7, contentOnly: boolean = false, frameIntervalMs: number = 50, endState: SarduMatrixEffectEndState = SarduMatrixEffectEndState.Leave, brightness: number = 128): void {
        sarduMatrixInternal.opposedWipeEffect(matrix, firstColor, secondColor, axis == SarduMatrixRainbowAxis.Vertical, meeting, contentOnly, frameIntervalMs, endState, brightness);
    }
}
