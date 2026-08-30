# Simulatore della matrice RGB

La pagina del simulatore SARDU Matrix disegna una matrice RGB sotto al simulatore Micro:Bit. Riceve il buffer NeoPixel al momento di `show()` e applica la stessa configurazione fisica dell'estensione: dimensioni totali, sei formati di modulo, angolo d'inizio, scansione per righe o colonne e percorso progressivo/ZigZag, sia dentro i moduli sia fra i moduli.

Di conseguenza il simulatore mostra le coordinate logiche che l'utente vede e non soltanto l'ordine grezzo dei LED sul filo. Le modifiche che non chiamano `show()` restano, correttamente, invisibili fino al successivo aggiornamento.

## Disponibilità

Il simulatore e l'editor sono pubblicati insieme al repository tramite GitHub Pages. Per apparire **integrati automaticamente** nell'editor pubblico MakeCode, MakeCode deve approvare il repository e i relativi URL in `targetconfig.json`. Questa è una misura di sicurezza di MakeCode per ogni estensione che apre un iframe esterno; non è un passaggio che il repository può eseguire da solo.

Fino all'approvazione, la stessa pagina resta utilizzabile separatamente su GitHub Pages. Il firmware reale e i blocchi non dipendono dal simulatore: nelle compilazioni hardware il collegamento al simulatore è un no-op e non consuma memoria del Micro:Bit.

## Verifica consigliata

1. Creare una matrice con la stessa configurazione dei pannelli reali.
2. Disegnare alcuni pixel agli angoli e un colore differente vicino a ogni bordo.
3. Chiamare `show()` e confrontare simulatore e pannello.
4. Se l'ordine non coincide, correggere il percorso dei pixel o dei moduli, non le coordinate del disegno.
