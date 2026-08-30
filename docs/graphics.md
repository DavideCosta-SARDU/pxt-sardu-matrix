# Editor grafico e blocchi Grafica

L'editor grafico SARDU Matrix crea immagini RGB compatte riutilizzabili nei blocchi MakeCode. Gestisce tutti i formati fisici supportati: **8×8, 16×16, 32×8, 8×32, 16×8 e 8×16**. Una grafica che supera i bordi della matrice viene ritagliata in sicurezza.

## Disegnare una grafica

Aprire l'[editor grafico SARDU Matrix](https://davidecosta-sardu.github.io/pxt-sardu-matrix/editor.html), creare una o più grafiche, assegnare il nome e scegliere il formato. **Salva grafica** conserva il lavoro nel browser; **Copia codice** genera le definizioni da aggiungere al progetto MakeCode.

La tavolozza accetta al massimo 15 colori reali per immagine. Le grafiche con un solo colore usano un bit per pixel; quelle multicolore usano quattro bit per pixel.

## Trasparente e nero

- **TRASP.** indica che il pixel non ha un colore. In modalità `sovrapponi` lascia invariato ciò che era già presente.
- **NERO** è un colore reale `#000000` e spegne esplicitamente il LED.

Questa distinzione permette di comporre più lavori senza spegnere involontariamente i pixel non usati dal secondo disegno.

## Disegnare sulla matrice

Il blocco `disegna grafica ... a x ... y ... modalità ...` si trova nel gruppo **Grafica**. Scrive nel buffer senza inviare subito i LED, quindi `mostra` va chiamato dopo aver composto il fotogramma.

```blocks
matrix.drawGraphic(sarduMatrix.logo, 0, 0, MatrixGraphicMode.Overlay)
matrix.show()
```

- **sovrapponi**: i pixel trasparenti preservano lo sfondo; i colori reali, incluso il nero, vengono scritti.
- **sostituisci area**: i pixel trasparenti rendono nera la posizione corrispondente, sostituendo quindi tutta l'area della grafica.

Le coordinate sono logiche e indipendenti dal cablaggio lineare, progressivo o ZigZag.

## Memoria

I dati della grafica risiedono nel programma e non creano un secondo framebuffer RGB. Il framebuffer della matrice resta `larghezza × altezza × 3` byte. Su Micro:Bit V1 è prudente limitare il numero di immagini grandi in un progetto già ricco di funzioni.
