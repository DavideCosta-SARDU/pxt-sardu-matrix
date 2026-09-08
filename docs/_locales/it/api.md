# API pubblica

[English](../../api.md)

SARDU-Matrix espone il namespace `sarduMatrix`. Tutte le funzioni di creazione restituiscono un oggetto `Matrix`, che gestisce mapping fisico, strip NeoPixel e buffer RGB. Il programma usa sempre coordinate logiche X/Y con origine in alto a sinistra.

## Creazione

Con dimensioni logiche dirette:

```typescript
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
```

Con moduli predefiniti:

```typescript
let matrix = sarduMatrix.createModules(
    2,
    MatrixModuleType.Matrix16x16,
    DigitalPin.P1,
    128
)
```

I blocchi avanzati permettono di scegliere origine, asse di scansione, percorso progressivo/ZigZag e ordine dei moduli. Consulta [configurazione display](display-configuration.md) e [cablaggio](wiring.md). Il pin predefinito è P1 e la luminosità predefinita è 128 su un intervallo 0–255.

## Display e buffer

- `matrix.setPixel(x, y, color)` scrive un pixel nel buffer.
- `matrix.clearBuffer()` cancella soltanto il buffer.
- `matrix.clear()` cancella il buffer e aggiorna i LED.
- `matrix.show()` invia il buffer completo ai LED.
- `matrix.interruptAndClear()` interrompe un'animazione e cancella la matrice.
- `matrix.setBrightness(value)` cambia la luminosità dei pixel scritti successivamente.
- `matrix.width()`, `height()`, `ledCount()` e `rgbBufferBytes()` restituiscono dimensioni e costo del buffer.

Le coordinate esterne vengono ritagliate in sicurezza. Testo statico, geometrie, icone e Grafica modificano il buffer e richiedono un unico `show()` dopo aver composto l'intera scena.

## Testo

```typescript
matrix.drawText(
    "Ciao", 0, 0,
    neopixel.colors(NeoPixelColors.White),
    MatrixFont.Sardu,
    MatrixFontSize.X1,
    128,
    MatrixTextOrientation.Normal
)
matrix.show()
```

I font disponibili sono SARDU, Micro:Bit Esteso, SARDU Proporzionale, Micro:Bit Proporzionale, SARDU Compatto e SARDU Compatto Proporzionale. Le dimensioni vanno da 1× a 4×; gli orientamenti disponibili sono 0°, 90°, 180° e 270°.

Le altezze esatte in pixel, gli esempi per posizionare più righe e le regole di misurazione sono documentati in [font e misure del testo](fonts.md).

I blocchi di centratura operano sull'intera matrice oppure entro limiti scelti. `measureTextWidth()`, `measureTextHeight()` e `measureFontHeight()` espongono le stesse misure usate dal renderer.

Il testo sfumato può interpolare due colori oppure due luminosità dello stesso colore. Consulta [testo sfumato e icone](gradient-and-icons.md).

## Scorrimento

`scrollTextFromEdge()` esegue subito uno scorrimento completo dal bordo selezionato. `scrollTextBetween()` segue immediatamente le coordinate X/Y iniziali e finali.

Per muovere più elementi simultaneamente, aggiungili tutti alla stessa composizione e chiama `startScrolling()` una sola volta:

```typescript
matrix.addScrollingText(
    "Ciao", 0,
    neopixel.colors(NeoPixelColors.White),
    MatrixFont.Sardu,
    MatrixFontSize.X1,
    128,
    MatrixTextOrientation.Normal,
    1
)
sarduMatrix.addScrollingCircle(
    matrix, 8, 8, 3,
    neopixel.colors(NeoPixelColors.Red),
    1
)
matrix.startScrolling(100, MatrixScrollMode.Exclusive)
```

I percorsi in coda accettano coordinate iniziali e finali esatte. Il valore speciale X iniziale `-1` indica la larghezza reale della matrice; ogni altro valore viene usato direttamente. La modalità Esclusiva cancella lo sfondo a ogni fotogramma. La modalità Composta conserva la scena e richiede temporaneamente una seconda copia RGB.

## Geometrie, icone e Grafica

Le geometrie statiche e scorrevoli comprendono linee, rettangoli, rettangoli pieni, cerchi e cerchi pieni. Le icone 8×8 comprendono cuori, volti, stella, spunta, croce, frecce, sole, luna e fulmine. Le immagini native Grafica possono usare sfondo trasparente oppure sostitutivo.

Tutte le operazioni sono ritagliate ai bordi e non avvolgono mai i pixel sul lato opposto.

## Colori

Ogni parametro colore accetta il selettore MakeCode, i colori NeoPixel, `neopixel.rgb()` e:

```typescript
sarduMatrix.rgbColor(0, 128, 255)
sarduMatrix.hslColor(210, 100, 50)
```

RGB usa valori 0–255. HSL usa tonalità 0–360 e saturazione/luminosità 0–100.

## Effetti e revisioni Micro:Bit

Gli effetti includono dissolvenza, lampeggio, riempimenti direzionali e contrapposti, maschere sul contenuto, arcobaleno e scintille. Aggiornano automaticamente i LED e possono lasciare, ripristinare o cancellare il fotogramma finale. Consulta [effetti speciali](effects.md).

I progetti realistici separati di creazione, display, testo, geometrie, scorrimento, sfumature, effetti e Grafica vengono compilati per Micro:Bit V1 e V2. Micro:Bit V2 è consigliato per matrici grandi ed effetti, grazie al maggiore margine di memoria programma e RAM. Una funzione viene indicata come solo V2 esclusivamente quando un progetto rappresentativo indipendente non può funzionare su V1; l'API corrente non è classificata globalmente come solo V2.

## Errori e memoria

Dimensioni o mapping non validi usano `control.panic(920)`. Un'allocazione eccessiva può invece produrre il panic del runtime MakeCode. L'estensione non riduce mai silenziosamente le dimensioni richieste.

Il buffer permanente è proporzionale ai LED configurati:

```text
byte RGB = larghezza × altezza × 3
```

Il limite reale dipende dalla revisione Micro:Bit, dalle altre estensioni e dal resto del programma. Consulta [memoria e rendering](memory-and-rendering.md) e [procedura di test](testing.md).
