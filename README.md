# Il mio bilancio

App web installabile (PWA) per il **bilancio personale**: carichi gli estratti bancari in CSV
e vedi **entrate, uscite e risparmio**, con le uscite divise per categoria.

- **Privacy:** tutto gira nel browser. I movimenti **non lasciano il dispositivo** — nessun server.
- **Multi-formato:** riconosce in automatico gli estratti *ING conto*, *ING carta credito*,
  *ING carta debito* e *Revolut* (esportato in CSV).
- **Riconciliazione:** niente doppioni — la carta di debito già inclusa nel conto viene ignorata,
  l'estratto della carta di credito viene espanso nel suo dettaglio, Revolut sommato come conto a parte.
- **Installabile:** su smartphone «Aggiungi alla schermata Home», su PC «Installa» dalla barra indirizzi.
  Funziona anche offline.

## Uso
Apri il sito, trascina uno o più file CSV. L'app fa il resto.

## Tecnica
Sito statico (`index.html` + `manifest.json` + `sw.js` + `icon.svg`), zero dipendenze, zero backend.
Il motore (parser + riconciliazione + categorie) è nel file `index.html`.

Le regole di categoria qui incluse sono **generiche** (catene e merchant noti). Regole su misura e
dati personali restano fuori da questo repository.
