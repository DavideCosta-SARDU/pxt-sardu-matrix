# Geometria statica

I blocchi del gruppo **Geometria statica** disegnano nel buffer RGB della matrice:

- linea tra due punti, estremi inclusi;
- contorno o riempimento di un rettangolo;
- contorno o riempimento di un cerchio.

Le coordinate esterne alla matrice vengono ritagliate automaticamente. I rettangoli accettano i due punti anche in ordine inverso e il colore nero cancella i pixel interessati.

I blocchi non aggiornano subito i LED fisici: dopo avere composto la scena usa `mostra` una sola volta.

## Geometria scorrevole

I blocchi `aggiungi ... allo scorrimento` costruiscono una composizione leggera in sequenza. È possibile, per esempio, aggiungere il testo `CIAO` e poi un cerchio. Il blocco `avvia scorrimento`, nel gruppo Display subito sotto `mostra`, anima l'intera composizione e la svuota al termine.

La composizione conserva comandi di disegno, non un secondo framebuffer RGB: testo e geometrie vengono ridisegnati insieme con lo stesso spostamento e una sola chiamata `show()` per fotogramma.
