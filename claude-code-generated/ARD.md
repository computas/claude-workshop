# ARD.md — Arkitekturbeslutninger

Denne filen dokumenterer alle tekniske valg som er tatt i prosjektet. Alle fremtidige endringer skal følge beslutningene som er dokumentert her. Nye beslutninger skal legges til med dato, begrunnelse og konsekvenser.

**Hvordan bruke denne filen:**
- Før du introduserer et nytt bibliotek, mønster eller arkitekturendring — sjekk om det allerede er tatt en beslutning.
- Nye valg som avviker fra eksisterende beslutninger krever eksplisitt oppdatering av denne filen.
- Spør Claude: *"Hvilke tekniske valg er tatt?"* for å få en oppsummering basert på denne filen.

---

## Beslutninger

| ID | Dato | Beslutning | Begrunnelse | Konsekvenser |
|----|------|------------|-------------|--------------|
| ARD-001 | 2026-04-09 | **Monorepo med npm workspaces** — tre pakker: `shared`, `backend`, `frontend` | Deler TypeScript-typer mellom FE og BE uten publisering. Enkel samtidig kjøring med `concurrently`. | Alle nye domenetyper defineres i `shared/src/`. Nye pakker legges til som workspace i rot-`package.json`. |
| ARD-002 | 2026-04-09 | **TypeScript med strict mode** — ES2022-target, NodeNext module resolution | Fanger typefeil tidlig. `NodeNext` gir riktig ESM-håndtering for både backend og frontend. | Alle nye filer skal være `.ts`/`.tsx`. Ingen `any` uten eksplisitt kommentar. Import av lokale filer krever `.js`-suffiks i backend (ESM-krav). |
| ARD-003 | 2026-04-09 | **Backend: Express 4 + tsx (dev) / tsc (prod)** | Express er enkelt og kjent. `tsx watch` gir rask dev-loop uten separat kompileringssteg. | Ny funksjonalitet legges i `services/` (logikk) og `routes/` (HTTP-binding). Ingen forretningslogikk i route-handlers. |
| ARD-004 | 2026-04-09 | **Database: SQLite via better-sqlite3, in-memory** | Ingen ekstern databaseavhengighet. Enkel seeding ved oppstart passer workshop-kontekst. | Data tapes ved omstart. Synkron API (ikke async) fra better-sqlite3 brukes konsekvent. Alle SQL-spørringer skal bruke parameteriserte verdier — aldri string-interpolasjon. |
| ARD-005 | 2026-04-09 | **Frontend: React 18 + Vite + React Router v6** | Rask HMR med Vite. React 18 gir concurrent features. Router v6 er nåværende standard. | Alle sider er funksjonelle komponenter. Ruting defineres i `App.tsx`. Ingen klassekomponenter. |
| ARD-006 | 2026-04-09 | **State management: React Context API** | Tilstrekkelig for appens kompleksitet. Unngår overengineering med Redux/Zustand. | Global state (handlekurv, språk) håndteres via Context i `src/context/`. Lokal komponentstate bruker `useState`. |
| ARD-007 | 2026-04-09 | **Testing: Vitest for enhets- og integrasjonstester, Playwright for E2E** | Vitest er rask og har native ESM-støtte. Playwright er bransjestandardard for E2E. | Alle services skal ha tilhørende tester i `backend/tests/services/`. Routes testes via supertest i `backend/tests/routes/`. E2E-tester ligger i `e2e/`. |
| ARD-008 | 2026-04-09 | **Logging: Winston med strukturert JSON** — to separate loggstrømmer | Skiller teknisk logging (feil, requests) fra forretningslogging (bestillingshistorikk). Maskinlesbart JSON. | Teknisk logging via `technicalLogger`. Per-bestilling-logging via dedikert forretningslogger. Loggfiler lagres i `logs/`. Bruk aldri `console.log` i produksjonskode. |
| ARD-009 | 2026-04-09 | **Input-validering: Zod** | Type-safe validering som gjenbruker TypeScript-typer. Godt integrert med Express og gir tydelige feilmeldinger. | Alle route-handlers som mottar brukerdata skal validere med et Zod-skjema. Valideringsfeil returneres med HTTP 400. |
| ARD-010 | 2026-04-09 | **Internasjonalisering: react-i18next** — støtter norsk, engelsk og italiensk | Dekoupler UI-tekster fra komponentkode. Enkelt å legge til nye språk. | Alle brukervendte strenger i frontend hentes via `useTranslation()`. Nye strenger legges til i alle tre språkfiler under `src/i18n/`. Ingen hardkodede tekster i JSX. |
| ARD-011 | 2026-04-09 | **API-kommunikasjon: REST over HTTP/JSON** | Enkelt, verktøystøttet og tilstrekkelig for appens behov. Ingen GraphQL. | Alle endepunkter prefixes med `/api/`. Klientfunksjoner samles i `frontend/src/api/`. Komponenter kaller aldri `fetch` direkte. |
| ARD-012 | 2026-04-09 | **CI/CD: GitHub Actions** — lint + typecheck + test + E2E | Integrert med GitHub, gratis for open source, enkel YAML-konfigurasjon. | Alle PRer skal passere CI før merge. Pipeline definert i `.github/workflows/`. E2E kjøres som eget steg med Playwright. |
| ARD-013 | 2026-04-09 | **Session-håndtering: klient-generert ID lagret i localStorage** | Ingen innlogging i workshop-kontekst. Enkel tilstandsbevaring mellom sideinnlastinger. | Session-ID genereres i `frontend/src/hooks/useCart.ts` og sendes med alle handlekurv-kall. OBS: ikke egnet for produksjon (ikke kryptografisk sikker, sårbar for XSS). |
| ARD-014 | 2026-04-09 | **CORS: manuelt satt til `localhost:5173` i dev** | Unngår cors-bibliotek for enkel lokal utvikling. | Kun aktuelt for lokal utvikling. Ved produksjonsetting må dette erstattes med miljøvariabel-basert allow-list og et CORS-bibliotek. |
| ARD-015 | 2026-04-09 | **Kjøretidskrav: Node.js 20+ og npm 10+** | Node.js 20 er LTS med støtte for native ESM, `crypto.getRandomValues`, og moderne V8-features som brukes i prosjektet. npm 10 gir workspaces-støtte som monorepo-oppsettet avhenger av. | Ikke bruk syntaks eller API-er som krever Node.js 21+. Sjekk [node.green](https://node.green) ved tvil om kompatibilitet. |
