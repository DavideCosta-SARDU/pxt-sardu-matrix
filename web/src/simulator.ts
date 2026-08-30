import "./styles.css"

type FrameMessage = {
  type: "frame"; width: number; height: number; moduleWidth: number; moduleHeight: number
  moduleColumns: number; moduleRows: number; modular: number
  pixelOrigin: number; pixelAxis: number; pixelPath: number
  moduleOrigin: number; moduleAxis: number; modulePath: number; pixels: string
}
type MatrixMessage = FrameMessage | { type: "init" }
type SimulatorControlMessage = { type: string; channel?: string; data?: ArrayLike<number>; srcFrameIndex?: number }

const CHANNEL = "davidecosta-sardu/pxt-sardu-matrix"
const app = document.querySelector<HTMLElement>("#app")!
let width = 16
let height = 16
let pixels = new Array(width * height).fill("#000000")

function render() {
  const led = Math.max(5, Math.min(18, Math.floor(380 / Math.max(width, height))))
  app.innerHTML = `<section class="sim-shell">
    <div class="sim-head"><h1 class="sim-title">SARDU Matrix</h1><span class="sim-info">${width} × ${height} · ${width * height} LED</span></div>
    <div id="sim-grid" class="sim-grid" style="grid-template-columns:repeat(${width},${led}px);--led:${led}px"></div>
  </section>`
  const grid = document.querySelector<HTMLElement>("#sim-grid")!
  for (const color of pixels) {
    const item = document.createElement("span")
    item.className = "sim-led"
    item.style.background = color
    if (color !== "#000000") item.style.boxShadow = `0 0 ${Math.max(3, led / 2)}px ${color}, inset 0 0 0 1px #ffffff4a`
    grid.appendChild(item)
  }
}

function pathIndex(x: number, y: number, gridWidth: number, gridHeight: number, origin: number, axis: number, path: number) {
  const scanX = origin === 1 || origin === 3 ? gridWidth - 1 - x : x
  const scanY = origin === 2 || origin === 3 ? gridHeight - 1 - y : y
  if (axis === 1) return scanX * gridHeight + (path === 1 && scanX % 2 ? gridHeight - 1 - scanY : scanY)
  return scanY * gridWidth + (path === 1 && scanY % 2 ? gridWidth - 1 - scanX : scanX)
}

function physicalIndex(message: FrameMessage, x: number, y: number) {
  if (!message.modular) return pathIndex(x, y, message.width, message.height, message.pixelOrigin, message.pixelAxis, message.pixelPath)
  const moduleColumn = Math.floor(x / message.moduleWidth)
  const moduleRow = Math.floor(y / message.moduleHeight)
  const modulePosition = pathIndex(moduleColumn, moduleRow, message.moduleColumns, message.moduleRows, message.moduleOrigin, message.moduleAxis, message.modulePath)
  const localPosition = pathIndex(x % message.moduleWidth, y % message.moduleHeight, message.moduleWidth, message.moduleHeight, message.pixelOrigin, message.pixelAxis, message.pixelPath)
  return modulePosition * message.moduleWidth * message.moduleHeight + localPosition
}

function applyFrame(message: FrameMessage) {
  if (!Number.isInteger(message.width) || !Number.isInteger(message.height) || message.width <= 0 || message.height <= 0) return
  if (!/^[0-9a-f]*$/i.test(message.pixels) || message.pixels.length !== message.width * message.height * 6) return
  width = message.width
  height = message.height
  pixels = []
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const offset = physicalIndex(message, x, y) * 6
    // I buffer NeoPixel RGB conservano i byte nell'ordine GRB.
    pixels.push(`#${message.pixels.substring(offset + 2, offset + 4)}${message.pixels.substring(offset, offset + 2)}${message.pixels.substring(offset + 4, offset + 6)}`)
  }
  render()
}

function receiveMatrixMessage(message: MatrixMessage) {
  if (message.type === "init") {
    pixels = new Array(width * height).fill("#000000")
    render()
  } else applyFrame(message)
}

window.addEventListener("message", event => {
  const sim = event.data as SimulatorControlMessage
  if (!sim || sim.type !== "messagepacket" || sim.channel !== CHANNEL || !sim.data) return
  if ((sim.srcFrameIndex ?? -1) !== 0) return
  try {
    const json = new TextDecoder().decode(new Uint8Array(Array.from(sim.data)))
    receiveMatrixMessage(JSON.parse(json) as MatrixMessage)
  } catch { /* ignora pacchetti non validi */ }
})

render()
