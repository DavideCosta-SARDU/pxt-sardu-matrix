# Esempi MakeCode pronti da caricare

[English](README.md)

Ogni cartella contiene un progetto MakeCode a Blocchi completo. Aprilo in MakeCode con l'estensione SARDU-Matrix, quindi usa **Scarica** per generare il file `.hex` corretto per il Micro:Bit selezionato. Il repository non distribuisce intenzionalmente firmware già compilati.

- **sound-wave** — il livello del microfono di Micro:Bit V2 viene mostrato come onda mobile centrata. I suoni forti producono picchi più alti; il silenzio genera una linea quasi piatta.
- **darkness-indicator** — l'intensità luminosa rilevata viene trasformata in righe accese e luminosità della matrice. Un ambiente più buio produce più luce.

Entrambi gli esempi usano una matrice 16×16 sul pin P1 con luminosità iniziale 128. Modifica il blocco di creazione in base al display reale. Usa sempre un alimentatore esterno adeguato per i LED e la massa comune.
