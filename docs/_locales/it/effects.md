# Effetti speciali

Il gruppo **Effetti** contiene animazioni che aggiornano automaticamente la matrice fisica e non richiedono un blocco `mostra` separato.

- **Dissolvenza** sfuma il buffer RGB corrente verso il nero o un altro colore.
- **Lampeggio** alterna il contenuto corrente e il nero, conservandone colori e luminosità.
- **Riempimento** avanza dalla coordinata X o Y scelta nella direzione selezionata.
- **Riempimento contrapposto** fa incontrare due colori in una coordinata X/Y scelta e può agire sull'intera matrice oppure usare testo e geometrie correnti come maschera.
- **Arcobaleno** ricolora soltanto i pixel già presenti, rispettandone la luminosità massima.
- **Arcobaleno animato** sposta le tonalità all'interno del contenuto esistente.
- **Scintille** mostra punti casuali da soli oppure sopra il contenuto corrente.

Gli effetti animati eseguono un aggiornamento per fotogramma con pause cooperative. **Interrompi e cancella matrice** li arresta senza ripristinare un vecchio fotogramma. Lo stato finale può lasciare l'ultimo fotogramma, ripristinare il contenuto iniziale oppure cancellare la matrice.

La luminosità generata dagli effetti usa l'intervallo 0–255 e il default 128. La dissolvenza parte esattamente dal buffer corrente; lampeggio e arcobaleno non aumentano la luminosità del contenuto sorgente.

Micro:Bit V2 è consigliato per effetti e matrici grandi perché offre maggiore margine di memoria programma e RAM. I progetti realistici degli effetti compilano anche per V1, che resta adatta alle configurazioni più piccole; per dissolvenze, collisioni mascherate e arcobaleni animati su superfici grandi è preferibile V2.

I blocchi mostrano inizialmente i parametri essenziali. Il controllo `+` espone temporizzazione, stato finale e luminosità.

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.8.4
```
