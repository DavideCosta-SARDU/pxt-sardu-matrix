# API pubblica della prima implementazione

## 1. Stato

Questa specifica incorpora le decisioni approvate fino al 23 agosto 2026 ed è implementata nei sorgenti della versione 0.1.0 non ancora rilasciata. Le firme e i block ID compilano con PXT; l'aspetto visuale deve ancora essere verificato nell'editor MakeCode prima della release stabile.

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

## 4. Metodo 1: dimensioni dirette

Firma base:

```typescript
sarduMatrix.create(
    width: number = 16,
    height: number = 16,
    pin: DigitalPin = DigitalPin.P0
): Matrix
```

Blocco base:

```text
crea matrice larghezza [16] altezza [16] su pin [P0]
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
    matrixCount: number = 1,
    matrixType: MatrixModuleType = MatrixModuleType.Matrix16x16,
    pin: DigitalPin = DigitalPin.P0
): Matrix
```

Blocco base:

```text
crea [1] matrici di tipo [16×16] su pin [P0]
```

`matrixCount` è un campo numerico, non una combo. `matrixType` è la combo dei sei formati approvati.

Il default implica:

```text
NumeroRighe = 1
NumeroColonne = matrixCount
```

Quindi `2` matrici `16×16` producono normalmente una superficie 32×16.

## 6. Configurazione avanzata

### 6.1 Parametri del Metodo 1

- origine pixel;
- scansione pixel per righe/colonne;
- percorso pixel progressivo/ZigZag.

### 6.2 Parametri del Metodo 2

- `matrixRows`, default 1;
- origine pixel dentro ogni modulo;
- asse e percorso dei pixel dentro ogni modulo;
- origine del primo modulo nella griglia;
- asse e percorso della catena fra moduli.

La firma concettuale avanzata è:

```typescript
sarduMatrix.createModulesAdvanced(
    matrixCount: number,
    matrixType: MatrixModuleType,
    matrixRows: number,
    pixelOrigin: MatrixOrigin,
    pixelAxis: MatrixScanAxis,
    pixelPath: MatrixPath,
    moduleOrigin: MatrixOrigin,
    moduleAxis: MatrixScanAxis,
    modulePath: MatrixPath,
    pin: DigitalPin
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
matrixColumns = matrixCount / matrixRows
width         = moduleWidth × matrixColumns
height        = moduleHeight × matrixRows
ledCount      = moduleWidth × moduleHeight × matrixCount
rgbBytes      = ledCount × 3
```

La divisibilità `matrixCount % matrixRows == 0` riguarda esclusivamente il Metodo 2 e garantisce una griglia completa.

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

Un colore è un numero RGB compatibile con `neopixel.rgb(...)`, colori NeoPixel e selettore colore MakeCode.

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

Default: 128, uguale al comportamento effettivo della factory pxt-neopixel corrente.

## 10. Testo statico

```typescript
matrix.drawText(text: string, x: number, y: number, color: number): void
```

Semantica:

- font originale monospazio con metrica 6×8, maiuscole e minuscole distinte;
- cinque colonne del glifo più una colonna di spazio;
- disegna soltanto pixel accesi;
- non cancella lo sfondo;
- clipping sui quattro bordi;
- nessun `show()` implicito;
- nessuna bitmap completa della stringa;
- carattere non supportato sostituito con `?`;
- ASCII stampabile, lettere latine accentate comuni e simboli documentati;
- prima versione monoriga.

I dati del font legacy non vengono copiati.

Il font standard supporta:

- tutti i caratteri ASCII stampabili da spazio (`U+0020`) a tilde (`U+007E`), comprese punteggiatura e simboli;
- maiuscole e minuscole distinte;
- `À Á Â Ã Ä Å Ç È É Ê Ë Ì Í Î Ï Ñ Ò Ó Ô Õ Ö Ø Ù Ú Û Ü Ý Ÿ`;
- `à á â ã ä å ç è é ê ë ì í î ï ñ ò ó ô õ ö ø ù ú û ü ý ÿ`;
- `Æ æ Œ œ ß ¿ ¡ ° € £ © ® × ÷`.

Ogni altro carattere viene rappresentato con `?`. I font e gli alfabeti aggiuntivi saranno progettati separatamente per mantenere esplicito il consumo di memoria.

## 11. Scrolling

```typescript
matrix.scrollText(
    text: string,
    x: number = 16,
    y: number = 0,
    color: number = NeoPixelColors.White,
    frameIntervalMs: number = 100
): void
```

`frameIntervalMs` rappresenta la durata obiettivo fra l'inizio di due fotogrammi. Il tempo di rendering e `show()` è incluso; si attende soltanto il residuo. Se il trasferimento richiede più tempo, non si aggiunge pausa.

Comportamento implementato:

1. testo inizialmente alle coordinate X e Y selezionate;
2. movimento verso sinistra;
3. clear, disegno della parte visibile e show per fotogramma;
4. conclusione fuori a sinistra;
5. buffer e display fisico neri al ritorno;
6. stringa vuota: clear e show senza animazione lunga;
7. chiamata bloccante/cooperativa, non background;
8. controllo a ogni fotogramma dell'eventuale richiesta di `interruptAndClear()`.

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

Gruppi proposti:

1. Creazione;
2. Pixel;
3. Testo;
4. Scrolling;
5. Display;
6. Altro…/Configurazione avanzata.

I block ID saranno espliciti, prefissati e stabili. Le varianti avanzate non devono duplicare il motore: normalizzano parametri e chiamano lo stesso core.

## 14. Localizzazione

Lingua sorgente: inglese.

Lingue previste nella prima versione:

- italiano `it`;
- tedesco `de`;
- spagnolo `es-ES`;
- francese `fr`;
- giapponese `ja`;
- cinese `zh`.

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
    DigitalPin.P0
)
```

### Due moduli sulla stessa riga

```typescript
let matrix = sarduMatrix.createModules(
    2,
    MatrixModuleType.Matrix16x16,
    DigitalPin.P0
)
```

Risultato: 32×16, 512 LED, 1536 byte RGB.

### Dimensioni dirette

```typescript
let matrix = sarduMatrix.create(96, 32, DigitalPin.P0)
```

Risultato: 3072 LED e 9216 byte RGB, senza alcun concetto di modulo.

### Griglia avanzata 6×2

```text
matrixCount = 12
matrixType  = 16×16
matrixRows  = 2
matrixColumns calcolato = 6
```

Risultato: 96×32, 3072 LED, 9216 byte RGB.

## 16. Decisioni ancora da verificare nell'editor

1. Factory avanzata separata oppure argomenti espandibili.
2. Testo finale inglese e italiano dei blocchi.
3. Messaggio e comportamento esatto dell'errore di configurazione.
4. Ordine e raggruppamento nella toolbox.
5. Se esporre tutte e quattro le proprietà informative anche come blocchi.

## 17. Criteri prima di congelare l'API

- compilazione col target micro:bit corrente;
- rendering visuale dei blocchi base e avanzati;
- menu enum e default corretti;
- test del selettore colore e pin;
- validazione chiara in simulatore;
- test matematici di mapping;
- misura memoria/timing su configurazioni piccole e grandi;
- font con provenienza registrata;
- block ID definitivi prima della prima release pubblica.
