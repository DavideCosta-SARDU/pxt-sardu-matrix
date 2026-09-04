# Configurazione del display

## 1. Principio

SARDU-Matrix mantiene due configurazioni ufficiali e alternative:

1. dimensioni complessive inserite direttamente;
2. griglia di moduli scelti da una lista controllata.

Le due configurazioni non si sostituiscono. Dopo la validazione entrambe producono una geometria e un piano di mapping normalizzati; pixel, testo, scrolling e output NeoPixel non devono sapere quale metodo pubblico sia stato usato.

Il caso con sei moduli 16×16, pari a 96×16 e 1536 LED, è un esempio e un test di riferimento. Non è il default e non è un limite massimo.

## 2. Metodo 1: dimensioni dirette

L'utente specifica:

- larghezza complessiva in pixel;
- altezza complessiva in pixel;
- pin dati.

Esempio:

```text
larghezza = 96
altezza   = 16
LED       = 96 × 16 = 1536
```

Default proposto:

```text
larghezza = 16
altezza   = 16
```

Questo metodo è indipendente dalla lista dei formati commerciali. Accetta qualunque coppia di interi positivi compatibile con la memoria realmente disponibile.

Il mapping predefinito è column-ZigZag con origine in alto a sinistra, coerente con il comportamento utile della libreria legacy. La configurazione avanzata può scegliere un altro percorso sull'intera superficie.

Il Metodo 1 non contiene i concetti di `NumeroMatrici` o `NumeroRighe`; non applica quindi alcuna regola di divisibilità fra moduli e righe.

## 3. Metodo 2: moduli predefiniti

Il blocco base richiede, sulla stessa riga logica:

- `NumeroMatrici`, campo numerico con default 1;
- `TipoMatrice`, combo con default 16×16;
- pin dati.

Esempio:

```text
NumeroMatrici = 2
TipoMatrice   = 16×16
NumeroRighe   = 1 (default avanzato)
```

Risultato:

```text
NumeroColonne = 2 / 1 = 2
larghezza     = 16 × 2 = 32
altezza       = 16 × 1 = 16
LED           = 512
```

### 3.1 Formati presenti nella combo

Prima versione approvata:

| Valore combo | Larghezza modulo | Altezza modulo |
|---|---:|---:|
| 8×8 | 8 | 8 |
| 16×16 | 16 | 16 |
| 32×8 | 32 | 8 |
| 8×32 | 8 | 32 |
| 16×8 | 16 | 8 |
| 8×16 | 8 | 16 |

Non vengono inseriti inizialmente 32×16, 16×32 o 32×32. Aggiungere un nuovo formato in futuro deve richiedere soltanto un nuovo valore della combo e la relativa coppia larghezza/altezza, senza modificare renderer o backend.

La dimensione del formato non determina il cablaggio interno: due pannelli entrambi 16×16 possono avere percorsi fisici differenti. Il tipo seleziona soltanto larghezza e altezza.

### 3.2 Numero di righe

`NumeroRighe` è un'opzione avanzata con default 1.

Si calcola:

```text
NumeroColonne = NumeroMatrici / NumeroRighe
```

La configurazione modulare descrive una griglia rettangolare completa. È quindi valida soltanto se:

```text
NumeroMatrici % NumeroRighe == 0
```

Esempio valido:

```text
NumeroMatrici = 12
NumeroRighe   = 2
NumeroColonne = 6
TipoMatrice   = 16×16
display       = 96×32
LED           = 3072
```

Esempio non rettangolare:

```text
NumeroMatrici = 5
NumeroRighe   = 2
```

produrrebbe una riga da tre moduli e una da due. Le griglie con posizioni mancanti non fanno parte della prima versione: avrebbero coordinate logiche senza LED e richiederebbero un modello di display irregolare.

La regola riguarda esclusivamente il Metodo 2. Non limita le dimensioni dirette del Metodo 1.

## 4. Geometria calcolata nel Metodo 2

Definiti:

```text
MW = larghezza modulo
MH = altezza modulo
N  = NumeroMatrici
R  = NumeroRighe
C  = N / R
```

si calcola:

```text
displayWidth  = MW × C
displayHeight = MH × R
ledCount      = MW × MH × N
rgbBytes      = ledCount × 3
```

Nessuno di questi valori è fissato a 16×16, sei moduli o 1536 LED.

## 5. Normalizzazione comune

Dopo la creazione, entrambi i metodi producono almeno:

```text
width
height
ledCount
rgbBytes
pixelOrigin
pixelScanAxis
pixelPath
```

