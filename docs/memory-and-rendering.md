# Memoria, rendering e limiti fisici

## 1. Stato dell'analisi

Analisi eseguita il 23 agosto 2026 prima dell'implementazione. I valori fisici provengono dalla documentazione ufficiale micro:bit, dal codice fissato di pxt-neopixel/pxt-ws2812b e dal datasheet Worldsemi WS2812B-V5.

Questa fase sceglie la strategia di progetto, ma non sostituisce compilazione, profilazione e prova su hardware. In particolare, RAM fisica totale e heap realmente disponibile a un programma MakeCode non sono la stessa quantità.

## 2. Hardware micro:bit

### 2.1 micro:bit V1

La revisione V1.5 usa come processore applicativo un Nordic nRF51822, Cortex-M0 a 16 MHz, con:

- 256 KB di flash;
- 16 KB di RAM.

Fonte ufficiale: https://tech.microbit.org/hardware/1-5-revision/

Il codice utente, il runtime, stack, heap, periferiche e buffer condividono i 16 KB. Non è quindi corretto considerare tutti i 16 KB disponibili per l'estensione.

### 2.2 micro:bit V2

Le revisioni V2 usano come processore applicativo un Nordic nRF52833, Cortex-M4F a 64 MHz, con:

- 512 KB di flash;
- 128 KB di RAM.

Fonti ufficiali:

- https://tech.microbit.org/hardware/
- https://tech.microbit.org/hardware/2-0-revision/

La RAM del processore di interfaccia USB non è memoria utilizzabile dal programma MakeCode: per questa analisi conta soltanto la RAM del processore applicativo.

### 2.3 Confronto

| Scheda | RAM fisica | Buffer RGB 1536 LED | Percentuale della RAM fisica |
|---|---:|---:|---:|
| micro:bit V1 | 16.384 byte | 4.608 byte | 28,125% |
| micro:bit V2 | 131.072 byte | 4.608 byte | 3,516% |

Già il solo buffer colore occupa più di un quarto della RAM fisica V1, prima di contare runtime e heap. Su V2 il medesimo costo è molto più sostenibile.

## 3. Buffer allocato da pxt-neopixel

Il codice fissato in `references/pxt-neopixel/neopixel.ts` crea esattamente:

```text
numleds × stride
```

dove:

- `stride = 3` per RGB e RGB_RGB;
- `stride = 4` per RGBW.

La prima versione usa RGB, quindi il costo fondamentale è sempre:

```text
rgbBytes = ledCount × 3
```

Esempi:

```text
16 × 16 = 256 LED → 768 byte RGB
32 × 16 = 512 LED → 1536 byte RGB
96 × 16 = 1536 LED → 4608 byte RGB
96 × 32 = 3072 LED → 9216 byte RGB
```

| LED RGB | Byte | V1 fisica | V2 fisica |
|---|---:|---:|---:|
| 256 | 768 | 4,688% | 0,586% |
| 512 | 1.536 | 9,375% | 1,172% |
| 1.536 | 4.608 | 28,125% | 3,516% |
| 3.072 | 9.216 | 56,25% | 7,031% |

Le percentuali sono rispetto alla RAM fisica, non alla RAM libera. Il costo reale include inoltre intestazione dell'oggetto Buffer, oggetto Strip, oggetto Matrix e allocator.

RGBW non è incluso nell'API iniziale. Il Buffer non è fissato al caso 1536: pxt-neopixel alloca esattamente la dimensione richiesta dalla configurazione.

### 3.1 Limite della singola allocazione nel runtime verificato

La verifica eseguita durante l'implementazione su micro:bit PXT 9.1.1 / pxt-core 13.0.1 ha confermato che la lunghezza del `Buffer` nativo è un intero a 32 bit: non esiste quindi un limite strutturale a 65.535 byte. Il garbage collector del target impone però un massimo alla singola allocazione:

- runtime DAL/V1: circa 9.000 byte complessivi;
- runtime CODAL/V2: circa 11.000 byte complessivi.

Questi valori comprendono anche l'intestazione dell'oggetto e possono cambiare con il target MakeCode. Non diventano un limite fisso dell'API: `neopixel.create()` tenta l'allocazione esatta di `LED × 3` byte e il runtime segnala un errore se la configurazione non entra nella memoria o supera il massimo della singola allocazione.

## 4. Altre occupazioni di memoria

### 4.1 Permanenti

