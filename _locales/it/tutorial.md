# Il tuo primo messaggio SARDU-Matrix

[English](../../tutorial.md)

## Introduzione @unplugged

Crea una matrice RGB 16×16, mostra un messaggio statico e poi fai scorrere un secondo messaggio da destra a sinistra.

Collega l'ingresso dati della matrice a P1. Alimenta i LED con un alimentatore esterno adeguato e collega la sua massa sia alla matrice sia alla massa del micro:bit.

## Crea la matrice

Da **SARDU Matrix → Creazione**, aggiungi **crea matrice**. Mantieni larghezza e altezza a 16, pin P1 e luminosità 128.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
```

## Disegna il testo statico

Da **SARDU Matrix → Testo**, nel gruppo **Testo statico**, aggiungi il blocco del testo centrato in larghezza. Scrivi `OK`, mantieni Y a 0 e scegli bianco.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawTextCenteredWidth("OK", 0, neopixel.colors(NeoPixelColors.White), SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
```

Il disegno è ora nel buffer RGB, ma non è ancora stato inviato ai LED.

## Mostra il messaggio

Da **SARDU Matrix → Display**, aggiungi **mostra matrice**.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawTextCenteredWidth("OK", 0, neopixel.colors(NeoPixelColors.White), SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
matrix.show()
```

## Aggiungi il testo scorrevole

Aggiungi una pausa di un secondo, quindi scegli **scorri testo dal bordo** da **SARDU Matrix → Testo**, nel gruppo **Testo scorrevole**. Inserisci `CIAO`, ingresso da destra, bianco, 100 ms e modalità **cancella display**. Usa (+) per vedere le opzioni predefinite di colore e temporizzazione.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawTextCenteredWidth("OK", 0, neopixel.colors(NeoPixelColors.White), SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal)
matrix.show()
basic.pause(1000)
matrix.scrollTextFromEdge("CIAO", SarduMatrixScrollEdge.Right, neopixel.colors(NeoPixelColors.White), 100, SarduMatrixFont.Sardu, SarduMatrixFontSize.X1, 128, SarduMatrixTextOrientation.Normal, SarduMatrixScrollMode.Exclusive)
```

## Scarica

Collega il micro:bit, seleziona **Scarica** e trasferisci il programma. Il messaggio statico appare per primo; dopo un secondo, `CIAO` entra da destra ed esce a sinistra.
