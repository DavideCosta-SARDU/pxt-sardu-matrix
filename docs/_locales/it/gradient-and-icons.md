# Testo sfumato e icone integrate

[English](../../gradient-and-icons.md)

## Testo sfumato

Il blocco di testo sfumato statico disegna una riga nel buffer RGB corrente. È possibile scegliere due colori e una delle quattro direzioni: sinistra-destra, destra-sinistra, alto-basso o basso-alto. La direzione si riferisce sempre al testo visibile finale, anche quando la riga è ruotata.

Vengono modificati soltanto i pixel dei caratteri; lo sfondo resta trasparente. Font, dimensione, luminosità (default 128) e orientamento sono parametri espandibili. Dopo aver composto la scena completa occorre chiamare `show()`.

Un secondo blocco conserva un unico colore scelto e sfuma tra una luminosità iniziale e finale da 0 a 255. I default sono 128 e 8, così il bordo finale resta debolmente visibile; zero rimane disponibile quando si desidera arrivare intenzionalmente al nero.

Il gruppo Testo scorrevole offre entrambe le sfumature con ingresso da qualsiasi bordo. La sfumatura è legata ai caratteri e si muove insieme al testo. Le varianti a percorso accettano coordinate X/Y iniziali e finali esatte e supportano movimenti orizzontali, verticali e diagonali.

## Icone integrate

Sono disponibili quattordici maschere monocromatiche originali 8×8: cuore pieno e vuoto, sorriso, volto triste, stella, spunta, croce, quattro frecce, sole, luna e fulmine. Ogni icona può essere posizionata, colorata e ingrandita da 1× a 4× con luminosità predefinita 128.

Le icone scrivono soltanto i pixel attivi nel buffer, con ritaglio sicuro ai bordi. Dopo il disegno occorre chiamare `show()`. Non sono inclusi loghi Micro:Bit o di terze parti.
