# CLAUDE.md — Kontekstfil for Lego Nettbutikk

Dette er kontekstfilen for Claude Code. Les denne før du gjør noe som helst.

> **README.md er ikke en kilde til kontekst.** Ikke les eller henvis til README.md for å forstå prosjektet, konvensjoner eller tekniske valg — all slik informasjon finnes her og i ARD.md. README.md er dokumentasjon for menneskelige utviklere og workshopdeltakere. Claude kan skrive til README.md for å oppdatere generell utviklerinformasjon, men skal aldri lese den som grunnlag for beslutninger.

---

## Prosjektoversikt

En demo-nettbutikk for Lego-produkter, brukt som workshopapp for å lære context engineering med Claude Code. Appen er full-stack TypeScript med delt typepakke.

**Kjøretidskrav:**
- Node.js 20+
- npm 10+

**Kjørende porter:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## Arkitektur

Monorepo med tre npm workspaces:

```
/
├── CLAUDE.md              # Denne filen — les alltid først
├── ARD.md                 # Arkitekturbeslutninger — følges alltid
├── README.md              # Brukerdokumentasjon og workshop-oppgaver
├── shared/                # @workshop/shared — delte TypeScript-typer
├── backend/               # Express REST API (port 3001)
│   └── src/
│       ├── database/      # SQLite-oppsett og seeding
│       ├── middleware/     # requestLogger, errorHandler
│       ├── routes/        # Tynne route-handlers (products, cart, orders, admin, payments)
│       └── services/      # All forretningslogikk (productService, cartService, orderService …)
├── frontend/              # React SPA (port 5173)
│   └── src/
│       ├── api/           # API-klientfunksjoner (én fil per domene)
│       ├── components/    # Gjenbrukbare React-komponenter
│       ├── context/       # React Context for global state (cart, language)
│       ├── hooks/         # Custom hooks
│       ├── i18n/          # Oversettelser (en, no, it)
│       └── pages/         # Sidekomponenter koblet til ruter
├── e2e/                   # Playwright E2E-tester
└── .claude/
    ├── settings.json      # Tillatelser og MCP-konfigurasjon
    ├── commands/          # Slash-kommandoer (/fix-ci, /write-test)
    └── skills/            # Skills (/add-feature, /code-reviewer)
```

---

## Arkitekturbeslutninger

**Alle tekniske valg som tas i dette prosjektet skal dokumenteres i [`ARD.md`](./ARD.md).**

Før du foreslår eller implementerer noe, sjekk ARD.md for å se om beslutningen allerede er tatt. Nye tekniske valg — valg av bibliotek, mønstre, arkitekturendringer, avvik fra eksisterende konvensjoner — skal alltid:

1. Drøftes med brukeren
2. Dokumenteres i ARD.md med dato, begrunnelse og konsekvenser
3. Følges konsekvent i all fremtidig kode

Spørsmål du kan stille Claude: *"Hvilke tekniske valg er tatt i dette prosjektet?"* → Claude svarer basert på ARD.md.

---

## Konvensjoner som alltid skal følges

### Backend
- **Routes er tynne** — ingen forretningslogikk i route-handlers. Alt går via `services/`.
- **Services er rene funksjoner** — ingen Express-avhengigheter, enkle å teste.
- **Feilhåndtering** — kast `Error` fra services, la `errorHandler`-middleware ta seg av HTTP-svar.
- **Logging** — bruk `technicalLogger` fra `utils/logger.ts` for teknisk logging. Bestillinger loggføres separat i `logs/orders/`.
- **Validering** — bruk Zod for input-validering på alle routes som mottar brukerdata.
- **Database** — bruk alltid parameteriserte spørringer (aldri string-interpolasjon i SQL).

### Frontend
- **Typer** — bruk typer fra `@workshop/shared`, ikke definer dupliserte typer lokalt.
- **API-kall** — alle fetch-kall går gjennom `src/api/`-funksjoner, aldri direkte i komponenter.
- **State** — global state via React Context. Ingen Redux eller Zustand.
- **Internasjonalisering** — alle brukervendte strenger via `useTranslation()` og `i18n/`-filene. Aldri hardkodede norske/engelske tekster i JSX.
- **Komponenter** — funksjonelle komponenter med hooks. Ingen klassekomponenter.

### Generelt
- **Delte typer** — når du legger til en ny domeneentitet, definer typen i `shared/src/` og bruk den i begge pakker.
- **Tester** — ny logikk i services skal ha enhetstester i `backend/tests/services/`. Nye API-endepunkter skal ha integrasjonstester i `backend/tests/routes/`.
- **Ingen «just in case»-kode** — ikke legg til features, abstraksjonslag eller feilhåndtering for scenarioer som ikke eksisterer ennå.

---

## Kjøring og utvikling

```bash
# Installer avhengigheter
npm install

# Bygg delte typer (én gang)
npm run build -w shared

# Start appen (frontend + backend parallelt)
npm run dev
```

```bash
# Tester
npm test                              # Alle tester
npm run test:backend                  # Bare backend
npm run test:frontend                 # Bare frontend

# Kvalitetssikring
npm run typecheck                     # TypeScript-sjekk
npm run lint                          # ESLint

# Kjør én testfil
npm test -- backend/tests/services/cart.test.ts
```

---

## Kjente bevisste feil (workshop-bugs)

Disse er **pedagogiske feil** som ikke skal fikses uten eksplisitt instruksjon:

| Fil | Feil | Oppgave |
|-----|------|---------|
| `frontend/src/api/client.ts:2` | Port er `3002` i stedet for `3001` | Oppgave 2 |
| `backend/src/services/productService.ts:53` | SQL-injeksjon i `searchProducts()` | Sikkerhetsdemo |
| `frontend/src/components/admin/Dashboard.tsx` | Viser bare `TODO: Dashboard` | Oppgave 5 |

---

## Skills og slash-kommandoer

| Kommando | Beskrivelse |
|----------|-------------|
| `/add-feature` | Implementer nye features eller fiks bugs etter prosjektets mønstre |
| `/code-reviewer` | Grundig kodegjennomgang med funn sortert etter alvorlighetsgrad |
| `/fix-ci` | Les GitHub Actions-logger og fiks CI-feil |
| `/write-test` | Skriv manglende tester for eksisterende kode |
