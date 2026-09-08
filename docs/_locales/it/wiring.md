# Cablaggio della matrice

[English](../../wiring.md)

## Prima la sicurezza

Non alimentare una matrice dal pin 3 V del Micro:Bit. Usa un alimentatore esterno adeguato alla corrente dei pannelli. Collega insieme la massa dell'alimentatore, quella della matrice e GND del Micro:Bit, adottando cablaggio, protezioni e punti di alimentazione adeguati.

## Collegamento dati

Collega il pin dati Micro:Bit selezionato al `DIN` del primo pannello. P1 è il valore predefinito, ma i blocchi di creazione permettono di scegliere un altro pin digitale utilizzabile. Collega il `DOUT` di ogni pannello al `DIN` del successivo; non invertire `DIN` e `DOUT`.

## Percorso dei pixel nel modulo

Configura tre proprietà indipendenti in modo che corrispondano al pannello:

- l'angolo che contiene il primo LED;
- righe o colonne come asse di scansione principale;
- ordine progressivo oppure alternato ZigZag.

## Percorso tra i moduli

Per una griglia di pannelli, configura l'angolo del primo modulo, l'asse di scansione dei moduli e l'ordine progressivo/ZigZag separatamente dal percorso dei pixel interno a ogni pannello. La catena fisica `DOUT` → `DIN` deve seguire lo stesso ordine dei moduli scelto nel software.

Esempi comuni sono un pannello 16×16, due pannelli su una riga per 32×16, sei pannelli su una riga per 96×16 oppure dodici pannelli su due righe per 96×32.

## Verifica visiva

Prima di provare testo o effetti:

1. accendi il pixel logico `(0, 0)` e individualo fisicamente;
2. accendi l'angolo opposto;
3. prova il primo e l'ultimo pixel di ogni modulo;
4. disegna una linea orizzontale e una verticale;
5. correggi origine, asse e percorso finché tutte le coordinate corrispondono;
6. prova quindi testo, scorrimento ed effetti.

Se un pannello collegato ma non utilizzato si accende in modo inatteso, controlla le dimensioni configurate, la catena fisica e lo stato dell'alimentazione. L'estensione trasmette dati soltanto per il numero di LED configurato.

Consulta [Configurazione del display](display-configuration.md) per i metodi di creazione e [Memoria, rendering e limiti fisici](memory-and-rendering.md) per le catene grandi.
