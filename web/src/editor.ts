import "./styles.css"

type Format = { label: string; width: number; height: number }
type Graphic = { name: string; width: number; height: number; pixels: (string | null)[] }
type Store = { version: 1; graphics: Record<string, Graphic> }

const formats: Format[] = [
  { label: "8 × 8", width: 8, height: 8 },
  { label: "16 × 16", width: 16, height: 16 },
  { label: "32 × 8", width: 32, height: 8 },
  { label: "8 × 32", width: 8, height: 32 },
  { label: "16 × 8", width: 16, height: 8 },
  { label: "8 × 16", width: 8, height: 16 }
]

const app = document.querySelector<HTMLElement>("#app")!
let store: Store = { version: 1, graphics: {} }
let currentId = ""
let selectedColor: string | null = null
let palette = ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffd700"]
let painting = false

function makeId(name: string): string {
  const base = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "grafica"
  let id = base
  let suffix = 2
  while (store.graphics[id] && id !== currentId) id = `${base}-${suffix++}`
  return id
}

function identifier(id: string): string {
  const result = id.replace(/[^a-zA-Z0-9]/g, "_")
  return /^[0-9]/.test(result) ? `graphic_${result}` : result
}

function current(): Graphic | undefined { return store.graphics[currentId] }

function resizeGraphic(graphic: Graphic, width: number, height: number) {
  const next: (string | null)[] = new Array(width * height).fill(null)
  for (let y = 0; y < Math.min(height, graphic.height); y++)
    for (let x = 0; x < Math.min(width, graphic.width); x++)
      next[y * width + x] = graphic.pixels[y * graphic.width + x]
  graphic.width = width
  graphic.height = height
  graphic.pixels = next
}

function bytesToHex(bytes: number[]): string {
  return bytes.map(value => value.toString(16).padStart(2, "0")).join("")
}

