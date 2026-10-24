# Procedura di verifica e test

[English](../../testing.md)

Una release supera la verifica soltanto quando tutti i controlli applicabili terminano senza errori di compilazione, panic, pixel inattesi o differenze visive.

## Struttura

Il `test.ts` principale è un programma rappresentativo delle API pubbliche: creazione, dimensioni, colori RGB/HSL, pixel, testo statico, geometrie, scorrimento immediato e scintille. Un errore deterministico chiama `control.panic(921)`. Compilarlo con `pxt build` e `pxt build --hwvariant v2`; caricarlo nel simulatore MakeCode senza hardware. I progetti indipendenti nella cartella [`tests/`](../../../tests/README.md) ampliano la copertura senza concentrare ogni renderer e animazione in un unico firmware V1. Il runner monolitico `pxt test` usa una diversa modalità di compilazione e non sostituisce il programma rappresentativo.

Questi progetti coprono configurazione, mapping, colori, tutti i font e orientamenti, testo e geometrie, Graphics, scorrimento immediato e composto, percorsi simultanei, sfumature ed effetti. Ogni famiglia reale viene compilata separatamente per V1 e V2. Gli errori deterministici usano `control.panic(921)`.

## Compilazione

Eseguire `python tests/check-metadata.py` dalla cartella principale dell'estensione per controllare firme dei blocchi, segnaposto inglesi/italiani, riferimenti shadow e percorsi Help. Questo controllo strutturale non sostituisce le conversioni manuali nell'editor.

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

Registrare commit o tag esatto, revisione micro:bit, pannelli, pin dati e alimentazione. Un errore, panic, pixel inspiegabile, gruppo mancante, conversione errata o stato finale inatteso blocca la promozione.

La release `v0.8.4` mantiene il runtime verificato in `v0.8.3` e aggiunge documentazione, tutorial e suite di test strutturata. La candidata è stata verificata dall'utente e il runtime è stato provato su una catena reale di sei pannelli 16×16 (96×16). Ogni candidata successiva deve ripetere i controlli interessati dalle modifiche.

```package
sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix-test#candidate-approval-fixes
```

La prova di conversione parte da un progetto nuovo con blocchi realmente trascinati e collegati: verificare separatamente Blocchi → JavaScript → Blocchi e Blocchi → Python → Blocchi. Ripetere due volte il percorso JavaScript per lo scorrimento con coordinate. Controllare ricevitore `matrix`, colore predefinito e colore scelto, ordine, parametri e assenza di blocchi grigi. Provare X numerico e il blocco larghezza della matrice collegato come normale valore.
