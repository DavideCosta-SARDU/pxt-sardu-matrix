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
        background: Buffer, endState: MatrixEffectEndState
    ): void {
        if (!matrix._operationIsActive(operation)) return;
        if (endState == MatrixEffectEndState.Restore) {
            matrix._restoreBuffer(background);
            matrix.show();
        } else if (endState == MatrixEffectEndState.Clear) {
            matrix._clearBuffer();
            matrix.show();
        }
    }

    function effectPause(matrix: sarduMatrix.Matrix, operation: number, started: number, intervalMs: number): boolean {
        const remaining = intervalMs - (control.millis() - started);
        basic.pause(remaining > 0 ? remaining : 0);
        return matrix._operationIsActive(operation);
    }

    export function stepEffectBufferToward(current: Buffer, target: Buffer, stepsLeft: number): void {
        if (!current || !target || current.length != target.length) return;
        stepsLeft = effectInteger(stepsLeft, 1, 1000);
        for (let i = 0; i < current.length; i++)
            current[i] += Math.idiv(target[i] - current[i], stepsLeft);
    }

    let effectRandomState = 0x13579bdf;

    export function seedEffectRandom(seed: number): void {
        effectRandomState = seed | 0;
    }

    export function nextEffectRandom(maxExclusive: number): number {
        effectRandomState = (effectRandomState * 1664525 + 1013904223) | 0;
        return (effectRandomState & 0x7fffffff) % maxExclusive;
    }

    export function fadeEffect(
        matrix: sarduMatrix.Matrix, color: number,
        durationMs: number, frames: number, endState: MatrixEffectEndState,
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

    export function blinkEffect(
        matrix: sarduMatrix.Matrix, repetitions: number,
        onMs: number, offMs: number, endState: MatrixEffectEndState
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

    export function wipeEffect(
        matrix: sarduMatrix.Matrix, color: number, direction: MatrixWipeDirection,
        start: number, frameIntervalMs: number, endState: MatrixEffectEndState,
        brightness: number
    ): void {
        if (!matrix) return;
        frameIntervalMs = effectInteger(frameIntervalMs, 0, 600000);
        if (direction < MatrixWipeDirection.LeftToRight || direction > MatrixWipeDirection.BottomToTop)
            direction = MatrixWipeDirection.LeftToRight;
        color = scaleColor(color, brightness);
        const background = matrix._captureBuffer();
        const operation = matrix._beginOperation();
        matrix._clearBuffer();
        const vertical = direction == MatrixWipeDirection.TopToBottom || direction == MatrixWipeDirection.BottomToTop;
        const size = vertical ? matrix.height() : matrix.width();
        start = effectInteger(start, 0, size - 1);
        const forward = direction == MatrixWipeDirection.LeftToRight || direction == MatrixWipeDirection.TopToBottom;
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

    export function opposedWipeEffect(
        matrix: sarduMatrix.Matrix, firstColor: number, secondColor: number,
        vertical: boolean, meeting: number, contentOnly: boolean,
        frameIntervalMs: number, endState: MatrixEffectEndState, brightness: number
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

    function drawRainbowFrame(matrix: sarduMatrix.Matrix, axis: MatrixRainbowAxis, phase: number): void {
        const horizontal = axis != MatrixRainbowAxis.Vertical;
        const length = horizontal ? matrix.width() : matrix.height();
        for (let y = 0; y < matrix.height(); y++) {
            for (let x = 0; x < matrix.width(); x++) {
                const position = horizontal ? x : y;
                const hue = (phase + Math.idiv(position * 360, length)) % 360;
                matrix.setPixel(x, y, hslToColor(hue, 100, 50));
            }
        }
    }

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

    export function rainbowCycleEffect(
        matrix: sarduMatrix.Matrix, axis: MatrixRainbowAxis,
        frames: number, frameIntervalMs: number, endState: MatrixEffectEndState
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

    export function sparklesEffect(
        matrix: sarduMatrix.Matrix, color: number, density: number,
        durationMs: number, frameIntervalMs: number,
        mode: MatrixScrollMode, endState: MatrixEffectEndState,
        brightness: number
    ): void {
        if (!matrix) return;
        density = effectInteger(density, 1, 100);
        durationMs = effectInteger(durationMs, 0, 600000);
        frameIntervalMs = effectInteger(frameIntervalMs, 1, 600000);
        mode = mode == MatrixScrollMode.Composed ? MatrixScrollMode.Composed : MatrixScrollMode.Exclusive;
        color = scaleColor(color, brightness);
        const background = matrix._captureBuffer();
        const operation = matrix._beginOperation();
        seedEffectRandom(control.millis() ^ operation ^ matrix.ledCount());
        const frameCount = Math.max(1, Math.idiv(durationMs + frameIntervalMs - 1, frameIntervalMs));
        const sparkleCount = Math.max(1, Math.idiv(matrix.ledCount() * density + 99, 100));
        for (let frame = 0; frame < frameCount; frame++) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            if (mode == MatrixScrollMode.Composed) matrix._restoreBuffer(background);
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

namespace sarduMatrix {
    /** Fades the current matrix content to a selected color. */
    //% blockId=sardu_matrix_fade_to_color block="$matrix fade content to $color=neopixel_colors in $durationMs ms|| frames $frames end $endState brightness $brightness"
    //% group="Effects" weight=90
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=3 expandableArgumentBreaks="3"
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.Black durationMs.min=0 durationMs.defl=1000 frames.min=1 frames.max=255 frames.defl=20 endState.defl=MatrixEffectEndState.Leave brightness.min=0 brightness.max=255 brightness.defl=128
    export function fadeToColor(matrix: Matrix, color: number = NeoPixelColors.Black, durationMs: number = 1000, frames: number = 20, endState: MatrixEffectEndState = MatrixEffectEndState.Leave, brightness: number = 128): void {
        sarduMatrixInternal.fadeEffect(matrix, color, durationMs, frames, endState, brightness);
    }

    /** Blinks the content already present in the matrix buffer. */
    //% blockId=sardu_matrix_blink_color block="$matrix blink content $repetitions times|| on $onMs ms off $offMs ms end $endState"
    //% group="Effects" weight=80
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=2 expandableArgumentBreaks="3"
    //% matrix.shadow=variables_get matrix.defl=matrix repetitions.min=1 repetitions.defl=3 onMs.min=0 onMs.defl=300 offMs.min=0 offMs.defl=300 endState.defl=MatrixEffectEndState.Restore
    export function blinkContent(matrix: Matrix, repetitions: number = 3, onMs: number = 300, offMs: number = 300, endState: MatrixEffectEndState = MatrixEffectEndState.Restore): void {
        sarduMatrixInternal.blinkEffect(matrix, repetitions, onMs, offMs, endState);
    }

    /** Progressively fills the matrix from a selected logical coordinate. */
    //% blockId=sardu_matrix_color_wipe block="$matrix wipe $color=neopixel_colors $direction from $start|| every $frameIntervalMs ms end $endState brightness $brightness"
    //% group="Effects" weight=70
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=4 expandableArgumentBreaks="3"
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.White direction.defl=MatrixWipeDirection.LeftToRight start.min=0 start.defl=0 frameIntervalMs.min=0 frameIntervalMs.defl=50 endState.defl=MatrixEffectEndState.Leave brightness.min=0 brightness.max=255 brightness.defl=128
    export function colorWipe(matrix: Matrix, color: number = NeoPixelColors.White, direction: MatrixWipeDirection = MatrixWipeDirection.LeftToRight, start: number = 0, frameIntervalMs: number = 50, endState: MatrixEffectEndState = MatrixEffectEndState.Leave, brightness: number = 128): void {
        sarduMatrixInternal.wipeEffect(matrix, color, direction, start, frameIntervalMs, endState, brightness);
    }

    /** Colors current content as a static or animated rainbow. */
    //% blockId=sardu_matrix_rainbow_cycle block="$matrix rainbow content $axis $frames frames|| every $frameIntervalMs ms end $endState"
    //% group="Effects" weight=60
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=3 expandableArgumentBreaks="2"
    //% matrix.shadow=variables_get matrix.defl=matrix axis.defl=MatrixRainbowAxis.Horizontal frames.min=1 frames.defl=1 frameIntervalMs.min=0 frameIntervalMs.defl=50 endState.defl=MatrixEffectEndState.Leave
    export function rainbowCycle(matrix: Matrix, axis: MatrixRainbowAxis = MatrixRainbowAxis.Horizontal, frames: number = 1, frameIntervalMs: number = 50, endState: MatrixEffectEndState = MatrixEffectEndState.Leave): void {
        sarduMatrixInternal.rainbowCycleEffect(matrix, axis, frames, frameIntervalMs, endState);
    }

    /** Shows random sparkles, alone or over the current matrix content. */
    //% blockId=sardu_matrix_sparkles block="$matrix sparkles $color=neopixel_colors density $density %|| duration $durationMs ms every $frameIntervalMs ms mode $mode end $endState brightness $brightness"
    //% group="Effects" weight=40
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=3 expandableArgumentBreaks="5"
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.White density.min=1 density.max=100 density.defl=10 durationMs.min=0 durationMs.defl=2000 frameIntervalMs.min=1 frameIntervalMs.defl=100 mode.defl=MatrixScrollMode.Exclusive endState.defl=MatrixEffectEndState.Restore brightness.min=0 brightness.max=255 brightness.defl=128
    export function sparkles(matrix: Matrix, color: number = NeoPixelColors.White, density: number = 10, durationMs: number = 2000, frameIntervalMs: number = 100, mode: MatrixScrollMode = MatrixScrollMode.Exclusive, endState: MatrixEffectEndState = MatrixEffectEndState.Restore, brightness: number = 128): void {
        sarduMatrixInternal.sparklesEffect(matrix, color, density, durationMs, frameIntervalMs, mode, endState, brightness);
    }

    /** Fills from opposite edges to a selected X or Y meeting coordinate. */
    //% blockId=sardu_matrix_opposed_color_wipe block="$matrix collision $firstColor=neopixel_colors $secondColor=neopixel_colors $axis meet at X/Y $meeting only content $contentOnly|| every $frameIntervalMs ms end $endState brightness $brightness"
    //% group="Effects" weight=65
    //% compileHiddenArguments=true inlineInputMode="variable" inlineInputModeLimit=6 expandableArgumentBreaks="3"
    //% matrix.shadow=variables_get matrix.defl=matrix firstColor.defl=NeoPixelColors.Red secondColor.defl=NeoPixelColors.Blue axis.defl=MatrixRainbowAxis.Horizontal meeting.min=0 meeting.defl=7 contentOnly.defl=false frameIntervalMs.min=0 frameIntervalMs.defl=50 endState.defl=MatrixEffectEndState.Leave brightness.min=0 brightness.max=255 brightness.defl=128
    export function opposedColorWipe(matrix: Matrix, firstColor: number = NeoPixelColors.Red, secondColor: number = NeoPixelColors.Blue, axis: MatrixRainbowAxis = MatrixRainbowAxis.Horizontal, meeting: number = 7, contentOnly: boolean = false, frameIntervalMs: number = 50, endState: MatrixEffectEndState = MatrixEffectEndState.Leave, brightness: number = 128): void {
        sarduMatrixInternal.opposedWipeEffect(matrix, firstColor, secondColor, axis == MatrixRainbowAxis.Vertical, meeting, contentOnly, frameIntervalMs, endState, brightness);
    }
}