La configurazione modulare aggiunge al piano fisico:

```text
moduleWidth
moduleHeight
moduleCount
moduleColumns
moduleRows
moduleOrigin
moduleScanAxis
modulePath
```

I renderer consumano soltanto `width`, `height` e una funzione coordinate→indice. I dettagli modulari appartengono esclusivamente al mapper.

## 6. Configurazione avanzata del cablaggio

Il percorso dei pixel e il percorso dei moduli sono due livelli indipendenti.

### 6.1 Origine

Valori iniziali:

- alto a sinistra;
- alto a destra;
- basso a sinistra;
- basso a destra.

Per il Metodo 1 l'origine indica il primo pixel fisico dell'intera superficie.

Per il Metodo 2 si distinguono:

- origine del primo pixel dentro ogni modulo;
- origine del primo modulo nella griglia.

### 6.2 Asse di scansione

Valori:

- righe;
- colonne.

Una scansione per righe completa una riga prima di passare alla successiva. Una scansione per colonne completa una colonna prima di passare alla successiva.

### 6.3 Percorso

Valori:

- progressivo;
- ZigZag.

Progressivo significa che ogni riga o colonna usa la stessa direzione logica, con un collegamento di ritorno verso l'inizio della tratta successiva.

Serpentina significa che le tratte alternate percorrono direzioni opposte.

### 6.4 Default

Default pixel:

```text
origine  = alto a sinistra
asse     = colonne
percorso = ZigZag
```

Default moduli:

```text
origine  = alto a sinistra
asse     = righe
percorso = ZigZag
```

Con una sola riga di moduli, progressivo e ZigZag per righe producono lo stesso ordine dei moduli.

## 7. Formula generica del percorso

### 7.1 Trasformazione dell'origine

Per una coordinata `(x, y)` in una superficie `W × H`:

```text
scanX = origine a destra ? W - 1 - x : x
scanY = origine in basso ? H - 1 - y : y
```

### 7.2 Scansione per colonne

Progressiva:

```text
index = scanX × H + scanY
```

Serpentina:

```text
se scanX è pari:
    index = scanX × H + scanY
altrimenti:
    index = scanX × H + (H - 1 - scanY)
```

### 7.3 Scansione per righe

Progressiva:

```text
index = scanY × W + scanX
```

Serpentina:

```text
se scanY è pari:
    index = scanY × W + scanX
altrimenti:
    index = scanY × W + (W - 1 - scanX)
```

La stessa funzione concettuale viene usata sia per i pixel sia per le posizioni dei moduli.

## 8. Mapping della configurazione modulare

Per una coordinata logica globale `(x, y)`:

```text
moduleColumn = floor(x / MW)
moduleRow    = floor(y / MH)
localX       = x % MW
localY       = y % MH
```

Si calcolano separatamente:

```text
modulePosition = percorsoGriglia(moduleColumn, moduleRow)
localPosition  = percorsoModulo(localX, localY)
moduleArea     = MW × MH
physicalIndex  = modulePosition × moduleArea + localPosition
```

Questo modello non richiede una tabella completa degli indici e funziona per tutti i formati approvati.

## 9. Caso di riferimento 96×16

Metodo 1:

```text
width  = 96
height = 16
pixel  = column-ZigZag, origine alto-sinistra
```

Metodo 2:

```text
NumeroMatrici = 6
TipoMatrice   = 16×16
NumeroRighe   = 1
pixel         = column-ZigZag, origine alto-sinistra
moduli        = per righe, origine alto-sinistra
```

Poiché la larghezza del modulo è pari e i moduli sono sulla stessa riga, i due metodi producono lo stesso indice per tutte le 1536 coordinate.

Questa equivalenza è un test obbligatorio, non una regola generale per formati, origini o percorsi differenti.

## 10. Caso informativo 6×2 moduli 16×16

```text
NumeroMatrici = 12
TipoMatrice   = 16×16
NumeroRighe   = 2
NumeroColonne = 6
display       = 96×32
LED           = 3072
rgbBytes      = 9216
```

Il percorso tra i moduli determina quale pannello riceve gli indici 0–255, 256–511 e così via. Il percorso interno determina come quei 256 indici sono distribuiti nei pixel del pannello.

Una configurazione diretta 96×32 è equivalente soltanto se il cablaggio fisico complessivo coincide realmente col percorso continuo scelto. Non si deve presumerlo.

## 11. Validazione

Entrambi i metodi devono verificare:

