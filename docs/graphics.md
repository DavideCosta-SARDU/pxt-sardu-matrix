# Blocchi grafici nativi ed editor facoltativo

I blocchi Grafica permettono di disegnare direttamente dentro MakeCode nei formati **8×8, 16×16, 32×8, 8×32, 16×8 e 8×16**. Una grafica che supera i bordi della matrice viene ritagliata in sicurezza.

## Disegnare una grafica

Inserire il blocco `disegna grafica`, scegliere il blocco grafica del formato desiderato e impostare le celle direttamente nelle righe visualizzate nel blocco. Non occorrono collegamenti esterni e non bisogna copiare codice.

La tavolozza accetta al massimo 15 colori reali per immagine. Le grafiche con un solo colore usano un bit per pixel; quelle multicolore usano quattro bit per pixel.

L'editor web già pubblicato resta uno strumento facoltativo di sviluppo e prova per creare preset, ma non fa parte del normale flusso dell'utente MakeCode.

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
