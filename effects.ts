namespace sarduMatrixInternal {
    function effectInteger(value: number, minimum: number, maximum: number): number {
        value = Math.floor(value);
        if (value != value || value < minimum) return minimum;
        if (value > maximum) return maximum;
        return value;
    }

    function effectEndState(value: MatrixEffectEndState): MatrixEffectEndState {
        if (value < MatrixEffectEndState.Leave || value > MatrixEffectEndState.Clear)
            return MatrixEffectEndState.Leave;
        return value;
    }

    function fillEffectFrame(matrix: sarduMatrix.Matrix, color: number): void {
        for (let y = 0; y < matrix.height(); y++)
            for (let x = 0; x < matrix.width(); x++) matrix.setPixel(x, y, color);
    }

    function finishEffect(
        matrix: sarduMatrix.Matrix, operation: number,
        background: Buffer, endState: MatrixEffectEndState
    ): void {
        if (!matrix._operationIsActive(operation)) return;
        endState = effectEndState(endState);
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
        if (effectRandomState == 0) effectRandomState = 0x13579bdf;
    }

    export function nextEffectRandom(maxExclusive: number): number {
        maxExclusive = effectInteger(maxExclusive, 1, 0x7fffffff);
        effectRandomState = (effectRandomState * 1664525 + 1013904223) | 0;
        return (effectRandomState & 0x7fffffff) % maxExclusive;
    }

    export function fadeEffect(
        matrix: sarduMatrix.Matrix, color: number,
        durationMs: number, frames: number, endState: MatrixEffectEndState
    ): void {
        if (!matrix) return;
        durationMs = effectInteger(durationMs, 0, 600000);
        frames = effectInteger(frames, 1, 255);
        const intervalMs = Math.idiv(durationMs, frames);
        const background = matrix._captureBuffer();
        fillEffectFrame(matrix, color);
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
        matrix: sarduMatrix.Matrix, color: number, repetitions: number,
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
            fillEffectFrame(matrix, color);
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
        frameIntervalMs: number, endState: MatrixEffectEndState
    ): void {
        if (!matrix) return;
        frameIntervalMs = effectInteger(frameIntervalMs, 0, 600000);
        if (direction < MatrixWipeDirection.LeftToRight || direction > MatrixWipeDirection.BottomToTop)
            direction = MatrixWipeDirection.LeftToRight;
        const background = matrix._captureBuffer();
        const operation = matrix._beginOperation();
        matrix._clearBuffer();
        const vertical = direction == MatrixWipeDirection.TopToBottom || direction == MatrixWipeDirection.BottomToTop;
        const steps = vertical ? matrix.height() : matrix.width();
        for (let step = 0; step < steps; step++) {
            if (!matrix._operationIsActive(operation)) return;
            const started = control.millis();
            if (vertical) {
                const y = direction == MatrixWipeDirection.TopToBottom ? step : matrix.height() - 1 - step;
                for (let x = 0; x < matrix.width(); x++) matrix.setPixel(x, y, color);
            } else {
                const x = direction == MatrixWipeDirection.LeftToRight ? step : matrix.width() - 1 - step;
                for (let y = 0; y < matrix.height(); y++) matrix.setPixel(x, y, color);
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

    export function rainbowEffect(matrix: sarduMatrix.Matrix, axis: MatrixRainbowAxis): void {
        if (!matrix) return;
        matrix._beginOperation();
        drawRainbowFrame(matrix, axis, 0);
        matrix.show();
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
            matrix.show();
            if (!effectPause(matrix, operation, started, frameIntervalMs)) return;
        }
        finishEffect(matrix, operation, background, endState);
    }

    export function sparklesEffect(
        matrix: sarduMatrix.Matrix, color: number, density: number,
        durationMs: number, frameIntervalMs: number,
        mode: MatrixScrollMode, endState: MatrixEffectEndState
    ): void {
        if (!matrix) return;
        density = effectInteger(density, 1, 100);
        durationMs = effectInteger(durationMs, 0, 600000);
        frameIntervalMs = effectInteger(frameIntervalMs, 1, 600000);
        mode = mode == MatrixScrollMode.Composed ? MatrixScrollMode.Composed : MatrixScrollMode.Exclusive;
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
    //% blockId=sardu_matrix_fade_to_color block="%matrix fade current content to %color=neopixel_colors over %durationMs ms in %frames frames|then %endState"
    //% group="Effects" weight=90
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.Black durationMs.min=0 durationMs.defl=1000 frames.min=1 frames.max=255 frames.defl=20 endState.defl=MatrixEffectEndState.Leave
    export function fadeToColor(matrix: Matrix, color: number = NeoPixelColors.Black, durationMs: number = 1000, frames: number = 20, endState: MatrixEffectEndState = MatrixEffectEndState.Leave): void {
        sarduMatrixInternal.fadeEffect(matrix, color, durationMs, frames, endState);
    }

    /** Blinks the complete matrix using one color. */
    //% blockId=sardu_matrix_blink_color block="%matrix blink color %color=neopixel_colors %repetitions times|on %onMs ms off %offMs ms then %endState"
    //% group="Effects" weight=80
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.White repetitions.min=1 repetitions.defl=3 onMs.min=0 onMs.defl=300 offMs.min=0 offMs.defl=300 endState.defl=MatrixEffectEndState.Restore
    export function blinkColor(matrix: Matrix, color: number = NeoPixelColors.White, repetitions: number = 3, onMs: number = 300, offMs: number = 300, endState: MatrixEffectEndState = MatrixEffectEndState.Restore): void {
        sarduMatrixInternal.blinkEffect(matrix, color, repetitions, onMs, offMs, endState);
    }

    /** Progressively fills the complete matrix from one edge. */
    //% blockId=sardu_matrix_color_wipe block="%matrix color wipe %color=neopixel_colors direction %direction every %frameIntervalMs ms|then %endState"
    //% group="Effects" weight=70
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.White direction.defl=MatrixWipeDirection.LeftToRight frameIntervalMs.min=0 frameIntervalMs.defl=50 endState.defl=MatrixEffectEndState.Leave
    export function colorWipe(matrix: Matrix, color: number = NeoPixelColors.White, direction: MatrixWipeDirection = MatrixWipeDirection.LeftToRight, frameIntervalMs: number = 50, endState: MatrixEffectEndState = MatrixEffectEndState.Leave): void {
        sarduMatrixInternal.wipeEffect(matrix, color, direction, frameIntervalMs, endState);
    }

    /** Shows a static rainbow across the matrix. */
    //% blockId=sardu_matrix_show_rainbow block="%matrix show rainbow along %axis"
    //% group="Effects" weight=60
    //% matrix.shadow=variables_get matrix.defl=matrix axis.defl=MatrixRainbowAxis.Horizontal
    export function showRainbow(matrix: Matrix, axis: MatrixRainbowAxis = MatrixRainbowAxis.Horizontal): void {
        sarduMatrixInternal.rainbowEffect(matrix, axis);
    }

    /** Animates a rainbow cycle across the matrix. */
    //% blockId=sardu_matrix_rainbow_cycle block="%matrix rainbow cycle along %axis for %frames frames every %frameIntervalMs ms|then %endState"
    //% group="Effects" weight=50
    //% matrix.shadow=variables_get matrix.defl=matrix axis.defl=MatrixRainbowAxis.Horizontal frames.min=1 frames.defl=30 frameIntervalMs.min=0 frameIntervalMs.defl=50 endState.defl=MatrixEffectEndState.Leave
    export function rainbowCycle(matrix: Matrix, axis: MatrixRainbowAxis = MatrixRainbowAxis.Horizontal, frames: number = 30, frameIntervalMs: number = 50, endState: MatrixEffectEndState = MatrixEffectEndState.Leave): void {
        sarduMatrixInternal.rainbowCycleEffect(matrix, axis, frames, frameIntervalMs, endState);
    }

    /** Shows random sparkles, alone or over the current matrix content. */
    //% blockId=sardu_matrix_sparkles block="%matrix sparkles color %color=neopixel_colors density %density percent|for %durationMs ms every %frameIntervalMs ms mode %mode then %endState"
    //% group="Effects" weight=40
    //% matrix.shadow=variables_get matrix.defl=matrix color.defl=NeoPixelColors.White density.min=1 density.max=100 density.defl=10 durationMs.min=0 durationMs.defl=2000 frameIntervalMs.min=1 frameIntervalMs.defl=100 mode.defl=MatrixScrollMode.Exclusive endState.defl=MatrixEffectEndState.Restore
    export function sparkles(matrix: Matrix, color: number = NeoPixelColors.White, density: number = 10, durationMs: number = 2000, frameIntervalMs: number = 100, mode: MatrixScrollMode = MatrixScrollMode.Exclusive, endState: MatrixEffectEndState = MatrixEffectEndState.Restore): void {
        sarduMatrixInternal.sparklesEffect(matrix, color, density, durationMs, frameIntervalMs, mode, endState);
    }
}