Oltre ai 4.608 byte del buffer NeoPixel sono necessari:

- oggetto `Matrix` e riferimento alla strip;
- geometria e piano di mapping normalizzati;
- luminosità e pochi campi di stato;
- tabella del font;
- runtime MakeCode e runtime micro:bit;
- stack ed heap del programma utente.

Il piano di mapping non richiede una tabella da 1536 indici: l'indice viene calcolato con formule intere. Una tabella di indici a 16 bit costerebbe altri 3.072 byte e non è giustificata.

Il font definitivo accetta ASCII 32–126, riusa le forme maiuscole per le lettere minuscole e memorizza 69 forme da cinque colonne:

```text
69 forme × 5 byte = 345 byte
```

La rappresentazione finale in flash/RAM dipende dalla compilazione PXT. La profilazione hardware dovrà comunque verificare che il literal non produca una copia RAM inattesa. I 345 byte restano inferiori ai 760 byte della tabella legacy a otto byte per glifo.

### 4.2 Temporanee

Il renderer proposto deve evitare:

- array per ogni glifo;
- bitmap dell'intera stringa;
- array delle coordinate accese;
- copie del buffer a ogni fotogramma;
- substring per selezionare la parte visibile.

Per lo scrolling servono soltanto contatori, coordinate, riferimenti alla stringa e accesso diretto alla tabella compatta del font. La memoria temporanea deve restare sostanzialmente costante rispetto alla lunghezza della stringa, salvo la stringa fornita dall'utente.

## 5. Timing del trasferimento WS2812B

Il WS2812B usa 24 bit per pixel RGB e un flusso nominale di 800 kbit/s. Il datasheet Worldsemi WS2812B-V5 indica inoltre un reset maggiore di 280 µs.

Fonti:

- famiglia ufficiale: https://world-semi.com/ws2812-family/
- datasheet V5 consultato: https://datasheet.lcsc.com/datasheet/pdf/3795cfb9d54f7ec8ecc0b043ede3c05a.pdf

Formula ideale per `N` LED:

```text
1 bit / 800.000 bit/s = 1,25 µs
24 bit × 1,25 µs = 30 µs per LED
showMs(N) = N × 0,03 ms + almeno 0,28 ms di reset
```

| LED | Buffer RGB | Show minimo | FPS teorici massimi |
|---:|---:|---:|---:|
| 256 | 768 byte | 7,96 ms | 125,63 |
| 512 | 1.536 byte | 15,64 ms | 63,94 |
| 1.536 | 4.608 byte | 46,36 ms | 21,57 |
| 3.072 | 9.216 byte | 92,44 ms | 10,82 |

Questo è un limite del collegamento seriale, non della velocità del renderer. Calcolo coordinate, cancellazione, testo, chiamate MakeCode e scheduling riducono ulteriormente il frame rate ottenibile.

Il driver assembly fissato in pxt-ws2812b trasmette l'intero Buffer e, nel percorso DAL visibile, disabilita gli interrupt durante il flusso temporizzato. Più LED significano un intervallo bloccante più lungo: interazioni con radio, temporizzazioni e periferiche devono essere provate su entrambe le revisioni. Il manifest della dipendenza disabilita esplicitamente Bluetooth nel percorso micro:bit DAL.

Conclusione: il frame rate dichiarabile deve essere calcolato e misurato per il numero configurato di LED. Per 1536 è inferiore a 22 fps; per 3072 è inferiore a 11 fps.

## 6. Conseguenza sull'API di scrolling

Un parametro definito come semplice pausa aggiuntiva renderebbe il tempo reale del fotogramma pari a:

```text
rendering + `showMs(ledCount)` + pausa
```

Per esempio, con 1536 LED una pausa aggiuntiva di 100 ms produrrebbe meno di 7 fps. È più comprensibile definire il parametro pubblico come durata obiettivo del fotogramma:

```typescript
scrollText(text, color, frameIntervalMs)
```

Per ogni fotogramma:

1. si registra l'istante iniziale;
2. si cancella e renderizza;
3. si esegue `show()`;
4. si attende soltanto il tempo restante per raggiungere `frameIntervalMs`.

Se l'intervallo richiesto è inferiore al tempo realmente necessario, non si aggiunge pausa. Il frame rate resta limitato dall'hardware. Il valore predefinito proposto rimane 100 ms, cioè circa 10 fps quando il lavoro completo rientra nei 100 ms.

## 7. Strategie confrontate

