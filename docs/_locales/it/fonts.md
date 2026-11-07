# Font e misure del testo

[English](https://github.com/DavideCosta-SARDU/pxt-sardu-matrix/blob/v1.1.0/docs/fonts.md)

SARDU-Matrix include nove font. La loro altezza in pixel è fissa per ogni famiglia e viene moltiplicata per la scala selezionata da 1× a 4×. I font proporzionali modificano la larghezza dei caratteri, non l'altezza.

## Dimensioni dei font

| Font | Larghezza a 1× | Altezza 1× | Altezza 2× | Altezza 3× | Altezza 4× |
| --- | --- | ---: | ---: | ---: | ---: |
| SARDU | 5 pixel per carattere, più spaziatura | 8 | 16 | 24 | 32 |
| SARDU Proporzionale | Variabile, più spaziatura | 8 | 16 | 24 | 32 |
| SARDU Compatto | 4 pixel per carattere, più spaziatura | 8 | 16 | 24 | 32 |
| SARDU Compatto Proporzionale | Variabile, più spaziatura | 8 | 16 | 24 | 32 |
| micro:bit Esteso | 5 pixel per carattere, più spaziatura | 7 | 14 | 21 | 28 |
| micro:bit Proporzionale | Variabile, più spaziatura | 7 | 14 | 21 | 28 |
| Fixed 4x6 | 4 pixel, più spaziatura | 6 | 12 | 18 | 24 |
| font8x8 (V2) | 8 pixel, più spaziatura | 8 | 16 | 24 | 32 |
| Spleen 8x16 (V2) | 8 pixel, più spaziatura | 16 | 32 | 48 | 64 |

Anche la colonna di spazio tra i caratteri viene moltiplicata per la scala selezionata. La larghezza esatta di un testo proporzionale dipende quindi dai caratteri della stringa.

## Posizionare più righe

Le coordinate della matrice partono da zero. Per un testo con orientamento normale, la posizione della riga successiva si calcola con:

```text
Y successiva = Y corrente + altezza font + spazio facoltativo
```

Su una matrice 16×16:

- due righe SARDU 1× entrano a Y=0 e Y=8, senza una riga vuota intermedia;
- due righe micro:bit 1× entrano a Y=0 e Y=7;
- con micro:bit 1× si possono usare Y=0 e Y=8 per lasciare una riga vuota tra i testi.

SARDU 2× è già alto 16 pixel, quindi in una matrice alta 16 pixel entra una sola riga completa.

## Blocchi di misurazione

Quando font, scala, testo o orientamento possono cambiare, è preferibile usare i blocchi di misurazione invece di valori fissi:

- **misura altezza font** restituisce l'altezza non ruotata del font e della scala scelti;
- **misura larghezza testo** restituisce la larghezza esatta di una determinata stringa;
- **misura altezza testo** restituisce l'altezza finale della stringa, compreso l'orientamento.

Con orientamento normale o 180°, l'altezza corrisponde a quella indicata nella tabella. A 90° o 270° le dimensioni vengono scambiate: l'altezza finale dipende dalla larghezza della stringa. Per questi orientamenti va usato **misura altezza testo**.

Le misure applicano gli stessi glifi, spaziatura, riduzione proporzionale, scala e rotazione usati dal renderer.

## Scegliere il font

- **SARDU** è il font predefinito, a larghezza fissa e altezza completa.
- **SARDU Proporzionale** conserva i glifi SARDU eliminando le colonne laterali inutilizzate.
- **SARDU Compatto** riduce ogni carattere a quattro colonne per abbreviare i messaggi.
- **SARDU Compatto Proporzionale** combina glifi compatti e larghezza variabile.
- **micro:bit Esteso** segue lo stile familiare 5×5 del micro:bit e riserva spazio per gli accenti supportati.
- **micro:bit Proporzionale** conserva lo stesso stile eliminando le colonne laterali inutilizzate.

Tutte le varianti SARDU condividono la metrica verticale di 8 pixel. Entrambe le varianti micro:bit condividono la metrica verticale di 7 pixel.

```package
pxt-sardu-matrix=github:DavideCosta-SARDU/pxt-sardu-matrix#v1.1.0
```

## Compatibilità dei nuovi font

**Fixed 4x6** è disponibile su micro:bit V1 e V2. **font8x8 (V2)** e
**Spleen 8x16 (V2)** richiedono micro:bit V2: le loro tabelle non occupano la Flash
di V1. Usarli su V1 produce l'errore 927 (funzione riservata a V2); non viene
sostituito silenziosamente il font. I sei font precedenti conservano dati,
identificativi, dimensioni e valori predefiniti.

I tre nuovi font includono ASCII stampabile e Latin-1, con gli accenti italiani.
Spleen conserva il disegno originale, incluse a e g. Le tabelle sono compresse
senza modificare i pixel e senza buffer di decompressione in RAM.
Fonti e licenze: [THIRD_PARTY_FONTS.md](../../../THIRD_PARTY_FONTS.md).
