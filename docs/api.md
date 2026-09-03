# API pubblica

## 1. Stato

Questa pagina descrive i principi e le firme fondamentali dell'API. Per l'uso corrente dei blocchi, comprese geometrie ed effetti, consulta anche la [guida italiana](guida-italiana.md).

Obiettivi:

- due metodi di configurazione chiaramente distinti;
- default adatto a un solo pannello 16×16;
- nessun limite artificiale legato al caso 96×16;
- buffer proporzionale ai LED realmente configurati;
- configurazione comune breve e cablaggio avanzato disponibile in “Altro…”;
- API di rendering indipendente da testo e tipo di configurazione.

## 2. Namespace e tipo principale

Namespace: `sarduMatrix`.

Tipo restituito dalle factory: `Matrix`.

L'oggetto incapsula geometria, mapping e strip NeoPixel. Strip e Buffer non sono esposti pubblicamente.

## 3. Tipi pubblici

### 3.1 Formato del modulo

```typescript
enum MatrixModuleType {
    Matrix8x8,
    Matrix16x16,
    Matrix32x8,
    Matrix8x32,
    Matrix16x8,
    Matrix8x16
}
```

`Matrix16x16` è il default. L'enum determina soltanto larghezza e altezza, non il cablaggio.

### 3.2 Origine

```typescript
enum MatrixOrigin {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight
}
```

### 3.3 Asse di scansione

```typescript
enum MatrixScanAxis {
    Rows,
    Columns
}
```

### 3.4 Percorso

```typescript
enum MatrixPath {
    Progressive,
    ZigZag
}
```

I nomi TypeScript saranno inglesi e stabili; i valori della combo verranno localizzati.

### 3.5 Font e dimensione

```typescript
enum MatrixFont {
    Sardu,
    MicroBitExtended,
    SarduProportional,
    MicroBitProportional
}

enum MatrixFontSize {
    X1 = 1,
    X2 = 2,
    X3 = 3,
    X4 = 4
}
```

I font sono scelte alternative. `Sardu` resta il default; la dimensione ingrandisce matematicamente ciascun pixel senza creare una bitmap o un framebuffer aggiuntivo.

### 3.6 Orientamento e scorrimento

```typescript
enum MatrixTextOrientation {
    Normal,
    Clockwise90,
    UpsideDown180,
    Clockwise270
}

enum MatrixScrollEdge {
    Right,
    Left,
    Top,
    Bottom
}

enum MatrixScrollMode {
    Exclusive,
    Composed
}
```

L'orientamento ruota l'intera riga già composta, non i singoli caratteri. Bordo di ingresso e orientamento sono indipendenti: sono quindi disponibili tutte le 16 combinazioni. I default restano orientamento normale, ingresso da destra e modalità esclusiva.

## 4. Metodo 1: dimensioni dirette

Firma base:

```typescript
sarduMatrix.create(
    width: number = 16,
    height: number = 16,
    pin: DigitalPin = DigitalPin.P0,
    brightness: number = 128
): Matrix
```

Blocco base:

```text
crea matrice larghezza [16] altezza [16] sul pin [P0] luminosità [128]
```

Mapping di default:

```text
origine  = alto a sinistra
asse     = colonne
percorso = ZigZag
```

La variante avanzata dello stesso metodo permette di scegliere origine, asse e percorso dell'intera superficie. Non contiene quantità, tipo modulo o numero righe.

## 5. Metodo 2: moduli predefiniti

Firma base:

```typescript
sarduMatrix.createModules(
    moduleCount: number = 1,
    moduleType: MatrixModuleType = MatrixModuleType.Matrix16x16,
    pin: DigitalPin = DigitalPin.P0,
    brightness: number = 128
): Matrix
```

Blocco base:

```text
crea matrice con [1] moduli di tipo [16×16] sul pin [P0] luminosità [128]
```

`moduleCount` è un campo numerico, non una combo. `moduleType` è la combo dei sei formati approvati.

Il default implica:

```text
NumeroRighe = 1
NumeroColonne = moduleCount
```

Quindi `2` matrici `16×16` producono normalmente una superficie 32×16.

## 6. Configurazione avanzata

### 6.1 Parametri del Metodo 1

- origine pixel;
- scansione pixel per righe/colonne;
- percorso pixel progressivo/ZigZag.

### 6.2 Parametri del Metodo 2

