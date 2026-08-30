# Simulatore della matrice RGB

La pagina simulatore SARDU Matrix è predisposta per mostrare una matrice RGB accanto al simulatore Micro:Bit. Riceve il buffer NeoPixel quando il programma esegue `mostra` e applica la stessa configurazione logica e fisica: dimensioni, moduli, angolo iniziale, scansione per righe o colonne e percorso progressivo/ZigZag.

## Stato dell'integrazione pubblica

Editor grafico e pagina simulatore sono pubblicati separatamente su GitHub Pages e non fanno parte del manifest PXT che genera i blocchi. Questa separazione evita che possano modificare o svuotare la categoria **SARDU Matrix**.

Per incorporare automaticamente la pagina sotto il simulatore Micro:Bit del MakeCode pubblico, Microsoft deve approvare il repository e l'URL esterno nel `targetconfig.json` di MakeCode. Fino a quell'approvazione il firmware, i blocchi e l'editor grafico funzionano indipendentemente; la pagina simulatore resta predisposta, ma non riceve i fotogrammi del progetto pubblico.

## Verifica dopo l'approvazione

1. Creare una matrice con la configurazione dei pannelli reali.
2. Disegnare pixel di colori diversi vicino agli angoli.
3. Eseguire `mostra` e confrontare simulatore e pannello.
4. Se l'ordine non coincide, correggere il percorso di pixel o moduli senza cambiare le coordinate del disegno.
