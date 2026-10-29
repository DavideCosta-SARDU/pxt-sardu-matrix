# Memoria, rendering e limiti fisici

[English](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v1.0.0/docs/memory-and-rendering.md)

## Memoria utilizzata

SARDU-Matrix conserva l'immagine corrente in un buffer RGB la cui dimensione cresce con il numero di LED configurati:

```text
byte RGB = larghezza × altezza × 3
```

Per esempio, 16×16 richiede 768 byte RGB, 32×16 ne richiede 1.536 e 96×16 ne richiede 4.608. Questi valori descrivono soltanto i dati RGB; anche il programma, il runtime MakeCode e i dati temporanei delle animazioni usano memoria.

L'estensione non impone un numero massimo di moduli fisso per ciascuna revisione della scheda. Il limite pratico dipende dalla revisione micro:bit, dal programma completo dell'utente e dalle operazioni scelte.

## micro:bit V1 e V2

micro:bit V1 può eseguire normali progetti con matrici più piccole e famiglie di funzioni selezionate. micro:bit V2 offre molta più RAM e spazio programma ed è consigliata per matrici grandi, composizioni complesse ed effetti.

Un errore di dimensione del programma riguarda firmware/flash, mentre un errore di allocazione durante l'esecuzione riguarda la RAM. Il runner monolitico `pxt test` collega l'intera estensione e il proprio harness in un solo firmware sintetico; la sua dimensione su V1 non rappresenta un normale progetto che usa soltanto i blocchi necessari. La suite documentata compila quindi separatamente gruppi realistici di funzioni.

## Dati permanenti e temporanei

Pixel statici, testo, geometrie, icone e grafiche native scrivono direttamente nel buffer RGB principale. Non creano un secondo framebuffer permanente.

Lo scorrimento composto e alcuni effetti conservano copie temporanee della scena durante l'animazione. La dissolvenza conserva tre copie RGB temporanee oltre al buffer principale: scena iniziale, destinazione e fotogramma corrente, per un totale di quattro buffer RGB. Di conseguenza, un display più grande lascia meno memoria al resto del programma.

## Formati standard: costo RAM per modulo

| Modulo | LED | Buffer base | Scorrimento composto: 2 buffer | Dissolvenza: 4 buffer | Moduli con lo stesso buffer base dei 6 pannelli 16×16 provati |
| --- | ---: | ---: | ---: | ---: | ---: |
| 8×8 | 64 | 192 | 384 | 768 | 24 |
| 16×8 | 128 | 384 | 768 | 1536 | 12 |
| 8×16 | 128 | 384 | 768 | 1536 | 12 |
| 16×16 | 256 | 768 | 1536 | 3072 | 6 |
| 32×8 | 256 | 768 | 1536 | 3072 | 6 |
| 8×32 | 256 | 768 | 1536 | 3072 | 6 |

I costi sono byte di dati RGB per un modulo, non la RAM totale del programma. Le colonne composto e dissolvenza contano anche il buffer principale, per una singola animazione su una matrice. Per N moduli moltiplica il costo per N. Oggetti, intestazioni dei buffer, stringhe, code, runtime, altre estensioni e animazioni concorrenti richiedono ulteriore RAM.

micro:bit V1 ha 16 KiB di RAM totale; V2 ne ha 128 KiB. Questa non è tutta memoria disponibile per i pannelli. Le specifiche dei processori applicativi sono documentate nelle schede ufficiali [V1](https://tech.microbit.org/hardware/1-5-revision/) e [V2](https://tech.microbit.org/hardware/2-0-revision/).

Non è stato misurato un numero massimo pratico di moduli valido per V1 o V2. Il dato fisico verificato su V2 è una catena di sei moduli 16×16, cioè 96×16 e 1.536 LED. Il suo buffer base è 4.608 byte; lo scorrimento composto richiede 9.216 byte RGB e una dissolvenza 18.432 byte RGB, prima del resto del programma. Quest'ultimo dato supera già tutta la RAM di V1. La prova sul display 96×16 non è una prova fisica degli altri formati né di ogni effetto.

L'ultima colonna esprime soltanto un'equivalenza di memoria: 24 moduli 8×8 o 12 moduli 16×8/8×16 hanno gli stessi 1.536 LED dei sei 16×16. Non rappresenta il massimo della scheda.

Per un budget B già riservato ai soli dati RGB, una stima preliminare è:

```text
moduli = floor(B / (larghezza_modulo × altezza_modulo × 3 × copie))
copie = 1 per buffer base, 2 per scorrimento composto, 4 per dissolvenza
```

Il risultato è un limite di budget, non una configurazione garantita: contano anche allocazioni contigue, frammentazione e requisiti del programma completo. L'alimentazione esterna resta un requisito separato, anche quando la RAM basta.

## Tempo di aggiornamento

`show()` trasmette l'intera catena di LED configurata, inclusi i pixel neri. Il protocollo WS2812B impiega circa 30 microsecondi per ogni LED RGB, oltre al tempo di reset; un limite inferiore indicativo è quindi:

```text
tempo di trasmissione ≈ numero di LED × 30 µs
```

È una stima del protocollo, non una frequenza dei fotogrammi garantita. Rendering, pause, radio e altre attività del programma aggiungono tempo. Quando fluidità o reattività sono importanti, prova la catena di pannelli prevista.

## Scelte pratiche

- Configura soltanto i LED che appartengono fisicamente al display.
- Componi il contenuto statico nel buffer e usa `show()` una volta per fotogramma completo.
- Preferisci micro:bit V2 per display grandi, dissolvenza, riempimenti contrapposti mascherati e arcobaleni animati.
- Mantieni luminosità e frequenza adeguate all'alimentatore e al progetto.
- Se V1 segnala limiti di programma o memoria, suddividi programmi insolitamente grandi in scene più semplici.

## Limiti elettrici

Non alimentare una matrice dal pin 3 V del micro:bit. Usa un alimentatore esterno dimensionato per i pannelli, collega la massa comune e adotta cablaggio, protezioni e punti di alimentazione adeguati. La luminosità software non sostituisce una progettazione elettrica sicura. Consulta la [guida al cablaggio](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v1.0.0/docs/_locales/it/wiring.md).

Per l'hardware utilizzato, verifica sempre protocollo e caratteristiche nelle documentazioni ufficiali micro:bit, Microsoft MakeCode NeoPixel e del produttore dei LED.

```package
pxt-sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v1.0.0
```