- `moduleRows`, default 1;
- origine pixel dentro ogni modulo;
- asse e percorso dei pixel dentro ogni modulo;
- origine del primo modulo nella griglia;
- asse e percorso della catena fra moduli.

La firma concettuale avanzata è:

```typescript
sarduMatrix.createModulesAdvanced(
    moduleCount: number,
    moduleType: MatrixModuleType,
    moduleRows: number,
    pixelOrigin: MatrixOrigin,
    pixelAxis: MatrixScanAxis,
    pixelPath: MatrixPath,
    moduleOrigin: MatrixOrigin,
    moduleAxis: MatrixScanAxis,
    modulePath: MatrixPath,
    pin: DigitalPin,
    brightness: number = 128
): Matrix
```

Questa firma serve a fissare la semantica, non necessariamente l'aspetto definitivo del blocco. Nell'editor verranno confrontate due presentazioni:

1. factory avanzata collocata in “Altro…” con `advanced=true`;
2. parametri espandibili sul blocco modulare, se restano leggibili.

Il blocco base non deve mostrare origine, asse e percorso.

## 7. Calcoli e validazione

### 7.1 Metodo 1

```text
ledCount = width × height
rgbBytes = ledCount × 3
```

### 7.2 Metodo 2

```text
moduleColumns = moduleCount / moduleRows
width         = moduleWidth × moduleColumns
height        = moduleHeight × moduleRows
ledCount      = moduleWidth × moduleHeight × moduleCount
rgbBytes      = ledCount × 3
```

La divisibilità `moduleCount % moduleRows == 0` riguarda esclusivamente il Metodo 2 e garantisce una griglia completa.

Entrambi i metodi rifiutano:

- valori non interi o non positivi;
- prodotti non rappresentabili;
- Buffer di dimensione non rappresentabile;
- valori enum non supportati.

Il Metodo 2 rifiuta inoltre quantità non divisibili per il numero di righe.

Non esiste un massimo API fisso di 1536 LED. L'estensione calcola e richiede soltanto `ledCount × 3` byte RGB. La memoria effettivamente libera dipende dall'intero programma e un'allocazione eccessiva può fallire.

La validazione implementata usa `control.panic(920)` per configurazioni numericamente o semanticamente invalide. Un'allocazione che supera la RAM o il massimo della singola allocazione produce invece il panic del runtime PXT. Non viene effettuato alcun ridimensionamento silenzioso.

## 8. Coordinate e colori

L'origine logica del display resta sempre in alto a sinistra, indipendentemente dall'origine fisica scelta:

```text
0 <= x < width
0 <= y < height
```

La configurazione avanzata modifica coordinate→indice fisico, non il sistema di coordinate usato dal programma.

Coordinate fuori schermo vengono ignorate in sicurezza. Questo consente clipping e impedisce alias del bordo.

Un colore è un numero RGB compatibile con `neopixel.rgb(...)`, colori NeoPixel e selettore colore MakeCode. L'estensione aggiunge:

```typescript
sarduMatrix.rgbColor(red: number, green: number, blue: number): number
sarduMatrix.hslColor(hue: number, saturation: number, lightness: number): number
```

RGB usa tre componenti `0..255`. HSL usa tonalità `0..360` e saturazione/luminosità `0..100`. Ogni valore viene limitato matematicamente al proprio intervallo. La luminosità HSL modifica il colore: non è la luminosità generale della matrice e non è la luminosità locale della stringa.

## 9. API fondamentale

### 9.1 Pixel

```typescript
matrix.setPixel(x: number, y: number, color: number): void
```

Modifica il buffer NeoPixel; non chiama `show()`.

### 9.2 Clear

```typescript
matrix.clear(): void
```

Imposta a nero il buffer e aggiorna immediatamente i LED; non richiede `show()`.

### 9.3 Svuota buffer

```typescript
matrix.clearBuffer(): void
```

Funzione avanzata che azzera soltanto il buffer in memoria. Per aggiornare i LED serve `show()`.

### 9.4 Interrompi e cancella

```typescript
matrix.interruptAndClear(): void
```

Invalida l'operazione animata in corso, azzera il buffer e trasmette il nero appena possibile. Un invio WS2812 già iniziato deve comunque terminare.

### 9.5 Show

```typescript
matrix.show(): void
```

Trasferisce l'intero buffer ai LED. Durata e interferenza temporale crescono col numero configurato di LED.

### 9.6 Luminosità

```typescript
matrix.setBrightness(brightness: number): void
```