### 7.1 Secondo framebuffer RGB completo

Descrizione: conservare una scena logica RGB separata dal buffer NeoPixel.

Vantaggi:

- ridimensionamento globale della luminosità già disegnata;
- composizione e trasformazioni indipendenti dal backend;
- possibilità di preparare un fotogramma mentre un altro viene trasmesso, se il backend lo consentisse.

Svantaggi:

- raddoppia `ledCount × 3` più overhead;
- per 1536 LED supera il 56% della RAM fisica V1 contando i soli due buffer;
- copia o conversione completa prima di ogni show;
- il backend corrente è sincrono, quindi il double buffering non rende asincrona la trasmissione;
- non è richiesto dalle funzioni iniziali.

Decisione: rifiutato per la prima versione.

### 7.2 Buffer parziale o tile buffer

Descrizione: memorizzare una riga, una colonna o una tessera.

Vantaggi:

- piccolo costo aggiuntivo;
- utile per algoritmi locali specifici.

Svantaggi:

- il protocollo deve comunque inviare in ordine i colori di tutti i LED configurati;
- pxt-neopixel espone `show()` sull'intero buffer serializzato;
- un buffer parziale non sostituisce il buffer NeoPixel obbligatorio;
- complica composizione e API senza ridurre il buffer principale `ledCount × 3`.

Decisione: non adottato come architettura base. Piccoli scratch buffer potranno essere introdotti in futuro solo per una funzione che ne dimostri la necessità.

### 7.3 Rendering diretto nel buffer NeoPixel

Descrizione: `setPixel`, testo e futuro rendering calcolano l'indice fisico e scrivono tramite l'API pubblica della strip; `show()` trasmette lo stesso buffer.

Vantaggi:

- un solo buffer colore obbligatorio;
- nessuna copia completa;
- semantica semplice clear/draw/show;
- adatto a pixel, testo e primitive grafiche future;
- usa il backend ufficiale già approvato.

Svantaggi:

- la luminosità non può ridimensionare automaticamente una scena arbitraria già scritta;
- non esiste una scena indipendente dal backend;
- ogni show resta una trasmissione completa e sincrona.

Decisione: strategia scelta.

### 7.4 Rendering puramente in streaming senza buffer colore

Descrizione: generare i byte mentre vengono trasmessi.

Vantaggi potenziali:

- eliminazione dei 4.608 byte.

Svantaggi:

- richiede riscrivere o sostituire il backend ufficiale;
- il timing di 800 kbit/s non lascia spazio a logica MakeCode fra i bit;
- complica drasticamente composizione, testo e affidabilità;
- diverge da pxt-neopixel e aumenta manutenzione e rischio hardware.

Decisione: rifiutato.

## 8. Strategia scelta

La prima versione usa:

- un solo Buffer RGB, quello allocato da pxt-neopixel;
- nessuna tabella completa di mapping;
- formule pure per coordinate→indice;
- font compatto;
- rendering diretto con clipping;
- nessuna bitmap completa della stringa;
- `show()` esplicito per i fotogrammi statici;
- scrolling che visita soltanto i glifi potenzialmente visibili;
- intervallo obiettivo del fotogramma, non pausa aggiuntiva.

L'assenza di un secondo framebuffer non lega il motore al testo: future linee, rettangoli e bitmap possono chiamare lo stesso `setPixel()` e condividere clipping, mapping e show.

## 9. Supporto V1 e V2

### micro:bit V2

È la piattaforma con maggiore margine per configurazioni grandi. Un buffer da 256 LED occupa 768 byte; 1536 LED occupano circa il 3,5% della RAM fisica e 3072 circa il 7%. Il progetto deve comunque essere profilato insieme al programma utente prima di dichiarare una configurazione massima consigliata.

### micro:bit V1

La V1 è utilizzabile soprattutto con configurazioni più piccole, ma non viene esclusa dall'API. Il buffer usa il 4,688% della RAM fisica con 256 LED, il 28,125% con 1536 e il 56,25% con 3072, prima di runtime, stack e heap. Ogni fascia significativa deve essere provata mediante:

- compilazione del test minimo V1;
- avvio e allocazione di buffer da 256, 512, 1536 e, solo se realistico, 3072 LED;
- clear/disegno/show ripetuti;
- scrolling di durata significativa;
- controllo di panic, reset e frammentazione;
- prova insieme alle funzionalità realmente usate dal progetto finale.

