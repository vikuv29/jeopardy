
# Jeopardy! – Lokal webbapp med LAN‑buzzer (svenska)

Ett fristående Jeopardy‑spel som körs direkt i webbläsaren. Innehåller
*förbered rutor*‑läge, *spelläge*, poängtavla – och **LAN‑buzzer** så att
spelare kan buzz:a från sina mobiler på samma nätverk.

> **Snabbt:** Statisk filserver på port **8000** och en enkel WebSocket‑server på **3001**.

---

## Funktioner

- **Editor:** Antal kategorier/rader, frågor/svar per ruta, poäng, Daily Double.
- **Spelläge:** Bräde med kategorier/poäng, dialog med fråga/svar, timer.
- **Poängtavla:** Valfritt antal lag, +/− med valfri steglängd.
- **LAN‑buzzer:** Värd öppnar/återöppnar för buzz, visar **först att trycka**.
- **Frågedialogen (värd):** Markera ✔ Rätt / ✖ Fel → poäng ges/dras automatiskt.
  Fel svar öppnar direkt för ny buzz. Rätt svar markerar rutan som använd.
- **Import/Export:** Spara/Ladda i `localStorage`, exportera/importera **JSON**.
- **Genvägar:** `F` helskärm, `Mellanslag` visa/dölj svar, `T` timer, `Y` rätt, `N` fel.

---

## Struktur

```
.
├── jeopardy.html      # hela klientappen (editor + spel + buzzer)
├── server.js          # minimal WebSocket-server för LAN-buzzer (port 3001)
└── kraftskiva_jeopardy.json  # exempeldata (frivilligt)
```

---

## Krav

- **Ubuntu 22.04+** (eller annan Linux/macOS/Windows)
- **Node.js** (för WebSocket‑servern)
- En modern webbläsare (Chrome/Edge/Firefox/Safari).

---

## Kom igång

1. **Installera Git & Node (Ubuntu):**
   ```bash
   sudo apt update
   sudo apt install -y git nodejs npm
   ```

2. **Klona repo och installera server‑beroenden:**
   ```bash
   git clone <URL-till-ditt-repo>.git
   cd <repo>
   npm init -y      # om package.json saknas
   npm install ws
   ```

3. **Starta WebSocket‑servern (port 3001):**
   ```bash
   node server.js
   ```

4. **Starta en enkel filserver (port 8000) i en NY terminal:**
   ```bash
   python3 -m http.server 8000
   ```

5. **Ta reda på din LAN‑IP och surfa dit från värden och spelare:**
   ```bash
   hostname -I
   # ex: 192.168.1.42
   ```
   Öppna `http://192.168.1.42:8000/jeopardy.html`

---

## Användning

### 1) Värd (dator på projektorn)
- Öppna sidan, välj **Värd**, skriv ev. namn och klicka **Anslut**.
- Gå till **Spelläge**. När du öppnar en ruta, **armas** buzzern automatiskt.
- I frågedialogen ser du **Först att trycka** och har knappar:
  - **✔ Rätt**: tilldelar poäng till valt lag, markerar rutan använd och stänger frågan.
  - **✖ Fel**: drar poäng från valt lag och **öppnar** buzzern igen.
  - **Öppna för buzz / Reset**: finns även i dialogen.
- Välj lag i dropdown (förifylls smart utifrån spelarnamn/ tidigare mappning).
- Tangenter: `Y` = Rätt, `N` = Fel, `Mellanslag` = Visa/dölj svar, `T` = Timer.

### 2) Spelare (mobiler på samma Wi‑Fi/LAN)
- Öppna samma adress, välj **Buzzer**, skriv namn, **Anslut**.
- Gå till fliken **Buzzer** och tryck **BUZZ!** när status visar *Öppet*.

---

## JSON‑format (export/import)

Exporten innehåller:
```json
{
  "game": {
    "cols": 5,
    "rows": 5,
    "categories": [
      {
        "title": "Kategori 1",
        "clues": [
          { "value": 100, "question": "…", "answer": "…", "dd": false }
        ]
      }
    ]
  },
  "teams": [ { "name": "Lag 1", "score": 0 } ],
  "used": { "c-r": true },
  "buzzerTeamMap": { "SpelareNamn": 0 }
}
```
> Du kan skapa egna omgångar och importera via **Importera JSON** i appen.

Ett färdigt exempel finns i `kraftskiva_jeopardy.json` (Kräftskiva‑tema).

---

## Nätverk & brandvägg

- Webb: **8000/tcp** (HTTP, statiska filer)
- WebSocket: **3001/tcp** (buzzer‑trafik)
- Klienterna ansluter till `ws://<värdens-IP>:3001` (automatiskt). Säkerställ att datorn och mobilerna ligger på samma LAN och att portar är öppna.

---

## Felsökning

- **”non‑fast‑forward” vid push:** Kör `git fetch origin && git pull --rebase origin main` och därefter `git push -u origin main`. Eller använd `git push --force-with-lease` om du vet att du vill skriva över remote.
- **Klienter ansluter inte:** Kontrollera att `node server.js` kör, rätt IP används, och att port **3001** inte blockeras.
- **Buzzer öppnas inte:** Värden måste vara **Ansluten** (grön prick uppe till höger). När en fråga öppnas armas buzzern automatiskt; du kan även klicka **Öppna för buzz** i dialogen.
- **HTTPS/localhost‑begränsningar:** Kör sidan via `http://` (inte `file://`).

---

## Vanliga förbättringar (roadmap)

- Final Jeopardy‑läge.
- Ljudsignaler (öppning/tryck).
- Lockout per spelare efter fel svar (valbar).
- Timer med visuell ring och automatisk låsning vid 0.
- Export av resultat/poänglogg.

---

## Licens

Lägg in valfri licens, t.ex. MIT.

---

## Medverkan

PRs och issues välkomnas. För större ändringar – öppna gärna en diskussion först.