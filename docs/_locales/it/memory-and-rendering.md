# Memoria, rendering e limiti fisici

[English](../../memory-and-rendering.md)

## Memoria utilizzata

SARDU-Matrix conserva l'immagine corrente in un buffer RGB la cui dimensione cresce con il numero di LED configurati:

```text
byte RGB = larghezza × altezza × 3
```

Per esempio, 16×16 richiede 768 byte RGB, 32×16 ne richiede 1.536 e 96×16 ne richiede 4.608. Questi valori descrivono soltanto i dati RGB; anche il programma, il runtime MakeCode e i dati temporanei delle animazioni usano memoria.

L'estensione non impone una dimensione massima fissa. Il limite pratico dipende dalla revisione Micro:Bit, dal programma completo dell'utente e dalle operazioni scelte.

## Micro:Bit V1 e V2

Micro:Bit V1 può eseguire normali progetti con matrici più piccole e famiglie di funzioni selezionate. Micro:Bit V2 offre molta più RAM e spazio programma ed è consigliata per matrici grandi, composizioni complesse ed effetti.

Un errore di dimensione del programma riguarda firmware/flash, mentre un errore di allocazione durante l'esecuzione riguarda la RAM. Il runner monolitico `pxt test` collega l'intera estensione e il proprio harness in un solo firmware sintetico; la sua dimensione su V1 non rappresenta un normale progetto che usa soltanto i blocchi necessari. La suite documentata compila quindi separatamente gruppi realistici di funzioni.

## Dati permanenti e temporanei

Pixel statici, testo, geometrie, icone e grafiche native scrivono direttamente nel buffer RGB principale. Non creano un secondo framebuffer permanente.

Lo scorrimento composto e alcuni effetti conservano copie temporanee della scena durante l'animazione. La dissolvenza richiede due copie RGB temporanee. Di conseguenza, un display più grande lascia meno memoria al resto del programma.

## Tempo di aggiornamento

`show()` trasmette l'intera catena di LED configurata, inclusi i pixel neri. Il protocollo WS2812B impiega circa 30 microsecondi per ogni LED RGB, oltre al tempo di reset; un limite inferiore indicativo è quindi:

```text
tempo di trasmissione ≈ numero di LED × 30 µs
```

È una stima del protocollo, non una frequenza dei fotogrammi garantita. Rendering, pause, radio e altre attività del programma aggiungono tempo. Quando fluidità o reattività sono importanti, prova la catena di pannelli prevista.

## Scelte pratiche

- Configura soltanto i LED che appartengono fisicamente al display.
- Componi il contenuto statico nel buffer e usa `show()` una volta per fotogramma completo.
- Preferisci Micro:Bit V2 per display grandi, dissolvenza, riempimenti contrapposti mascherati e arcobaleni animati.
- Mantieni luminosità e frequenza adeguate all'alimentatore e al progetto.
- Se V1 segnala limiti di programma o memoria, suddividi programmi insolitamente grandi in scene più semplici.

## Limiti elettrici

Non alimentare una matrice dal pin 3 V del Micro:Bit. Usa un alimentatore esterno dimensionato per i pannelli, collega la massa comune e adotta cablaggio, protezioni e punti di alimentazione adeguati. La luminosità software non sostituisce una progettazione elettrica sicura. Consulta la [guida al cablaggio](wiring.md).

Per l'hardware utilizzato, verifica sempre protocollo e caratteristiche nelle documentazioni ufficiali Micro:Bit, Microsoft MakeCode NeoPixel e del produttore dei LED.
