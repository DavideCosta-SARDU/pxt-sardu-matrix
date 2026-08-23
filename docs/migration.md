# Migrazione da pxt-smartmatrix a SARDU-Matrix

## 1. Scopo

Questa guida descrive come ottenere con SARDU-Matrix i risultati forniti dalla vecchia estensione pxt-smartmatrix 1.1.0. La nuova API non replica nomi e struttura storici: conserva le funzionalità utili, corregge i limiti noti e rende espliciti buffer, mapping e aggiornamento fisico.

Le firme mostrate sono ancora proposte di progetto e saranno definitive soltanto dopo l'approvazione e la verifica MakeCode.

## 2. Differenze principali

| Aspetto | pxt-smartmatrix | SARDU-Matrix |
|---|---|---|
| Creazione | larghezza e altezza in variabili globali/inizializzazione legacy | oggetto `Matrix`, creato per dimensioni o per moduli |
| Default | dipendente dall'inizializzazione legacy | un modulo 16×16 oppure 16×16 diretto |
| Caso 96×16 | dimensioni complessive | esempio/test, non default né limite |
| Mapping | column-zigzag continuo | origine, asse e progressivo/serpentina; piano separato per moduli |
| Buffer RGB | proporzionale ai LED ma non documentato chiaramente | esattamente `ledCount × 3`, nessun massimo fisso a 1536 |
| Stato | prevalentemente globale | incapsulato nell'istanza matrice |
| Pixel fuori schermo | errore sul bordo esclusivo con possibile alias | ignorato in sicurezza |
| Disegno statico | aggiornamento implicito in alcune funzioni | buffer e `show()` separati |
| Testo | font 6×8 legacy | font originale SARDU-Matrix con metrica 6×8 |
| Scrolling | parametro `speed` reciproco e costo elevato | intervallo obiettivo in ms, solo glifi visibili |
| Fine scrolling | ultimo stato fisico non chiaramente cancellato | buffer e LED neri |
| Luminosità | comportamento del backend poco esplicito | 0–255, applicata alle scritture successive |
| Bitmap/livelli | funzioni legacy con difetti e semantica complessa | non inclusi nella prima versione |

## 3. Inizializzazione 96×16

Percorso raccomandato:

```typescript
let matrix = sarduMatrix.createModules(
    6,
    MatrixModuleType.Matrix16x16,
    DigitalPin.P0
)
```

Alternativa equivalente per questo specifico cablaggio:

```typescript
let matrix = sarduMatrix.create(96, 16, DigitalPin.P0)
```

Il blocco base usa una riga. Con i default column-serpentine interni e ordine dei moduli da sinistra a destra, i due metodi generano gli stessi 1536 indici fisici. Per griglie con più righe o altri cablaggi si usa la configurazione avanzata descritta in `display-configuration.md` e `wiring.md`.

## 3.1 Configurazioni non 96×16

La nuova estensione non riserva 4608 byte per ogni display. Per un solo modulo 16×16:

```typescript
let matrix = sarduMatrix.createModules(
    1,
    MatrixModuleType.Matrix16x16,
    DigitalPin.P0
)
```

si ottengono 256 LED e un buffer RGB da 768 byte.

Per una superficie diretta 96×32:

```typescript
let matrix = sarduMatrix.create(96, 32, DigitalPin.P0)
```

si ottengono 3072 LED e 9216 byte RGB. Il Metodo diretto non applica regole su quantità o righe.

## 4. Impostare un pixel

Concetto legacy: impostare un colore alle coordinate `(x, y)`.

Nuova sequenza:

```typescript
matrix.setPixel(10, 3, neopixel.colors(NeoPixelColors.Red))
matrix.show()
```

Più pixel possono essere preparati e mostrati insieme:

```typescript
matrix.setPixel(0, 0, neopixel.colors(NeoPixelColors.Red))
matrix.setPixel(95, 15, neopixel.colors(NeoPixelColors.Blue))
matrix.show()
```

La nuova API considera sempre fuori schermo `x == width` e `y == height`; non modifica accidentalmente un LED vicino.

## 5. Cancellare la matrice

Per cancellare sia il buffer sia il display fisico:

```typescript
matrix.clear()
matrix.show()
```

`clear()` da solo prepara un fotogramma nero ma non lo trasmette. Questa regola è la stessa usata per `setPixel()` e `drawText()`.

## 6. Luminosità

```typescript
matrix.setBrightness(64)
matrix.clear()
matrix.drawText("SARDU", 0, 4, neopixel.colors(NeoPixelColors.Red))
matrix.show()
```

Come nel backend NeoPixel usato dalla libreria storica, il nuovo valore agisce sui pixel scritti dopo la chiamata. Non ridimensiona automaticamente il contenuto già preparato. I valori vengono limitati a 0–255 invece di subire il mascheramento numerico del backend.

## 7. Testo statico

Per mostrare una scritta:

```typescript
matrix.clear()
matrix.drawText("CIAO", 0, 4, neopixel.colors(NeoPixelColors.Green))
matrix.show()
```

Differenze intenzionali:

- la posizione è sempre esplicita;
- lo sfondo non viene cancellato da `drawText()`;
- `show()` è esplicito;
- il testo può essere parzialmente fuori schermo senza errori;
- caratteri non supportati diventano `?`;
- non sono previsti livelli di composizione nell'API iniziale.

