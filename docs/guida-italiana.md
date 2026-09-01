# Guida italiana a SARDU-Matrix

Questa guida descrive l'uso dell'estensione SARDU-Matrix in Microsoft MakeCode per Micro:Bit.

## Installazione

1. Apri [MakeCode per Micro:Bit](https://makecode.microbit.org/).
2. Crea un progetto e scegli **Estensioni**.
3. Incolla l'indirizzo completo del repository:

```text
https://github.com/DavideCosta-SARDU/pxt-sardu-matrix
```

4. Seleziona **SARDU-Matrix**.

Finché Microsoft non avrà approvato l'estensione, è normale dover usare l'indirizzo completo. Per provare una revisione candidata usa invece l'indirizzo esatto comunicato per quella prova.

## Collegamento e alimentazione

Collega il pin dati scelto al `DIN` del primo pannello e collega ogni `DOUT` al `DIN` del pannello successivo. Tutti i pannelli, l'alimentatore esterno e la Micro:Bit devono avere la massa in comune.

Non alimentare la matrice dal pin 3 V della Micro:Bit. Dimensiona alimentatore, cavi, protezioni e punti di iniezione in base al numero reale di LED. La luminosità software riduce la luce emessa, ma non sostituisce un impianto elettrico corretto.

## Creazione della matrice

Nel gruppo **Creazione** puoi scegliere uno dei due metodi:

- **dimensioni totali**, indicando larghezza e altezza dell'intero display;
- **moduli**, indicando quantità e formato dei pannelli uguali.

La luminosità iniziale predefinita è `128`. Le coordinate logiche partono da `X=0, Y=0` nell'angolo superiore sinistro, indipendentemente dal cablaggio fisico. Le varianti avanzate permettono di configurare origine, scansione per righe o colonne e percorso progressivo o ZigZag, sia dentro i moduli sia tra i moduli.

## Ordine e funzione dei gruppi

La categoria usa questo ordine:

1. **Creazione**: costruzione e configurazione della matrice.
2. **Display**: mostra, avvia scorrimento, cancella e interrompi.
3. **Testo statico**: testo alle coordinate indicate o centrato.
4. **Testo scorrevole**: scorrimento immediato oppure aggiunta a una composizione.
5. **Geometria statica**: linee, rettangoli e cerchi, vuoti o pieni.
6. **Geometria scorrevole**: figure da aggiungere alla composizione.
7. **Effetti**: dissolvenza, lampeggio, riempimenti, arcobaleno e scintille.
8. **Pixel**: modifica di un singolo punto.
9. **Colori**: selezione RGB o HSL.

I blocchi **Grafica** molto alti sono collocati per ultimi in `... altro`.

## Buffer e blocco Mostra

Pixel, testo statico, geometria statica e grafica modificano il buffer in memoria. Componi tutti gli elementi necessari e usa **mostra** una sola volta per inviarli ai LED.

**Svuota buffer** prepara il nero in memoria e richiede poi **mostra**. **Cancella** spegne subito il display. **Interrompi e cancella matrice** ferma appena possibile uno scorrimento o un effetto in corso e spegne il display.

## Testo statico

Puoi scegliere coordinate, colore, font, dimensione, luminosità e orientamento. Sono disponibili le centrature sull'intera larghezza, sull'intera altezza, su entrambi gli assi oppure dentro un intervallo avanzato. Il testo viene disegnato nel buffer e non chiama automaticamente **mostra**.

La luminosità del testo ha default `128` e non modifica la luminosità generale scelta durante la creazione. Le coordinate esterne vengono ritagliate in sicurezza.

## Testo scorrevole

I blocchi **scorri testo** eseguono subito lo scorrimento. Il testo può partire da coordinate manuali oppure entrare da destra, sinistra, alto o basso.

- **Esclusivo** usa uno sfondo nero e termina col display nero.
- **Composto** conserva la scena già presente e la ripristina dietro il testo.

Per unire testo e figure in un solo scorrimento non usare i blocchi di scorrimento immediato. Usa **aggiungi testo allo scorrimento**, aggiungi una o più geometrie e infine chiama una sola volta **avvia scorrimento**. Per esempio, testo `CIAO` più cerchio diventano una sola sequenza. Chiamando **avvia scorrimento** tra i due inserimenti si ottengono invece due sequenze separate.

## Geometrie

La geometria statica comprende linea, rettangolo, rettangolo pieno, cerchio e cerchio pieno. Scrive nel buffer e richiede **mostra**.

La geometria scorrevole comprende gli stessi elementi adatti a una sequenza. I blocchi hanno il verbo **aggiungi** perché preparano la composizione: funzionano anche da soli, purché dopo l'ultimo elemento venga chiamato **avvia scorrimento**.

## Effetti speciali

Gli effetti lavorano sul contenuto corrente e aggiornano automaticamente i LED; non serve aggiungere **mostra** durante l'effetto.

- **Dissolvenza** trasforma gradualmente il contenuto verso il colore scelto.
- **Lampeggio** alterna il contenuto corrente e il nero, conservando colori e luminosità originali.
- **Riempimento** parte dalla coordinata X o Y scelta e procede nella direzione selezionata.
- **Collisione** fa avanzare due colori da lati opposti verso una coordinata di incontro; può agire su tutto il display oppure soltanto sul contenuto esistente.
- **Arcobaleno** colora soltanto i pixel già accesi; un fotogramma produce un'immagine statica, più fotogrammi producono l'animazione.
- **Scintille** genera punti casuali da soli oppure sopra il contenuto.

Lo stato finale può lasciare l'ultimo fotogramma, ripristinare il contenuto precedente oppure cancellare la matrice. I colori generati dagli effetti hanno luminosità predefinita `128`. La dissolvenza parte dai valori realmente presenti nel buffer; lampeggio e arcobaleno non aumentano la luminosità del contenuto sorgente.

Per gli effetti è consigliata Micro:Bit V2, soprattutto con matrici grandi, dissolvenze, maschere sul contenuto e arcobaleni animati. V1 può funzionare con progetti piccoli, ma dispone di margini di memoria e firmware molto inferiori.

## Grafica, pixel e colori

I blocchi **Grafica** permettono di disegnare griglie 8×8, 16×16, 32×8, 8×32, 16×8 e 8×16. La cella trasparente conserva lo sfondo in modalità sovrapposizione; il nero è un colore reale e spegne il LED. Anche la grafica richiede **mostra**.

**Imposta pixel** modifica una coordinata. I colori possono provenire dal selettore NeoPixel oppure dai blocchi RGB e HSL. La luminosità HSL appartiene al colore e non coincide con la luminosità generale o del testo.

## Memoria e problemi comuni

Il buffer RGB principale usa `larghezza × altezza × 3` byte. Gli scorrimenti composti e alcuni effetti richiedono copie temporanee. Se un progetto grande non compila o non parte, prova Micro:Bit V2, riduci la matrice o usa lo scorrimento esclusivo.

Se MakeCode mostra **Richiesta di rete non riuscita**, verifica di avere incollato un URL pubblico esatto e, per una prova candidata, anche il riferimento finale dopo `#`. Dopo l'aggiornamento di una versione può essere necessario rimuovere l'estensione dal progetto, ricaricare MakeCode e importarla di nuovo.

Se un pixel di un pannello non configurato si accende all'alimentazione, prima verifica alimentazione, massa, ingresso dati e stato elettrico del pannello: il software aggiorna soltanto il numero di LED configurato e non può azzerare LED esclusi dalla configurazione.

Per mapping, memoria e collegamenti dettagliati consulta la [documentazione completa](../README.md#documentation).
