# Il tuo primo messaggio SARDU-Matrix

## Introduzione @unplugged

Crea una matrice RGB 16×16, mostra un messaggio statico e poi fai scorrere un secondo messaggio da destra a sinistra.

Collega l'ingresso dati della matrice a P1. Alimenta i LED con un alimentatore esterno adeguato e collega la sua massa sia alla matrice sia alla massa del Micro:Bit.

## Crea la matrice

Da **SARDU Matrix → Creazione**, aggiungi **crea matrice**. Mantieni larghezza e altezza a 16, pin P1 e luminosità 128.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
```

## Disegna il testo statico

Da **SARDU Matrix → Testo statico**, aggiungi il blocco del testo centrato in larghezza. Scrivi `OK`, mantieni Y a 0 e scegli bianco.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawTextCenteredWidth("OK", 0, neopixel.colors(NeoPixelColors.White), MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
```

Il disegno è ora nel buffer RGB, ma non è ancora stato inviato ai LED.

## Mostra il messaggio

Da **SARDU Matrix → Display**, aggiungi **mostra matrice**.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawTextCenteredWidth("OK", 0, neopixel.colors(NeoPixelColors.White), MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.show()
```

## Aggiungi il testo scorrevole

Aggiungi una pausa di un secondo, quindi scegli **scorri testo dal bordo** da **SARDU Matrix → Testo scorrevole**. Inserisci `CIAO`, ingresso da destra, bianco, 100 ms e modalità Esclusiva.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawTextCenteredWidth("OK", 0, neopixel.colors(NeoPixelColors.White), MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.show()
basic.pause(1000)
matrix.scrollTextFromEdge("CIAO", MatrixScrollEdge.Right, neopixel.colors(NeoPixelColors.White), 100, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
```

## Scarica

Collega il Micro:Bit, seleziona **Scarica** e trasferisci il programma. Il messaggio statico appare per primo; dopo un secondo, `CIAO` entra da destra ed esce a sinistra.

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.8.4
```
