# Progetto SARDU-Matrix e uso educativo

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

## Hardware compatibile

Sono supportati Micro:Bit V1 e V2 e pannelli RGB indirizzabili compatibili col protocollo WS2812B/NeoPixel. L'estensione usa come backend il pacchetto ufficiale Microsoft `pxt-neopixel` e non usa mBed.

I pannelli richiedono un'alimentazione esterna adeguata. Micro:Bit, pannelli e alimentatore devono condividere la massa; la matrice non deve essere alimentata dal pin 3 V del Micro:Bit. Consulta la [guida al cablaggio](wiring.md).

## Risorse

- [Guida utente](user-guide.md)
- [API pubblica](api.md)
- [Procedura di test](testing.md)
- [Editor grafico opzionale](https://davidecosta-sardu.github.io/pxt-sardu-matrix/editor.html)
- [Simulatore opzionale](https://davidecosta-sardu.github.io/pxt-sardu-matrix/simulator.html)

Editor e simulatore sono strumenti opzionali su GitHub Pages e non vengono integrati nell'editor pubblico MakeCode.