Se una configurazione fallisce, la documentazione la dichiarerà non consigliata o non supportata su V1 sulla base della misura. Non verrà aggiunto un limite API universale né un secondo backend non ufficiale per salvare RAM.

## 10. Limite reale del numero di LED

Non viene imposto un massimo artificiale di 1536 LED. La factory calcola:

```text
ledCount = width × height
rgbBytes = ledCount × 3
```

Il validatore impedisce valori non interi, prodotti non rappresentabili e dimensioni Buffer non rappresentabili. Non può però conoscere con certezza la RAM ancora libera dopo runtime, variabili e altre estensioni. Il limite pratico coincide quindi con l'allocazione che il programma completo riesce a sostenere e con timing accettabili per l'uso previsto.

Le guide forniranno esempi e fasce misurate, non un valore universale presentato come garanzia.

## 11. Alimentazione e segnale: limite esterno ma essenziale

Le matrici non devono essere alimentate dal pin 3V del micro:bit. Le specifiche ufficiali indicano, a seconda della revisione, decine o poche centinaia di milliampere disponibili sul connettore; anche configurazioni molto più piccole possono superare questo valore.

Il WS2812B-V5 citato dal produttore usa fino a 12 mA per ciascuno dei tre canali, cioè fino a 36 mA per pixel:

```text
Imax teorica = ledCount × corrente massima dichiarata per il LED reale
esempio 1536 × 36 mA = 55.296 mA = 55,296 A
```

Varianti più vecchie o pannelli diversi possono avere un massimo differente. La luminosità software e il contenuto riducono il consumo medio, ma non sostituiscono il dimensionamento elettrico.

Il dimensionamento elettrico è responsabilità dell'utente e dell'installazione. Requisiti da documentare:

- alimentatore esterno dimensionato per pannelli e luminosità massima prevista;
- iniezione di alimentazione distribuita e cablaggio adeguato;
- protezioni/fusibili appropriati al progetto;
- negativo/massa comune fra alimentatore esterno, matrice e GND del micro:bit;
- verifica del livello logico e dell'integrità del segnale sulla catena reale;
- mai prelevare dal pin 3V del micro:bit la corrente della matrice.

Questi aspetti non cambiano l'API software, ma determinano la sicurezza e l'affidabilità del sistema.

## 12. Piano di verifica dell'implementazione

### Compilazione

- compilare per universal hex V1/V2 col target MakeCode corrente;
- registrare dimensione del binario e ogni diagnostica;
- controllare che la tabella font non venga duplicata inutilmente in RAM;
- verificare allocazioni proporzionali per 256, 512, 1536 e 3072 LED;
- verificare rifiuto di prodotti numericamente o tecnicamente non rappresentabili senza introdurre un massimo arbitrario.

### Profilazione

- misurare heap prima e dopo la factory;
- misurare heap durante testo statico e scrolling;
- ripetere lo scrolling per rilevare crescita o frammentazione;
- verificare assenza di allocazioni proporzionali alla lunghezza del testo durante ogni frame.

### Timing

- misurare durata di `show()` su V1 e V2;
- misurare clear + testo visibile + show;
- verificare intervalli richiesti di 50, 100 e 200 ms;
- confermare il comportamento quando l'intervallo richiesto è sotto il limite fisico.

### Hardware

- verificare configurazioni piccole e grandi con alimentazione esterna corretta;
- provare colonne pari/dispari, formati combo e confini dei moduli;
- osservare reset, flicker e perdita di dati;
- provare le altre funzioni MakeCode che il progetto deve usare durante lo scrolling.

## 13. Conclusione

Per qualunque geometria, il buffer RGB obbligatorio è `ledCount × 3` byte. Duplicarlo non porta benefici sufficienti e rende soprattutto V1 più fragile. Il rendering diretto nel buffer NeoPixel, con mapping calcolato e font compatto, è il miglior compromesso fra RAM, semplicità, velocità ed estendibilità.

V2 offre più margine, mentre V1 richiede maggiore prudenza, ma l'API non impone una geometria diversa per scheda. Memoria e tempo crescono linearmente: 256 LED richiedono 768 byte e almeno circa 7,96 ms di show; 1536 richiedono 4608 byte e 46,36 ms; 3072 richiedono 9216 byte e 92,44 ms. L'alimentazione esterna deve sempre essere dimensionata dall'utente per l'hardware reale, con massa comune al micro:bit.
