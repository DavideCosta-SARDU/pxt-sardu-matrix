# Collegamento delle matrici

## 1. Scopo

Questa guida spiega come far corrispondere il collegamento fisico alla configurazione SARDU-Matrix. Non dimensiona un impianto specifico: alimentatore, cavi, distribuzione, protezioni e conformità restano responsabilità dell'utente e dell'installazione.

I concetti da non confondere sono:

1. direzione dei pixel dentro ogni modulo;
2. ordine dei moduli nella griglia;
3. alimentazione elettrica dei pannelli;
4. segnale dati del micro:bit.

## 2. Nomi dei collegamenti

Sui pannelli WS2812/NeoPixel verificare sempre serigrafia e documentazione del produttore.

- `DIN`, `DI` o freccia entrante: ingresso dati;
- `DOUT`, `DO` o freccia uscente: uscita dati verso il pannello successivo;
- `+V`: positivo dell'alimentazione prevista dal pannello;
- `GND`, `0V` o `-`: negativo/massa.

Non dedurre DIN/DOUT soltanto dalla posizione del connettore: pannelli esteriormente simili possono avere disposizione differente.

## 3. Collegamento dati fondamentale

Il micro:bit invia i dati soltanto al primo modulo:

```text
micro:bit P0 ─────► DIN [Modulo 0]
                         DOUT ─────► DIN [Modulo 1]
                                           DOUT ─────► DIN [Modulo 2]
                                                             ...
```

Il pin è configurabile; P0 è soltanto il default proposto.

Regola:

```text
DOUT del modulo N ─────► DIN del modulo N+1
```

La numerazione mostrata nei diagrammi di questa guida indica l'ordine del flusso dati, non un indirizzo impostato sul pannello.

## 4. Alimentazione e massa comune

Schema concettuale:

```text
                         ┌────────────► +V pannelli
Alimentatore esterno +V ─┤
                         └────────────► altri punti di iniezione, se previsti

Alimentatore esterno GND ─────┬──────► GND pannelli
                              └──────► GND micro:bit

micro:bit pin dati ──────────────────► DIN primo pannello
```

Requisiti inderogabili:

- non alimentare la matrice dal pin 3V del micro:bit;
- usare un alimentatore esterno con tensione adatta al pannello reale;
- collegare insieme negativo dell'alimentatore, GND dei pannelli e GND del micro:bit;
- non collegare il positivo dell'alimentatore esterno al pin 3V del micro:bit;
- dimensionare cavi, connettori, distribuzione, iniezioni e protezioni per la corrente prevista;
- seguire le istruzioni del produttore per livello logico e condizionamento del segnale dati.

Senza massa comune il livello del segnale dati non ha un riferimento condiviso e il comportamento può essere erratico o assente.

La luminosità software e il contenuto normalmente visualizzato non sostituiscono il dimensionamento elettrico. Il calcolo prudente usa la corrente massima dichiarata dal produttore del LED/pannello:

```text
corrente teorica massima = numero LED × corrente massima per LED
```

## 5. Livello 1: percorso interno dei pixel

Gli esempi usano un modulo teorico 4×4 per rendere leggibili gli indici. Lo stesso principio vale per 8×8, 16×16 e gli altri formati.

### 5.1 Colonne progressive, origine alto-sinistra

```text
 0   4   8  12
 1   5   9  13
 2   6  10  14
 3   7  11  15
```

Ogni colonna procede dall'alto al basso; fra colonne il collegamento torna in alto.

### 5.2 Colonne a serpentina, origine alto-sinistra

```text
 0   7   8  15
 1   6   9  14
 2   5  10  13
 3   4  11  12
```

È il column-zigzag compatibile col default storico.

### 5.3 Righe progressive, origine alto-sinistra

```text
 0   1   2   3
 4   5   6   7
 8   9  10  11
12  13  14  15
```

### 5.4 Righe a serpentina, origine alto-sinistra

```text
 0   1   2   3
 7   6   5   4
 8   9  10  11
15  14  13  12
```

## 6. Origine del modulo

L'origine indica dove si trova il pixel fisico con indice locale 0:

```text
alto-sinistra       alto-destra
┌──────────┐        ┌──────────┐
│0         │        │         0│
│          │        │          │
└──────────┘        └──────────┘

basso-sinistra      basso-destra
┌──────────┐        ┌──────────┐
│          │        │          │
│0         │        │         0│
└──────────┘        └──────────┘
```

Cambiare origine riflette il mapping fisico, ma non cambia le coordinate logiche dell'utente: `(0,0)` resta sempre l'angolo logico alto-sinistra del display.

## 7. Livello 2: ordine dei moduli

Gli esempi mostrano sei moduli in una griglia da tre colonne e due righe. I numeri sono l'ordine fisico della catena dati.

### 7.1 Progressivo per righe

```text
[0] ─► [1] ─► [2]
                │ collegamento verso l'inizio della riga successiva
[3] ─► [4] ─► [5]
```

Ordine: `0, 1, 2, 3, 4, 5`.

### 7.2 Serpentina per righe

```text
[0] ─► [1] ─► [2]
                │
[5] ◄─ [4] ◄─ [3]
```

Il cavo esce dal modulo 2, entra nel modulo 3 sotto di esso e percorre la seconda riga in direzione opposta.

### 7.3 Progressivo per colonne

```text
[0]    [2]    [4]
 │      │      │
 ▼      ▼      ▼
[1]    [3]    [5]
```

Ordine: prima colonna dall'alto al basso, poi la seconda, poi la terza.

### 7.4 Serpentina per colonne

