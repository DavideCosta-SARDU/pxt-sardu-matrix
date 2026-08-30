namespace sarduMatrixInternal {
    const SIMULATOR_CHANNEL = "davidecosta-sardu/pxt-sardu-matrix";

    // The simulator receives the original NeoPixel buffer and applies the same
    // wiring mapping as the extension. Native builds replace these bodies with
    // no-ops, so this integration has no firmware cost.
    //% shim=TD_NOOP
    export function initializeSimulator(): void {
        control.simmessages.send(SIMULATOR_CHANNEL, Buffer.fromUTF8("{\"type\":\"init\"}"), false);
    }

    //% shim=TD_NOOP
    export function sendSimulatorFrame(config: MatrixConfig, raw: Buffer): void {
        const message = "{\"type\":\"frame\",\"width\":" + config.width
            + ",\"height\":" + config.height
            + ",\"moduleWidth\":" + config.moduleWidth
            + ",\"moduleHeight\":" + config.moduleHeight
            + ",\"moduleColumns\":" + config.moduleColumns
            + ",\"moduleRows\":" + config.moduleRows
            + ",\"modular\":" + (config.modular ? 1 : 0)
            + ",\"pixelOrigin\":" + config.pixelOrigin
            + ",\"pixelAxis\":" + config.pixelAxis
            + ",\"pixelPath\":" + config.pixelPath
            + ",\"moduleOrigin\":" + config.moduleOrigin
            + ",\"moduleAxis\":" + config.moduleAxis
            + ",\"modulePath\":" + config.modulePath
            + ",\"pixels\":\"" + raw.toHex() + "\"}";
        control.simmessages.send(SIMULATOR_CHANNEL, Buffer.fromUTF8(message), false);
    }
}