Per sovrapporre testo a pixel già disegnati, non chiamare `clear()` prima di `drawText()`.

## 8. Testo scorrevole

Esempio:

```typescript
matrix.scrollText(
    "SARDU MATRIX",
    neopixel.colors(NeoPixelColors.Blue),
    80
)
```

Il terzo parametro non è una velocità astratta: è l'intervallo obiettivo fra l'inizio di due fotogrammi, espresso in millisecondi. Rendering e trasferimento ai LED fanno parte di quell'intervallo; se richiedono più tempo del valore impostato, lo scrolling procede alla massima velocità fisicamente possibile senza aggiungere un'altra pausa.

- `40` ms è più veloce di `100` ms;
- `200` ms è più lento;
- `0` richiede l'andamento massimo consentito dal trasferimento LED e dal rendering.

La vecchia formula legava la velocità a un reciproco e rendeva poco intuitivo il risultato. Nella nuova API l'unità è stabile e direttamente spiegabile nei blocchi.

Lo scrolling parte fuori dal bordo destro, attraversa il display, esce dal bordo sinistro e termina col display nero. Non è necessario chiamare `show()` durante o dopo questa operazione composta.

## 9. Colore del testo

Il colore non è uno stato globale separato: viene passato alla singola operazione.

```typescript
matrix.drawText("A", 0, 0, neopixel.rgb(255, 80, 0))
matrix.show()

matrix.scrollText("B", neopixel.rgb(0, 50, 255), 100)
```

Questo evita che il risultato dipenda da una precedente chiamata lontana nel programma e permette colori diversi nello stesso fotogramma statico.

## 10. Cosa non viene migrato direttamente

### Bitmap legacy

Le funzioni bitmap non entrano nella prima API perché la versione legacy contiene semantiche poco chiare e un errore nel posizionamento specchiato con origine non nulla. Un futuro formato bitmap dovrà essere progettato sopra il renderer generico, con mapping e clipping già condivisi.

### Livelli

I livelli testuali legacy non vengono copiati. Il buffer NeoPixel è il piano di composizione iniziale: più chiamate a `setPixel()` e `drawText()` possono costruire lo stesso fotogramma prima di `show()`.

### Auto-show

Le funzioni elementari non aggiornano automaticamente i LED. Quando si converte un programma legacy bisogna aggiungere `show()` dopo aver completato il fotogramma. `scrollText()` è l'eccezione intenzionale, perché gestisce un'intera animazione.

### Accesso alla strip

La strip e il buffer interni non sono pubblici. Un programma che usava direttamente dettagli NeoPixel deve essere convertito alle coordinate logiche della matrice.

## 11. Tabella di conversione rapida

| Risultato desiderato | SARDU-Matrix |
|---|---|
| Configurare un modulo 16×16 | `createModules(1, Matrix16x16, P0)` |
| Configurare 96×16 per moduli | `createModules(6, Matrix16x16, P0)` |
| Configurare per dimensioni | `create(96, 16, P0)` |
| Configurare più righe di moduli | factory/opzioni avanzate con `matrixRows` |
| Accendere un pixel | `setPixel(x, y, color)` poi `show()` |
| Preparare il nero | `clear()` |
| Spegnere fisicamente | `clear()` poi `show()` |
| Impostare luminosità | `setBrightness(0..255)` prima di disegnare |
| Disegnare testo | `drawText(text, x, y, color)` poi `show()` |
| Far scorrere testo | `scrollText(text, color, frameIntervalMs)` |
| Leggere la geometria | `width()` e `height()` |

## 12. Checklist di migrazione

1. Sostituire la dipendenza pxt-smartmatrix con SARDU-Matrix.
2. Creare un oggetto `Matrix` una sola volta all'avvio.
3. Preferire la configurazione per moduli se il display è fisicamente composto da pannelli e scegliere quantità, formato e numero righe corretti.
4. Sostituire gli accessi globali con metodi dell'oggetto.
5. Aggiungere `show()` al termine di ogni fotogramma statico.
6. Ricontrollare tutte le coordinate sui bordi.
7. Convertire la velocità legacy in un intervallo obiettivo del fotogramma, espresso in millisecondi, mediante prova visiva; non esiste una conversione universale affidabile.
8. Impostare la luminosità prima di ridisegnare il contenuto.
9. Rimuovere dipendenze da bitmap/livelli legacy o rimandare la migrazione di quelle parti.
10. Provare su hardware primo/ultimo LED, confini fra moduli e percorso della griglia; 96×16 resta un test obbligatorio ma non l'unica geometria.

## 13. Compatibilità attesa

La migrazione conserva:

- controllo di matrici RGB column-zigzag e altri percorsi configurati;
- coordinate logiche bidimensionali;
- pixel colorati;
- luminosità;
- testo statico monoriga;
- testo scorrevole da destra a sinistra;
- caso di riferimento 96×16 e geometrie più piccole o più grandi compatibili con memoria e timing.

Non promette compatibilità binaria, identità dei nomi o identità visiva dei glifi. SARDU-Matrix usa un font originale e indipendente dai dati legacy. L'obiettivo è l'equivalenza funzionale con un comportamento più esplicito, sicuro e verificabile.