- interi positivi;
- moltiplicazioni senza overflow;
- `ledCount == width × height`;
- `rgbBytes == ledCount × 3`;
- dimensione rappresentabile dal Buffer del target;
- allocazione realmente riuscita.

Il Metodo 2 verifica inoltre:

- tipo presente nella combo;
- `NumeroMatrici >= 1`;
- `NumeroRighe >= 1`;
- `NumeroRighe <= NumeroMatrici`;
- divisibilità esatta fra quantità e righe;
- percorso e origine supportati.

Non esiste un massimo software fisso di 1536 LED. La memoria libera non può essere conosciuta con certezza usando soltanto il modello della scheda: dipende da runtime, programma e altre estensioni. Un'allocazione eccessiva può quindi fallire anche se i calcoli numerici sono formalmente validi.

Non si correggono silenziosamente quantità, righe o dimensioni.

## 12. Coordinate invalide

Sono valide soltanto:

```text
0 <= x < width
0 <= y < height
```

Coordinate fuori schermo non producono un indice e non modificano il buffer. In particolare `x == width` e `y == height` sono fuori schermo.

## 13. Interfaccia MakeCode

Blocchi base concettuali:

```text
crea matrice larghezza [16] altezza [16] su pin [P1]
```

```text
crea matrice con [1] moduli di tipo [16×16] sul pin [P1] luminosità [128]
```

Le opzioni non necessarie al caso comune devono essere collocate in “Altro…” mediante blocchi avanzati o, se il prototipo MakeCode risulta chiaro, parametri espandibili.

La configurazione avanzata deve permettere almeno:

- numero righe;
- origine pixel;
- asse pixel;
- percorso pixel;
- origine moduli;
- asse moduli;
- percorso moduli.

La forma visiva definitiva sarà scelta dopo una prova nell'editor, senza cambiare il modello matematico.

## 14. Invarianti

Dopo una creazione valida:

- `width > 0` e `height > 0`;
- `ledCount == width × height`;
- il buffer RGB contiene esattamente `ledCount × 3` byte;
- ogni coordinata valida produce un solo indice nell'intervallo;
- ogni indice appartiene a una sola coordinata;
- coordinate invalide non modificano LED;
- testo e scrolling non interrogano il metodo di configurazione;
- memoria e durata di `show()` crescono col numero reale di LED.

## 15. Test richiesti

### Configurazione diretta

- 1×1;
- 16×16;
- 96×16;
- 96×32;
- dimensioni invalide e prodotti eccessivi.

### Formati combo

- 8×8;
- 16×16;
- 32×8;
- 8×32;
- 16×8;
- 8×16.

### Griglie

- 1 modulo, 1 riga;
- 2 moduli, 1 riga;
- 6 moduli, 1 riga;
- 12 moduli, 2 righe;
- quantità non divisibile per righe;
- righe maggiori della quantità.

### Mapping avanzato

- quattro origini;
- scansione righe/colonne;
- progressivo/ZigZag;
- combinazioni pixel/moduli;
- unicità, copertura e limiti.

### Compatibilità

- equivalenza completa 96×16 nei default compatibili;
- confini fra moduli;
- primo e ultimo LED;
- test visivo hardware descritto in `wiring.md`.

### Verifica progettuale del 23 agosto 2026

Uno script temporaneo, rimosso dopo l'esecuzione, ha verificato:

- 16 configurazioni per livello: quattro origini × due assi × due percorsi;
- 96 superfici singole: sei formati × 16 configurazioni;
- 6144 combinazioni modulari su griglie 1×1, 2×1, 6×1 e 6×2;
- indice sempre intero e compreso fra 0 e `ledCount - 1`;
- nessun indice duplicato e nessun indice mancante;
- zero differenze fra 96×16 diretto e sei moduli 16×16 con default compatibili;
- corretta individuazione di 5 moduli / 2 righe come griglia non rettangolare.

Questa verifica convalida le formule di progetto. Le stesse combinazioni sono incluse nel `test.ts` dell'estensione; restano necessarie le prove sull'hardware reale.

## 16. Conclusione

Il Metodo 1 mantiene la libertà della vecchia libreria tramite larghezza e altezza complessive. Il Metodo 2 semplifica l'uso di pannelli comuni tramite quantità e formato, aggiungendo il numero di righe soltanto quando necessario.

Il modello avanzato non confonde dimensione e cablaggio: origine, asse e percorso descrivono separatamente pixel e moduli. Il buffer viene sempre dimensionato sul numero reale di LED e nessun caso d'uso particolare diventa un limite universale.