Intervallo pubblico 0–255, con limitazione esplicita per evitare wrap-around. Coerentemente col backend, influenza i colori scritti successivamente e non ridimensiona automaticamente quelli già presenti nel buffer.

La luminosità iniziale è ora un parametro di tutte le factory e ha default prudente `128`. Il metodo resta disponibile in “Altro” per variazioni durante l'esecuzione. Influenza soltanto i pixel scritti dopo la chiamata.

## 10. Testo statico

```typescript
matrix.drawText(
    text: string,
    x: number,
    y: number,
    color: number,
    font: MatrixFont = MatrixFont.Sardu,
    size: MatrixFontSize = MatrixFontSize.X1,
    brightness: number = 128,
    orientation: MatrixTextOrientation = MatrixTextOrientation.Normal
): void
```

Semantica:

- font SARDU monospazio con cinque colonne visibili, altezza 8 e maiuscole/minuscole distinte;
- cinque colonne del glifo più una colonna di spazio;
- disegna soltanto pixel accesi;
- non cancella lo sfondo;
- clipping sui quattro bordi;
- nessun `show()` implicito;
- nessuna bitmap completa della stringa;
- carattere non supportato sostituito con `?`;
- ASCII stampabile, lettere latine accentate comuni e simboli documentati;
- testo monoriga;
- luminosità locale per stringa `0..255`, applicata matematicamente al colore senza buffer aggiuntivi;
- rotazione dell'intera riga a 0°, 90° orari, 180° o 270° orari.

I dati del font legacy non vengono copiati.

Il font standard supporta:

- tutti i caratteri ASCII stampabili da spazio (`U+0020`) a tilde (`U+007E`), comprese punteggiatura e simboli;
- maiuscole e minuscole distinte;
- `À Á Â Ã Ä Å Ç È É Ê Ë Ì Í Î Ï Ñ Ò Ó Ô Õ Ö Ø Ù Ú Û Ü Ý Ÿ`;
- `à á â ã ä å ç è é ê ë ì í î ï ñ ò ó ô õ ö ø ù ú û ü ý ÿ`;
- `Æ æ Œ œ ß ¿ ¡ ° € £ © ® × ÷`.

Ogni altro carattere viene rappresentato con `?`. `MicroBitExtended` usa i glifi 5×5 ufficiali Micro:Bit dentro una metrica alta 7 pixel, riservando spazio ad accenti e cediglia. `SarduProportional` e `MicroBitProportional` eliminano le colonne laterali vuote dei rispettivi glifi e calcolano la larghezza effettiva carattere per carattere.

Sono disponibili blocchi distinti per:

- X e Y manuali;
- centratura nell'intera larghezza con Y manuale;
- centratura nell'intera altezza con X manuale;
- centratura completa;
- centratura avanzata entro un intervallo X, un intervallo Y o il rettangolo inclusivo delimitato dai punti A e B.

Gli estremi invertiti vengono riordinati e quelli esterni vengono ritagliati ai limiti della matrice. La centratura usa larghezza e altezza successive alla rotazione. Le funzioni avanzate `measureTextWidth()`, `measureTextHeight()` e `measureFontHeight()` espongono le stesse metriche usate dal renderer.

## 11. Scrolling

```typescript
matrix.scrollText(
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
): void
```

Il blocco manuale mantiene X e Y selezionabili e scorre verso sinistra. Il blocco semplificato aggiunge:

```typescript
matrix.scrollTextFromEdge(
    text: string,
    edge: MatrixScrollEdge = MatrixScrollEdge.Right,
    color: number = NeoPixelColors.White,
    frameIntervalMs: number = 100,
    font: MatrixFont = MatrixFont.Sardu,
    size: MatrixFontSize = MatrixFontSize.X1,
    brightness: number = 128,
    orientation: MatrixTextOrientation = MatrixTextOrientation.Normal,
    mode: MatrixScrollMode = MatrixScrollMode.Exclusive
): void
```

Il testo entra completamente da destra, sinistra, alto o basso ed esce dal lato opposto. Viene centrato automaticamente sull'asse perpendicolare al movimento, usando le dimensioni successive alla rotazione.

`frameIntervalMs` rappresenta la durata obiettivo fra l'inizio di due fotogrammi. Il tempo di rendering e `show()` è incluso; si attende soltanto il residuo. Se il trasferimento richiede più tempo, non si aggiunge pausa.

Comportamento implementato:

1. blocco manuale: testo inizialmente alle coordinate X e Y selezionate e movimento verso sinistra;
2. blocco dai bordi: ingresso e uscita completi sul lato opposto, con centratura sull'altro asse;
3. modalità esclusiva: clear, disegno e show per fotogramma, con display nero al termine;
4. modalità composta: ripristino della scena preesistente, disegno e show per fotogramma, con scena originale al termine;
5. conclusione soltanto quando la riga è completamente uscita;
6. stringa vuota: clear e show soltanto in modalità esclusiva;
7. chiamata bloccante/cooperativa, non background;
8. controllo a ogni fotogramma dell'eventuale richiesta di `interruptAndClear()`.

La modalità esclusiva non aggiunge un secondo buffer RGB. La modalità composta crea invece, soltanto per la durata dello scorrimento, una copia del buffer NeoPixel di `width × height × 3` byte. Su Micro:Bit V1 e con matrici grandi va quindi preferita la modalità esclusiva quando la RAM disponibile è ridotta.

## 12. Proprietà informative

Metodi avanzati di sola lettura:

```typescript
matrix.width(): number
matrix.height(): number
matrix.ledCount(): number
matrix.rgbBufferBytes(): number
```

Gli ultimi due rendono trasparente il costo calcolato della configurazione. Non restituiscono RAM libera o buffer interno.

## 13. Organizzazione dei blocchi

Gruppi implementati:

1. Creazione;
2. Display;
3. Testo statico;
4. Testo scorrevole;
5. Geometria statica;
6. Geometria scorrevole;
7. Effetti;
8. Pixel;
9. Colori.

I blocchi Grafica sono collocati per ultimi in “Altro…”.

I block ID saranno espliciti, prefissati e stabili. Le varianti avanzate non devono duplicare il motore: normalizzano parametri e chiamano lo stesso core.

## 14. Localizzazione

Lingua sorgente: inglese.

Durante lo sviluppo il pacchetto include inglese e italiano `it`. Tedesco, spagnolo, francese, giapponese e cinese restano nei sorgenti ma sono temporaneamente esclusi da `pxt.json`; verranno aggiornati e riattivati insieme prima della release stabile.

Saranno localizzati:

- categoria;
- testo dei blocchi;
- valori visibili degli enum;
- JSDoc e parametri;
- documentazione selezionata.

Non saranno tradotti:

- nomi TypeScript;
- block ID;
- nomi interni dei parametri;
- valori numerici dei formati;
- segnaposto nella sintassi dei blocchi.

Le chiavi verranno generate con `pxt gendocs --locs` soltanto dopo aver stabilizzato API e testi inglesi.

## 15. Esempi

### Un modulo predefinito

```typescript
let matrix = sarduMatrix.createModules(
    1,
    MatrixModuleType.Matrix16x16,
    DigitalPin.P0,
    128
)
```

### Due moduli sulla stessa riga

```typescript
let matrix = sarduMatrix.createModules(
    2,
    MatrixModuleType.Matrix16x16,
    DigitalPin.P0,
    128
)
```

Risultato: 32×16, 512 LED, 1536 byte RGB.

### Dimensioni dirette

```typescript
let matrix = sarduMatrix.create(96, 32, DigitalPin.P0, 128)
```

Risultato: 3072 LED e 9216 byte RGB, senza alcun concetto di modulo.

### Griglia avanzata 6×2

```text
moduleCount = 12
moduleType  = 16×16
moduleRows  = 2
moduleColumns calcolato = 6
```

Risultato: 96×32, 3072 LED, 9216 byte RGB.

## 16. Verifiche residue

1. Controllare nell'editor MakeCode l'impaginazione dei nuovi blocchi lunghi e delle combo font/dimensione/orientamento/modalità.
2. Provare su matrice reale le quattro rotazioni, i quattro bordi, le due modalità, i font, gli ingrandimenti e le centrature.
3. Riesaminare prima del rilascio definitivo i comportamenti dei blocchi di cancellazione.
4. Aggiornare e riattivare insieme le altre cinque localizzazioni.

## 17. Criteri prima di congelare l'API

- compilazione col target Micro:Bit corrente;
- rendering visuale dei blocchi base e avanzati;
- menu enum e default corretti;
- test del selettore colore e pin;
- validazione chiara in simulatore;
- test matematici di mapping;
- misura memoria/timing su configurazioni piccole e grandi;
- font con provenienza registrata;
- block ID definitivi prima della prima release pubblica.
