# Geometria

I blocchi del gruppo **Geometria** disegnano nel buffer RGB della matrice:

- linea tra due punti, estremi inclusi;
- contorno o riempimento di un rettangolo;
- contorno o riempimento di un cerchio.

Le coordinate esterne alla matrice vengono ritagliate automaticamente. I rettangoli accettano i due punti anche in ordine inverso e il colore nero cancella i pixel interessati.

I blocchi non aggiornano subito i LED fisici: dopo avere composto la scena usa `mostra` una sola volta.
