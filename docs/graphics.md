# Blocchi grafici nativi ed editor facoltativo

I blocchi Grafica permettono di disegnare direttamente dentro MakeCode nei formati **8×8, 16×16, 32×8, 8×32, 16×8 e 8×16**. Una grafica che supera i bordi della matrice viene ritagliata in sicurezza.

## Disegnare una grafica

Aprire `...altro`, inserire il blocco `disegna ...` del formato desiderato e impostare le celle direttamente nelle righe visualizzate. Non occorrono collegamenti esterni e non bisogna copiare codice.

Il simbolo `◌` è la cella trasparente predefinita. `⚫` è invece nero reale e spegne il LED. Le altre scelte rappresentano colori reali.

L'editor web già pubblicato resta uno strumento facoltativo di sviluppo e prova, ma non fa parte del normale flusso dell'utente MakeCode.

## Trasparente e nero

- **TRASP.** indica che il pixel non ha un colore. In modalità `sovrapponi` lascia invariato ciò che era già presente.
- **NERO** è un colore reale `#000000` e spegne esplicitamente il LED.

Questa distinzione permette di comporre più lavori senza spegnere involontariamente i pixel non usati dal secondo disegno.

## Disegnare sulla matrice

I sei blocchi grafici scrivono direttamente nel buffer senza inviare subito i LED, quindi `mostra` va chiamato dopo aver composto il fotogramma.

- **sovrapponi**: i pixel trasparenti preservano lo sfondo; i colori reali, incluso il nero, vengono scritti.
- **sostituisci area**: i pixel trasparenti rendono nera la posizione corrispondente, sostituendo quindi tutta l'area della grafica.

Le coordinate sono logiche e indipendenti dal cablaggio lineare, progressivo o ZigZag.

## Memoria

Le righe del blocco sono valori temporanei e non creano un secondo framebuffer RGB permanente. Il framebuffer della matrice resta `larghezza × altezza × 3` byte.