```text
[0]    [3]    [4]
 │      ▲      │
 ▼      │      ▼
[1] ─► [2]    [5]
```

Le colonne alternate percorrono direzioni verticali opposte.

## 8. Origine della griglia

L'origine dei moduli indica dove si trova il Modulo 0:

- alto-sinistra;
- alto-destra;
- basso-sinistra;
- basso-destra.

Asse e percorso vengono applicati a partire da quell'angolo. Per evitare errori, prima si sceglie fisicamente il pannello collegato al micro:bit, poi si imposta quell'angolo come origine della griglia.

## 9. Orientamento dei pannelli

Nella prima versione tutti i moduli della griglia devono avere lo stesso orientamento logico:

- stessa posizione del primo pixel locale;
- stesso asse interno;
- stesso percorso interno.

La serpentina fra moduli cambia l'ordine in cui vengono visitate le posizioni della griglia; non implica automaticamente la rotazione fisica dei pannelli della seconda riga.

Rotazioni o inversioni differenti per singolo modulo non sono incluse nella prima versione. Se l'impianto usa pannelli ruotati individualmente, deve essere ricablato/orientato in modo uniforme oppure richiederà una futura mappa per-modulo.

## 10. Esempio 1×1

Configurazione:

```text
NumeroMatrici = 1
TipoMatrice   = 16×16
NumeroRighe   = 1
```

Dimensioni:

```text
16×16 = 256 LED
buffer RGB = 768 byte
```

Il percorso della griglia non produce differenze con un solo modulo; resta determinante il percorso interno.

## 11. Esempio 2×1

```text
NumeroMatrici = 2
TipoMatrice   = 16×16
NumeroRighe   = 1
```

```text
[0] ─► [1]
```

Dimensioni 32×16, 512 LED, 1536 byte RGB.

## 12. Esempio 6×1 / 96×16

```text
NumeroMatrici = 6
TipoMatrice   = 16×16
NumeroRighe   = 1
```

```text
[0] ─► [1] ─► [2] ─► [3] ─► [4] ─► [5]
```

Dimensioni 96×16, 1536 LED, 4608 byte RGB.

Con moduli column-serpentine di larghezza pari, origine alto-sinistra e ordine sinistra→destra, questo mapping coincide con la configurazione diretta 96×16 column-serpentine.

## 13. Esempio 6×2 / 96×32

```text
NumeroMatrici = 12
TipoMatrice   = 16×16
NumeroRighe   = 2
NumeroColonne = 6 (calcolato)
```

Serpentina per righe:

```text
[0] ─► [1] ─► [2] ─► [3] ─► [4] ─► [5]
                                         │
[11] ◄─ [10] ◄─ [9] ◄─ [8] ◄─ [7] ◄─ [6]
```

Dimensioni 96×32, 3072 LED, 9216 byte RGB.

Il tempo minimo teorico del solo trasferimento WS2812B è circa 92,44 ms, prima del rendering.

## 14. Come scegliere le opzioni

1. Individuare il DIN del primo pannello collegato al micro:bit.
2. Stabilire in quale angolo della griglia si trova: origine moduli.
3. Seguire ogni DOUT→DIN e numerare i pannelli 0, 1, 2…
4. Confrontare la numerazione con progressivo/serpentina per righe/colonne.
5. Su un singolo pannello, individuare il pixel locale 0.
6. Seguire alcuni LED per capire asse e alternanza del percorso interno.
7. Inserire le stesse scelte nella configurazione avanzata.
8. Eseguire il test visivo prima di usare testo o scrolling.

## 15. Sequenza di verifica visiva

Il progetto di test hardware dovrà eseguire, con luminosità prudente:

1. clear e show;
2. accensione del pixel logico `(0,0)`;
3. accensione dei quattro angoli logici con colori distinti;
4. scansione della prima riga;
5. scansione della prima colonna;
6. colorazione di un modulo logico alla volta;
7. accensione dei pixel sui due lati di ogni confine fra moduli;
8. accensione dell'ultimo pixel logico;
9. breve testo statico;
10. scrolling lento.

Interpretazione tipica:

- angoli scambiati: origine errata;
- righe al posto delle colonne: asse errato;
- tratte alternate invertite: progressivo/serpentina errato;
- pannelli accesi nell'ordine sbagliato: percorso moduli errato;
- un solo pannello specchiato o ruotato: orientamento fisico non uniforme;
- colori errati ma posizioni corrette: modalità/ordine colore o hardware da verificare.

## 16. Checklist prima dell'accensione

- tensione dell'alimentatore compatibile col pannello;
- corrente, cavi, connettori e protezioni dimensionati dall'utente;
- polarità verificata;
- positivo esterno non collegato al 3V del micro:bit;
- negativo alimentatore collegato a GND pannelli e GND micro:bit;
- pin dati collegato al DIN del primo modulo;
- ogni DOUT collegato al DIN successivo;
- configurazione software coerente con origine e percorso;
- luminosità iniziale prudente;
- nessun collegamento modificato sotto tensione salvo procedura espressamente prevista dall'hardware.

## 17. Limiti della prima versione

Supportati nel modello:

- griglie rettangolari complete;
- sei formati modulo approvati;
- quattro origini;
- scansione per righe o colonne;
- progressivo o serpentina;
- percorso pixel e percorso moduli indipendenti;
- stesso orientamento per tutti i moduli.

Non supportati inizialmente:

- griglie con posizioni vuote;
- pannelli di dimensioni diverse nella stessa griglia;
- rotazione diversa per ogni pannello;
- più catene dati parallele;
- alimentazione o controllo elettrico gestiti dall'estensione.