function colorBytes(color: string): number[] {
  const value = Number.parseInt(color.substring(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function encode(graphic: Graphic): string {
  const colors: string[] = []
  for (const pixel of graphic.pixels) if (pixel && !colors.includes(pixel)) colors.push(pixel)
  if (colors.length > 15) throw new Error("La grafica usa più di 15 colori.")
  if (colors.length === 0) colors.push("#000000")
  const mask = colors.length === 1
  const out = [0x53, 0x4d, 0x47, 0x31, graphic.width, graphic.height, mask ? 1 : 4, colors.length]
  for (const color of colors) out.push(...colorBytes(color))
  if (mask) {
    for (let start = 0; start < graphic.pixels.length; start += 8) {
      let packed = 0
      for (let bit = 0; bit < 8; bit++) if (graphic.pixels[start + bit]) packed |= 1 << (7 - bit)
      out.push(packed)
    }
  } else {
    for (let start = 0; start < graphic.pixels.length; start += 2) {
      const first = graphic.pixels[start]
      const second = graphic.pixels[start + 1]
      const high = first ? colors.indexOf(first) + 1 : 0
      const low = second ? colors.indexOf(second) + 1 : 0
      out.push((high << 4) | low)
    }
  }
  return bytesToHex(out)
}

function generatedCode(): string {
  let code = "// File generato dall'editor SARDU Matrix.\nnamespace sarduMatrix {\n"
  for (const [id, graphic] of Object.entries(store.graphics)) {
    const name = graphic.name.replace(/["\\]/g, "")
    code += `    //% fixedInstance block="${name}" blockIdentity="sarduMatrix._graphicPicker"\n`
    code += `    export const ${identifier(id)} = graphicFromBuffer(hex\`${encode(graphic)}\`)\n\n`
  }
  return code + "}\n"
}

function setStatus(message: string) {
  document.querySelector<HTMLElement>("#status")!.textContent = message
}

function save() {
  const graphic = current()
  const input = document.querySelector<HTMLInputElement>("#graphic-name")!
  if (graphic) graphic.name = input.value.trim() || "Grafica"
  localStorage.setItem("sardu-matrix-graphics", JSON.stringify(store))
  document.querySelector<HTMLTextAreaElement>("#generated-code")!.value = generatedCode()
  setStatus("Grafica salvata nel browser. Copia il codice generato nel progetto MakeCode.")
  renderAssetOptions()
}

function addGraphic() {
  const format = formats[1]
  const id = makeId("grafica")
  store.graphics[id] = { name: "Grafica", width: format.width, height: format.height, pixels: new Array(format.width * format.height).fill(null) }
  currentId = id
  render()
}

function removeGraphic() {
  if (!currentId || !store.graphics[currentId]) return
  delete store.graphics[currentId]
  currentId = Object.keys(store.graphics)[0] || ""
  if (!currentId) addGraphic(); else render()
}

function renderAssetOptions() {
  const select = document.querySelector<HTMLSelectElement>("#asset-select")
  if (!select) return
  select.innerHTML = Object.entries(store.graphics).map(([id, graphic]) =>
    `<option value="${id}"${id === currentId ? " selected" : ""}>${graphic.name}</option>`).join("")
}

function renderPalette() {
  const host = document.querySelector<HTMLElement>("#palette")!
  const entries: (string | null)[] = [null, ...palette]
  host.innerHTML = ""
  for (const color of entries) {
    const button = document.createElement("button")
    button.type = "button"
    button.className = `swatch${color === null ? " transparent" : ""}${color === selectedColor ? " selected" : ""}`
    if (color) button.style.setProperty("--swatch", color)
    button.title = color === null ? "Trasparente: non modifica lo sfondo" : color === "#000000" ? "Nero: spegne il LED" : color
    button.innerHTML = `<span class="label">${color === null ? "TRASP." : color === "#000000" ? "NERO" : color.substring(1).toUpperCase()}</span>`
    button.onclick = () => { selectedColor = color; renderPalette() }
    host.appendChild(button)
  }
}

function paint(index: number) {
  const graphic = current()
  if (!graphic) return
  graphic.pixels[index] = selectedColor
  const cell = document.querySelector<HTMLElement>(`[data-pixel="${index}"]`)
  if (!cell) return
  cell.classList.toggle("transparent", selectedColor === null)
  if (selectedColor) cell.style.setProperty("--pixel", selectedColor)
  else cell.style.removeProperty("--pixel")
}

function renderGrid() {
  const graphic = current()!
  const host = document.querySelector<HTMLElement>("#pixel-grid")!
  const cell = Math.max(12, Math.min(30, Math.floor(540 / Math.max(graphic.width, graphic.height))))
  host.style.gridTemplateColumns = `repeat(${graphic.width}, ${cell}px)`
  host.style.setProperty("--cell", `${cell}px`)
  host.innerHTML = ""
  graphic.pixels.forEach((color, index) => {
    const pixel = document.createElement("button")
    pixel.type = "button"
    pixel.dataset.pixel = index.toString()
    pixel.className = `pixel${color === null ? " transparent" : ""}`
    if (color) pixel.style.setProperty("--pixel", color)
    pixel.onpointerdown = event => { event.preventDefault(); painting = true; paint(index) }
    pixel.onpointerenter = () => { if (painting) paint(index) }
    pixel.onpointerup = () => { painting = false }
    host.appendChild(pixel)
  })
}

function render() {
  if (!currentId || !store.graphics[currentId]) { addGraphic(); return }
  const graphic = current()!
  app.innerHTML = `
    <section class="shell">
      <h1 class="title">Editor grafico SARDU Matrix</h1>
      <p class="subtitle">Disegna immagini compatte nei sei formati supportati. Trasparente e nero sono distinti.</p>
      <div class="toolbar">
        <label class="field">Grafica<select id="asset-select"></select></label>
        <button id="new" class="action secondary" type="button">Nuova</button>
        <button id="delete" class="action danger" type="button">Elimina</button>
        <label class="field">Nome<input id="graphic-name" value="${graphic.name.replace(/"/g, "&quot;")}" maxlength="40"></label>
        <label class="field">Formato<select id="format-select">${formats.map(format => `<option value="${format.width}x${format.height}"${format.width === graphic.width && format.height === graphic.height ? " selected" : ""}>${format.label}</option>`).join("")}</select></label>
        <button id="save" class="action" type="button">Salva grafica</button>
        <button id="copy" class="action secondary" type="button">Copia codice</button>
      </div>
      <div class="workspace">
        <aside class="panel"><h2>Colori e strumenti</h2><div id="palette" class="palette"></div>
          <div class="color-add"><input id="new-color" type="color" value="#ff00ff"><button id="add-color" class="action secondary" type="button">Aggiungi colore</button></div>
          <p class="hint"><b>Trasparente</b> preserva lo sfondo in sovrapposizione. <b>Nero</b> spegne il LED. Massimo 15 colori reali per grafica.</p>
        </aside>
        <section class="panel"><h2>Disegno ${graphic.width} × ${graphic.height}</h2><div class="grid-wrap"><div id="pixel-grid" class="pixel-grid"></div></div></section>
      </div>
      <div class="panel" style="margin-top:14px"><h2>Codice generato</h2><textarea id="generated-code" class="code" readonly></textarea></div>
      <div id="status" class="statusbar">Modalità autonoma GitHub Pages.</div>
    </section>`
  renderAssetOptions()
  renderPalette()
  renderGrid()
  document.querySelector<HTMLTextAreaElement>("#generated-code")!.value = generatedCode()
  document.querySelector<HTMLSelectElement>("#asset-select")!.onchange = event => { currentId = (event.target as HTMLSelectElement).value; render() }
  document.querySelector<HTMLButtonElement>("#new")!.onclick = addGraphic
  document.querySelector<HTMLButtonElement>("#delete")!.onclick = removeGraphic
  document.querySelector<HTMLButtonElement>("#save")!.onclick = save
  document.querySelector<HTMLButtonElement>("#copy")!.onclick = async () => {
    const code = generatedCode()
    try { await navigator.clipboard.writeText(code); setStatus("Codice copiato negli appunti.") }
    catch { document.querySelector<HTMLTextAreaElement>("#generated-code")!.select(); setStatus("Selezione pronta: usa Copia dal menu del browser.") }
  }
  document.querySelector<HTMLButtonElement>("#add-color")!.onclick = () => {
    const color = document.querySelector<HTMLInputElement>("#new-color")!.value.toLowerCase()
    if (!palette.includes(color)) palette.push(color)
    if (palette.length > 15) { palette = palette.slice(0, 15); setStatus("La tavolozza può contenere al massimo 15 colori.") }
    selectedColor = color
    renderPalette()
  }
  document.querySelector<HTMLSelectElement>("#format-select")!.onchange = event => {
    const [width, height] = (event.target as HTMLSelectElement).value.split("x").map(Number)
    resizeGraphic(graphic, width, height)
    render()
  }
  document.querySelector<HTMLInputElement>("#graphic-name")!.onchange = event => { graphic.name = (event.target as HTMLInputElement).value.trim() || "Grafica" }
}

window.addEventListener("pointerup", () => { painting = false })
const cached = localStorage.getItem("sardu-matrix-graphics")
if (cached) try { store = JSON.parse(cached) as Store } catch { /* start empty */ }
currentId = Object.keys(store.graphics || {})[0] || ""
if (!currentId) addGraphic(); else render()
