# Progetto SARDU-Matrix e uso educativo

[English](../../project-and-education.md)

SARDU-Matrix è un'estensione MakeCode gratuita con licenza MIT per controllare comuni pannelli RGB WS2812B/NeoPixel tramite Micro:Bit. Non è legata a un accessorio proprietario: gli studenti possono usare pannelli compatibili di produttori diversi configurandone dimensioni e cablaggio reali.

## Finalità educativa

L'estensione permette di affrontare:

- coordinate cartesiane, dimensioni e mapping bidimensionale;
- colori RGB/HSL, luminosità e sfumature;
- testo, font, rotazione e animazione;
- geometrie, icone e composizione grafica;
- temporizzazione, memoria e differenze tra Micro:Bit V1 e V2;
- alimentazione esterna sicura e massa comune.

Si può iniziare da un pannello 8×8 o 16×16 e passare a display con più moduli. I blocchi presentano prima i default semplici e collocano mapping fisico e informazioni di memoria nelle sezioni avanzate.

## Dati dei sensori e progetti didattici

La matrice può presentare misure provenienti da sensori esterni, come temperatura, umidità o distanza, e dagli ingressi del Micro:Bit, come livello sonoro, accelerazione, inclinazione, pulsanti e intensità luminosa. Una misura può essere mostrata come testo, trasformata in una barra o figura oppure usata per controllare colore, animazione e luminosità. In un solo progetto si collegano così acquisizione dei dati, intervalli numerici, coordinate e comunicazione visiva.

### Onda del livello sonoro

Con Micro:Bit V2, il microfono integrato può controllare un'onda animata: un suono più forte produce picchi più alti, mentre il silenzio riporta la linea verso il centro verticale. MakeCode restituisce un livello sonoro relativo, non decibel calibrati; senza una calibrazione con strumenti di riferimento il progetto va quindi descritto come visualizzatore del livello sonoro.

Passaggi suggeriti:

1. creare la matrice e scegliere la sua linea centrale;
2. leggere il livello sonoro a intervalli regolari;
3. convertire la lettura in un'ampiezza compatibile con l'altezza della matrice;
4. spostare o rigenerare i punti dell'onda lungo la larghezza;
5. svuotare il buffer RGB, disegnare le nuove linee o i pixel e usare `show()` una sola volta;
6. aggiungere una media o una soglia minima per evitare che il rumore di fondo renda instabile l'immagine.

L'attività introduce campionamento, conversione di scala, coordinate, soglie e filtraggio. Micro:Bit V1 richiede un sensore audio esterno perché non dispone di microfono integrato.

Il progetto completo è disponibile in [`examples/sound-wave`](../../../examples/sound-wave/).

### Indicatore di oscurità

La lettura dell'intensità luminosa del Micro:Bit può controllare una visualizzazione progressiva: più l'ambiente diventa buio, più righe si accendono e maggiore diventa la loro luminosità. In un ambiente luminoso restano visibili meno righe con luminosità inferiore.

Passaggi suggeriti:

1. leggere l'intensità luminosa e invertirne la scala per ottenere un valore di oscurità;
2. convertire l'oscurità nel numero di righe o colonne da accendere;
3. convertire lo stesso valore in un intervallo sicuro di luminosità;
4. svuotare il buffer RGB e disegnare le linee necessarie;
5. usare `show()` una sola volta e ripetere dopo una breve pausa;
6. calcolare la media di più letture o usare soglie per evitare lampeggi vicino ai valori di passaggio.

L'intervallo di luminosità deve essere adeguato all'alimentatore esterno e al numero di LED. Il progetto permette di studiare relazioni inverse, conversione di valori, soglie, consumo energetico e controllo automatico.

Il progetto completo è disponibile in [`examples/darkness-indicator`](../../../examples/darkness-indicator/).

## Hardware compatibile

Sono supportati Micro:Bit V1 e V2 e pannelli RGB indirizzabili compatibili col protocollo WS2812B/NeoPixel. L'estensione usa come backend il pacchetto ufficiale Microsoft `pxt-neopixel` e non usa mBed.

I pannelli richiedono un'alimentazione esterna adeguata. Micro:Bit, pannelli e alimentatore devono condividere la massa; la matrice non deve essere alimentata dal pin 3 V del Micro:Bit. Consulta la [guida al cablaggio](wiring.md).

## Risorse

- [Guida utente](user-guide.md)
- [API pubblica](api.md)
- [Procedura di test](testing.md)
