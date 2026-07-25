# Alphia Dashboard

Interactief statistiekendashboard voor zaalvoetbalteam Alphia: topscorers, aanwezigheid, resultaten per seizoen en head-to-head records per tegenstander. Gebouwd met Next.js, Tailwind CSS en Recharts.

## Ontwikkelen

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data

De wedstrijddata staat in `src/data/season1.ts` t/m `season4.ts` (seizoen 1–4, chronologisch). Elk bestand bevat:

- `matches`: per wedstrijd datum, tegenstander, thuis/uit, uitslag en type (competitie/beker/oefenwedstrijd, afgeleid uit de notitie).
- `playerStats`: aanwezigheid en doelpunten per speler, overgenomen uit de jaartotalen van de originele team-spreadsheets.

De data is getranscribeerd uit screenshots van de originele Excel-sheets (geen brondata beschikbaar) en zoveel mogelijk gevalideerd tegen de eigen totalen van die sheets (W-D-L record en doelpuntensom per seizoen). Kleine afwijkingen zijn mogelijk; zie de voetnoot in de app.

`src/data/index.ts` is het enige toegangspunt tot de data (`getSeasons()`, `getAllMatches()`) — een latere uitbreiding met een database/CMS voor nieuwe seizoenen hoeft alleen dit bestand te vervangen, de rest van de app blijft ongewijzigd.

### Een nieuw seizoen toevoegen

1. Maak `src/data/season5.ts` naar het patroon van de bestaande bestanden (zie `src/data/types.ts` voor de tuple-vorm van een wedstrijd).
2. Voeg de jaartotalen per speler toe (`playerStats`).
3. Registreer het seizoen in `src/data/index.ts` (`seasons` array).

## Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Recharts voor grafieken
