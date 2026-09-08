# Procedura di verifica e test

[English](../../testing.md)

Una release supera la verifica soltanto quando tutti i controlli applicabili terminano senza errori di compilazione, panic, pixel inattesi o differenze visive.

## Struttura

Il `test.ts` principale è volutamente leggero. Il runner monolitico `pxt test` collega l'intero pacchetto e il proprio harness in un unico firmware V1 sintetico e non rappresentativo dei normali programmi. La copertura eseguibile è quindi divisa in progetti indipendenti nella cartella [`tests/`](../../../tests/README.md).

Questi progetti coprono configurazione, mapping, colori, tutti i font e orientamenti, testo e geometrie, Graphics, scorrimento immediato e composto, percorsi simultanei, sfumature ed effetti. Ogni famiglia reale viene compilata separatamente per V1 e V2. Gli errori deterministici usano `control.panic(921)`.

## Compilazione

Per ogni progetto elencato in `tests/README.md` vengono eseguiti:

```shell
pxt install
pxt build
pxt build --hwvariant v2
```

Dalla radice dell'estensione vengono inoltre eseguiti `pxt checkpkgcfg`, `pxt build` e `git diff --check`. Il superamento richiede assenza di errori senza modificare il runtime per adattarlo ai test.

## Editor MakeCode

Importare l'esatta candidata in un progetto nuovo e verificare:

1. ordine delle categorie, etichette, default e parametri espandibili;
2. conversioni Blocchi, JavaScript e Python senza errori;
3. codice JavaScript/Python diretto convertito in Blocchi mantenendo il nome reale dell'istanza Matrix;
4. parametri colore ancora rappresentati dal selettore celeste sostituibile;
5. tutorial inglese e italiano caricati integralmente.

## Hardware reale

Con matrice alimentata esternamente e massa comune verificare almeno un pannello singolo e una catena multipannello: primo/ultimo pixel e confini dei moduli, configurazione, font, orientamenti, scorrimenti, percorsi simultanei, geometrie, icone, sfumature, effetti, interruzione e cancellazione.

Registrare commit o tag esatto, revisione Micro:Bit, pannelli, pin dati e alimentazione. Un errore, panic, pixel inspiegabile, gruppo mancante, conversione errata o stato finale inatteso blocca la promozione.

La release `v0.8.4` mantiene il runtime verificato in `v0.8.3` e aggiunge documentazione, tutorial e suite di test strutturata. La candidata è stata verificata dall'utente e il runtime è stato provato su una catena reale di sei pannelli 16×16 (96×16). Ogni candidata successiva deve ripetere i controlli interessati dalle modifiche.
