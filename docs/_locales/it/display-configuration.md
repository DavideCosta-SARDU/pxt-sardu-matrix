# Configurazione del display

[English](../../display-configuration.md)

SARDU-Matrix può configurare il display mediante le dimensioni complessive oppure come griglia di moduli fisici uguali. Entrambi i metodi creano lo stesso sistema di coordinate logiche per pixel, testo, grafica, scorrimento ed effetti.

## Dimensioni dirette

Usa `create(width, height, pin, brightness)` quando il display completo è una superficie rettangolare. Il pin dati predefinito è P1 e la luminosità predefinita è 128; entrambi restano modificabili.

```blocks
let matrix = sarduMatrix.create(32, 16, DigitalPin.P1, 128)
```

Usa `createAdvanced` quando il primo pixel, l'asse di scansione o il percorso progressivo/ZigZag differiscono dalla disposizione standard.

## Moduli predefiniti

Usa `createModules` per una catena orizzontale di pannelli uguali. I formati disponibili sono 8×8, 16×16, 32×8, 8×32, 16×8 e 8×16.

```blocks
let matrix = sarduMatrix.createModules(6, MatrixModuleType.Matrix16x16, DigitalPin.P1, 128)
```

Questo esempio crea un display logico 96×16. Usa `createModulesAdvanced` per una griglia rettangolare di moduli o per configurare separatamente il percorso dei pixel e quello dei moduli.

## Origine, asse e percorso

- **Origine** identifica l'angolo che contiene il primo LED.
- **Asse di scansione** seleziona righe o colonne come direzione principale.
- **Percorso** seleziona il cablaggio progressivo oppure alternato ZigZag.

Le impostazioni del percorso pixel descrivono il cablaggio interno di ogni modulo. Quelle del percorso moduli descrivono come i moduli sono collegati tra loro. La configurazione deve riprodurre il cablaggio fisico; le coordinate di disegno devono restare logiche.

## Configurazioni comuni

- Un modulo 16×16 produce un display 16×16.
- Due moduli 16×16 su una riga producono 32×16.
- Sei moduli 16×16 su una riga producono 96×16.
- Dodici moduli 16×16 su due righe producono 96×32.

## Configurazioni non valide

Larghezza, altezza, numero di moduli e righe di moduli devono essere interi positivi. Il numero di moduli deve essere divisibile per il numero di righe. I valori non validi arrestano il programma con il codice panic `920` invece di creare un buffer parziale.

## Memoria e scelta della scheda

La memoria necessaria cresce con il numero totale di LED. Micro:Bit V1 resta adatta ai normali progetti con display più piccoli e famiglie di funzioni selezionate; Micro:Bit V2 è consigliata per matrici grandi ed effetti che richiedono più memoria. Consulta [Memoria, rendering e limiti fisici](memory-and-rendering.md).

Dopo la configurazione, verifica il primo pixel, l'angolo opposto e ogni confine tra moduli seguendo la [guida al cablaggio](wiring.md).
