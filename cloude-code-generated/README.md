# Lego Nettbutikk — Claude Code Workshop

En demo-app for Claude Code-workshopen om context engineering. Repoet viser hvordan godt oppsett av kontekst gjør agentisk utvikling dramatisk bedre.

## Forutsetninger

- Node.js 20+
- npm 10+
- Git

## Kom i gang

```bash
# Klon og installer
git clone <repo-url>
cd claude-workshop
npm install

# Bygg delte typer (må gjøres én gang)
npm run build -w shared

# Start appen
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:3001

> **Merk:** Appen starter med en bevisst feil i API-klienten (feil port). Dette er **Oppgave 2**. Frontend laster ikke produkter før feilen er fikset.

## Andre kommandoer

```bash
npm test          # Kjør alle enhetstester
npm run typecheck # TypeScript-sjekk
npm run lint      # Lint alle filer
npm run build     # Produksjonsbygg
```

Kjør én testfil:
```bash
npm test -- backend/tests/services/cart.test.ts
```

---

## Workshop-oppgaver

### Oppgave 1 — Forstå appen (15 min)

Les `CLAUDE.md`, utforsk mappestrukturen og eksisterende tester. Forstå domenelaget og arkitekturen.

**Spørsmål å diskutere:**
- Hvorfor er denne appen godt egnet for agentisk utvikling?
- Hva gir Claude Code kontekst til å plassere ny kode riktig?
- Hvordan hjelper `shared/`-pakken FE og BE å holde seg i sync?

**Demonstrerer:** Context engineering starter med forståelse

---

### Oppgave 2 — Warmup (10 min)

Appen starter, men produktlisten er tom og det er en feil i nettleserkonsollen.

**Oppgave:** Be Claude Code finne og fikse feilen.

**Hint:** Sjekk `frontend/src/api/client.ts`

**Demonstrerer:** Grunnleggende navigasjon og bugfiks med Claude Code

---

### Oppgave 3 — Context Matters (20 min)

Den viktigste oppgaven. Gjør **nøyaktig samme oppgave** to ganger:

1. **Uten CLAUDE.md:** Slett filen, be Claude Code: *"Legg til søkefunksjon på produktlista"*
2. **Med CLAUDE.md:** Gjenopprett filen (`git checkout CLAUDE.md`), be om det samme

Observer forskjellen: Uten kontekst gjetter Claude på konvensjoner og legger ting på feil sted. Med kontekst følger Claude alle mønstre perfekt og skriver tester som matcher eksisterende.

**Demonstrerer:** Kontrasten mellom agentisk utvikling med og uten context engineering

---

### Oppgave 4 — Fix CI (20 min)

Bytt til branchen med ødelagt CI:

```bash
git checkout workshop/broken-ci
```

CI-pipelinen feiler. Bruk Claude Code til å:
1. Lese GitHub Actions-loggene med `gh`
2. Finne rotårsaken til feilen
3. Fikse feilen lokalt og verifisere

**Tips:** Bruk slash-kommandoen `/fix-ci`

**Demonstrerer:** Daglig utviklerflyt 10x raskere med AI

---

### Oppgave 5 — Full feature (40 min)

Gå tilbake til hovedbranchen:

```bash
git checkout start-workshop-take2
```

Admin-dashboardet viser bare `TODO: Dashboard`. Bygg en komplett feature:

- Legg til statistikk (antall bestillinger per status, total omsetning)
- Legg til en oversiktsgraf eller nøkkeltall
- Skriv enhetstester for ny logikk
- Følg eksisterende arkitekturmønstre (typer i `shared/`, logikk i `services/`, tynn route)

**Fil med bug:** `frontend/src/components/admin/Dashboard.tsx`

**Demonstrerer:** Ende-til-ende agentisk feature-utvikling

---

### Oppgave 6 — Parallell kraft (30 min)

Bruk Claude Code med subagenter for å løse tre uavhengige oppgaver samtidig:

1. Legg til produktanmeldelser (stjerner 1–5, tekst-kommentar)
2. Legg til en "Relaterte produkter"-seksjon på produktsiden
3. Skriv manglende tester for checkout-flyt

Start alle tre samtidig og observer gjennomstrømmingen.

**Demonstrerer:** 3x throughput med parallelle subagenter

---

### Bonus A — Playwright MCP (25 min)

Installer Playwright MCP-serveren og koble den til Claude Code. Bruk den til å:
- Kjøre E2E-testene og observere dem visuelt
- Debugge den flaky testen i `e2e/cart.spec.ts`

**Demonstrerer:** Claude "ser" nettleseren og kan debugge visuelt

---

### Bonus B — Terraform MCP (15 min)

Koble til Terraform MCP og be Claude Code reviewe en infra-konfigurasjon. Observer hvordan MCP utvider Claude utover kode.

**Demonstrerer:** MCP som brobygger mellom kode og infrastruktur

---

## Skills og kommandoer

Dette repoet har en innebygd skill som hjelper deg å legge til ny funksjonalitet og fikse bugs riktig.

### `/add-feature`

Bruk kommandoen `/add-feature` (eller bare beskriv hva du vil gjøre) for å implementere nye features eller fikse feil. Skillen sørger for at Claude:

1. **Leser eksisterende kode først** — før den skriver en eneste linje
2. **Følger eksisterende mønstre** — navngivning, arkitektur og konvensjoner fra det som allerede finnes
3. **Holder seg minimal** — endrer bare det som er bedt om
4. **Kjører tester og lint** etter endringer
5. **Oppsummerer** hvilke filer som ble endret

**Eksempler på bruk:**

```
/add-feature legg til søk på produktlisten
/add-feature fiks buggen i handlekurven
/add-feature implementer filtrering på kategori
```

Du kan også bare beskrive det du vil ha uten slash-kommandoen — skillen trigges automatisk.

> **Tips:** Skillen stiller ett avklarende spørsmål hvis forespørselen er vag. Vær gjerne konkret om hva som skal skje og hva som skjer i dag.

---

## Repostruktur

```
/
├── CLAUDE.md              # Kontekstfil for Claude Code (det viktigste)
├── .claude/
│   ├── settings.json      # Tillatelser og MCP-konfigurasjon
│   ├── commands/          # Slash-kommandoer: /fix-ci, /write-test
│   └── skills/            # Skills: /add-feature
├── .github/workflows/     # CI (lint + typecheck + test) og E2E
├── frontend/              # React + Vite + TypeScript (port 5173)
├── backend/               # Express + TypeScript (port 3001)
├── shared/                # Delte typer brukt av både FE og BE
├── e2e/                   # Playwright E2E-tester
└── docs/                  # Planleggingsdokumenter og workshop-guide
```

## Teknisk stack

| Del | Teknologi |
|-----|-----------|
| Frontend | React 18, Vite, TypeScript, React Router v6 |
| Backend | Express, TypeScript, better-sqlite3 |
| Database | SQLite (in-memory, seedes ved oppstart) |
| Testing | Vitest (enhet + integrasjon), Playwright (E2E) |
| CI/CD | GitHub Actions |
| Logging | Winston (teknisk log + per-bestilling forretningslogg) |
