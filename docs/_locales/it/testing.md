# Procedura di verifica e test

[English](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v0.9.0/docs/testing.md)

Una release supera la verifica soltanto quando tutti i controlli applicabili terminano senza errori di compilazione, panic, pixel inattesi o differenze visive.

## Struttura

Il `test.ts` principale è un programma rappresentativo delle API pubbliche: creazione, dimensioni, colori RGB/HSL, pixel, testo statico, geometrie, scorrimento immediato e scintille. Un errore deterministico chiama `control.panic(921)`. Compilarlo con `pxt build` e `pxt build --hwvariant v2`; caricarlo nel simulatore MakeCode senza hardware. I progetti indipendenti nella cartella [`tests/`](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v0.9.0/tests/README.md) ampliano la copertura senza concentrare ogni renderer e animazione in un unico firmware V1. Il runner monolitico `pxt test` usa una diversa modalità di compilazione e non sostituisce il programma rappresentativo.

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

La release `v0.9.0` ha superato i controlli delle correzioni per l'approvazione: conversioni reali Blocchi/JavaScript/Python, Help, tutorial inglese/italiano e compilazione V1/V2. Gli algoritmi di rendering corrispondono alla candidata provata sull'hardware `c7c5307b96a5051f56a32991b944bfe30cfd3b02`. Il 25 ottobre 2026 Davide ha confermato testo statico RGB, scorrimento ripetuto con `matrix.width()` collegato a X e cuore rosso/scintille viola/ripristino dello sfondo su micro:bit V2 con sei pannelli16×16 orizzontali (96×16), P1, alimentazione esterna e massa comune. Sono prove hardware rappresentative, non una verifica fisica di ogni configurazione API. V1 verificata in compilazione, non fisicamente. Resta il limite delle parti NeoPixel nel simulatore MakeCode; `hiddenParts` è disattivato perché la prova controllata P1/P2 nascondeva anche una striscia indipendente. Ogni candidata successiva deve ripetere i controlli interessati dalle modifiche.

```package
pxt-sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v0.9.0
```

La prova di conversione parte da un progetto nuovo con blocchi realmente trascinati e collegati: verificare separatamente Blocchi → JavaScript → Blocchi e Blocchi → Python → Blocchi. Ripetere due volte il percorso JavaScript per lo scorrimento con coordinate. Controllare ricevitore `matrix`, colore predefinito e colore scelto, ordine, parametri e assenza di blocchi grigi. Provare X numerico e il blocco larghezza della matrice collegato come normale valore.
