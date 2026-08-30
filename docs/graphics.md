# Editor grafico e blocchi Graphics

L'editor grafico SARDU Matrix crea piccole immagini RGB riutilizzabili nei blocchi MakeCode. I formati disponibili sono gli stessi dei moduli fisici: **8×8, 16×16, 32×8, 8×32, 16×8 e 8×16**. Il formato dell'immagine e quello della matrice non devono coincidere: un'immagine viene semplicemente ritagliata in modo sicuro se esce dai bordi della matrice.

## Disegnare una grafica

Aprire l'editor dalla voce dell'estensione in MakeCode; finché l'integrazione non è approvata dal team MakeCode, usare la pagina pubblicata dal progetto GitHub Pages. Si possono creare più grafiche nello stesso progetto, assegnare loro un nome e scegliere il formato. Il pulsante **Salva grafica** conserva i dati nel progetto MakeCode; la pagina autonoma conserva inoltre una copia nel browser e permette di copiare il codice generato.

L'editor usa una tavolozza di al massimo 15 colori reali per immagine. Questa scelta rende i dati piccoli anche per una grafica 32×8.

## Trasparente e nero non sono la stessa cosa

La tavolozza mostra due strumenti distinti:

- **TRASP.**: il pixel non ha un colore. Con modalità `sovrapponi` lascia esattamente invariato il LED che era già presente.
- **NERO**: è un colore reale `#000000` e quindi spegne il LED.

Questo evita che una seconda grafica spenga involontariamente i pixel della prima solo perché non li utilizza.

## Disegnare sulla matrice

Il blocco **draw graphic … at x … y … mode …** appartiene al gruppo **Graphics**. Scrive nel buffer, come `set pixel` e `draw text`, quindi si chiama `show` una sola volta dopo avere composto tutto il fotogramma.

```blocks
matrix.drawGraphic(sarduMatrixGraphics.logo, 0, 0, MatrixGraphicMode.Overlay)
matrix.show()
```

Le modalità sono:

- **overlay / sovrapponi**: i pixel trasparenti non toccano lo sfondo; quelli colorati, incluso il nero, lo sostituiscono.
- **replace area / sostituisci area**: prima rende nera l'area occupata dalla grafica, poi disegna i pixel colorati. I pixel trasparenti diventano quindi neri. È utile quando si vuole sostituire una zona intera senza cancellare il resto della matrice.

Le coordinate sono logiche e la grafica è ritagliata ai quattro lati; coordinate non intere vengono arrotondate verso il basso. Il blocco non invia automaticamente i LED.

## Formato compatto

Ogni grafica generata contiene larghezza, altezza, tavolozza e pixel. Le immagini con un solo colore usano una maschera da un bit per pixel; quelle multicolore usano quattro bit per pixel. Il formato è interno all'estensione: non va modificato a mano. Il codice generato può essere copiato nel progetto soltanto se l'editor non è ancora disponibile direttamente in MakeCode.

## Memoria

La grafica è memorizzata nel programma e non crea un secondo framebuffer RGB. Il framebuffer della matrice resta `larghezza × altezza × 3` byte. Su Micro:Bit V1 resta prudente mantenere piccoli sia il programma sia il numero di immagini grandi; V2 lascia più margine per progetti con molte funzioni contemporaneamente.
