# Plan: Claude Code Helgekurs — Git Repo

## Kontekst

Simon skal holde Claude Code kurshelg 18. april for utviklere i Computas. Målet er WOW-effekt gjennom et ferdig oppsatt repo som viser kraften i **context engineering**. Repoet skal vise at forskjellen mellom middelmådig og fantastisk agentisk utvikling ligger i oppsett, ikke modell.

**Denne planen er en handoff-spec** — noen andre skal bygge repoet basert på dette.

---

## App: Handlekurv (Nettbutikk)

Produkter, kategorier, handlekurv og checkout. Alle kjenner konseptet — null domeneopplæring nødvendig. God kompleksitet med tydelige domenelag (produktkatalog, kurv-logikk, bestillingsflyt) som gjør det lett å demonstrere agentisk utvikling på tvers av FE og BE.

---

## Teknologi-forslag

Velg noe som er **lett å installere og kjøre** (clone → install → run). Unngå Docker/tunge databaser.

| Stack | FE | BE | DB | Installasjon |
|-------|-----|-----|-----|-------------|
| **JS/TS fullstack** | React + Vite | Express/Fastify | SQLite | `npm install && npm run dev` |
| **Python backend** | React + Vite | FastAPI/Flask | SQLite | `npm install` (FE) + `pip install` (BE) |
| **Next.js fullstack** | Next.js (App Router) | Next.js API routes | SQLite/Prisma | `npm install && npm run dev` |

**Anbefaling:** Bruk SQLite uansett stack — null oppsett, ingen config, databasen er en fil.

---

## Hva repoet MÅ ha (kjernekrav)

### 1. Utmerket CLAUDE.md

Hele poenget med workshopen. CLAUDE.md skal inneholde:

| Seksjon | Innhold |
|---------|---------|
| **Project Overview** | Hva appen er, hvilken tech |
| **Architecture** | Mappestruktur, dataflyt mellom FE og BE, domenekonsepter |
| **Development Commands** | Alle kommandoer: dev, test, lint, build |
| **Code Conventions** | Navngivning, filstruktur, import-stil, feilhåndtering |
| **Common Tasks** | Steg-for-steg: "Legg til ny endpoint", "Lag ny komponent", "Skriv enhetstest" |
| **Testing** | Teststrategi, hvordan testene er organisert, konvensjoner for nye tester |
| **Known Issues** | Kjent tech debt agenten kan plukke opp |
| **CI/CD** | Hva som kjører i GitHub Actions, vanlige feilårsaker |

### 2. God filstruktur (FE/BE)

```
repo-navn/
├── CLAUDE.md
├── .claude/
│   ├── settings.json              # Permissions + MCP-servere
│   └── commands/
│       ├── fix-ci.md              # Slash command: diagnostiser og fiks CI
│       ├── add-feature.md         # Slash command: legg til ny feature
│       └── write-test.md         # Slash command: skriv enhetstest for modul
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint + test + typecheck (parallelle jobs)
│       └── e2e.yml               # Playwright E2E-tester
├── frontend/                      # Alt FE-relatert
│   ├── src/
│   │   ├── components/           # UI-komponenter, organisert i undermapper
│   │   ├── hooks/                # Custom hooks for datahenting
│   │   ├── api/                  # API-klient (kobling til BE)
│   │   └── styles/
│   └── tests/                    # Vitest enhetstester for komponenter og hooks
├── backend/                       # Alt BE-relatert
│   ├── src/
│   │   ├── routes/               # API-endepunkter
│   │   ├── services/             # Forretningslogikk (kurv, bestilling, produkter)
│   │   ├── database/             # Schema, seed-data, tilkobling
│   │   └── middleware/           # Feilhåndtering, validering
│   └── tests/                    # Vitest enhetstester for services og routes
├── shared/                        # Delte typer og validering (brukes av FE og BE)
├── e2e/                          # Playwright E2E-tester (bonus)
└── docs/
    ├── WORKSHOP.md               # Workshop-guide
    └── tasks/                    # Oppgavebeskrivelser (01-07)
```

**Koblinger mellom FE og BE:**
- `shared/` inneholder typer og validering som begge sider bruker — dette sikrer at FE og BE alltid er i sync
- `frontend/src/api/` er FE sin klient som snakker med BE sine `routes/`
- Routes kaller services (tynn route, tykk service)
- Validering skjer på begge sider med samme schemas fra `shared/`

### 3. GitHub Actions

**ci.yml** — Kjører på push og PR:
- **Job 1:** Lint (parallell)
- **Job 2:** Typecheck (parallell)
- **Job 3:** Unit tests (parallell)

Viktig: Ha en **egen branch** (`workshop/broken-ci`) der CI feiler pga. en planlagt bug. Dette brukes i oppgave 3.

**e2e.yml** — Playwright:
- Bygger appen, kjører E2E-tester
- Laster opp trace-filer som artifacts ved feil

### 4. Slash commands (.claude/commands/)

| Kommando | Hva den gjør |
|----------|-------------|
| `/fix-ci` | Hent GitHub Actions-logger → finn feil → fiks → verifiser lokalt |
| `/add-feature` | Steg-for-steg feature-workflow som følger CLAUDE.md |
| `/write-test` | Skriv enhetstest for en gitt modul — følger testkonvensjonene i CLAUDE.md |

### 5. Planlagte bugs

Repoet skal ha **bevisste feil** som gjør oppgavene realistiske:

| Bug | Hvor | Brukes i |
|-----|------|----------|
| Feil port/URL i API-klient | Frontend API-klient | Oppgave 2: Warmup |
| Type-feil (streng vs tall) | Backend service | Oppgave 3: Fix CI (på egen branch) |
| Manglende enhetstest for kurvlogikk | Backend tests (mangler) | Oppgave 4: Parallelle oppgaver |
| Placeholder-komponent (tom) | Frontend dashboard | Oppgave 5: Full feature |
| Race condition i E2E-test | E2E-testfil | Bonus: Playwright |
| SQL injection (rå string) | Backend route | Bonusfunn for skarpe |

### 6. Enhetstester

Repoet skal ha **eksisterende enhetstester** som AI-agenten kan lære fra og bygge videre på. Vitest brukes for både FE og BE.

**Backend-tester (finnes):**
- `backend/tests/services/product.test.ts` — CRUD for produkter
- `backend/tests/services/cart.test.ts` — Legg til, fjern, oppdater antall
- `backend/tests/routes/products.test.ts` — API-integrasjonstester

**Frontend-tester (finnes):**
- `frontend/tests/components/ProductCard.test.tsx` — Rendering og klikk
- `frontend/tests/hooks/useCart.test.ts` — Hook-logikk

**Mangler bevisst (brukes i oppgaver):**
- Tester for checkout-flyt (brukes i oppgave 4 og 5)
- Tester for søk/filtrering (brukes i oppgave 3: Context Matters)

Poenget: AI-agenten har eksempler å lære testmønsteret fra, og deltakerne kan be Claude skrive nye tester som følger konvensjonene.

### 7. MCP-konfigurasjon

**I .claude/settings.json:**
- Pre-konfigurerte permissions (package manager, git, gh CLI, database)

**Legges til som bonus under workshop:**
- Playwright MCP (bonus-oppgave: E2E-testing)
- Terraform MCP (bonus-oppgave: infra-review)

### 8. Seed-data

Bruk norske navn og gjenkjennelige eksempler. Gjør det morsomt og relevant.

---

## Workshop-oppgaver (7 stk, progressive)

| # | Navn | Tid | Hva deltakerne gjør | Hva det demonstrerer |
|---|------|-----|---------------------|---------------------|
| 1 | **Forstå appen** | 15 min | Les CLAUDE.md, utforsk arkitekturen, forstå domenelaget og testene. Diskuter: hvorfor er dette en god app for en AI-agent? | Context engineering starter med forståelse |
| 2 | **Warmup** | 10 min | Fiks konsollfeilen (feil API-URL) | Grunnleggende navigasjon og bugfiks |
| 3 | **Context Matters** | 20 min | Samme oppgave MED og UTEN CLAUDE.md — se forskjellen | **DEN store aha-opplevelsen** |
| 4 | **Fix CI** | 20 min | Les GitHub Actions-logger med `gh`, finn og fiks feilen | Daglig utviklerflow 10x raskere |
| 5 | **Full feature** | 40 min | Bygg komplett feature ende-til-ende (typer → BE → FE → enhetstester) | Real-world agentisk utvikling |
| 6 | **Parallell kraft** | 30 min | Tre uavhengige oppgaver samtidig med subagenter | 3x throughput i sanntid |
| 7 | **Playwright MCP** | 25 min | Debugg flaky E2E-test visuelt med Playwright MCP | Claude "ser" browseren (bonus) |
| B | **Terraform MCP** | 15 min | Review infra-config, foreslå forbedringer | MCP utvider Claude beyond kode (bonus) |

### Oppgave 1 i detalj: Forstå appen

Deltakerne starter med å **lese og forstå** før de koder:

1. **Les CLAUDE.md** — forstå arkitekturen, konvensjonene og teststrategien
2. **Utforsk mappestrukturen** — se hvordan FE, BE og shared henger sammen
3. **Les eksisterende enhetstester** — forstå testmønstrene som er etablert
4. **Diskuter i par:** Hvorfor er denne appen god for agentisk utvikling?

Gode svar deltakerne bør komme frem til:
- Tydelig separasjon mellom lag (routes → services → database) gjør det lett for AI å plassere ny kode riktig
- Shared types sikrer at AI holder FE og BE i sync
- Eksisterende tester gir AI et mønster å følge når den skriver nye tester
- CLAUDE.md gir AI hele konteksten den trenger uten å måtte gjette
- Konvensjoner som er dokumentert = konvensjoner som blir fulgt

**Poenget:** Context engineering handler ikke bare om å skrive en god CLAUDE.md — det handler om å designe en kodebase som er lett for en AI-agent å jobbe i.

### Oppgave 3 i detalj (den viktigste)

Deltakerne gjør **nøyaktig samme oppgave** to ganger:
1. **Uten CLAUDE.md:** Slett filen, be Claude Code "Legg til søkefunksjon på produktlista"
2. **Med CLAUDE.md:** Gjenopprett filen, be om det samme

Uten: Claude gjetter på konvensjoner, legger ting på feil sted, bruker feil mønstre, skriver ingen tester.
Med: Claude følger alle konvensjoner perfekt, legger filer riktig, bruker riktige patterns, skriver enhetstester som matcher eksisterende mønster.

**Kontrasten er slående** — dette er "context engineering"-tesen gjort håndgripelig.

---

## Tidsplan for workshopen

| Tid | Aktivitet |
|-----|-----------|
| 0:00–0:15 | Setup: clone, install, kjør appen |
| 0:15–0:30 | Intro: "Det handler ikke om modellen — det handler om context engineering" |
| 0:30–0:45 | Oppgave 1: Forstå appen |
| 0:45–0:55 | Oppgave 2: Warmup |
| 0:55–1:15 | Oppgave 3: Context Matters (A/B-testen) |
| 1:15–1:35 | Oppgave 4: Fix CI |
| 1:35–1:45 | Pause |
| 1:45–2:25 | Oppgave 5: Full feature |
| 2:25–2:55 | Oppgave 6: Parallelle features |
| 2:55–3:30 | Bonusoppgaver (Playwright MCP, Terraform MCP) + oppsummering |

---

## Plattformstøtte

Kurset støtter macOS, Linux og Windows (via WSL2). Se `SETUP.md` for plattformspesifikke installasjonsinstruksjoner — send til deltakerne minst én uke i forkant.

**Viktig for repoet:**
- Bruk forward slash (`/`) i alle stier i CLAUDE.md og slash commands
- Legg inn `.gitattributes` med `* text=auto eol=lf` for å unngå CRLF-problemer
- Playwright trenger `npx playwright install-deps` på Linux/WSL2

---

## Verifisering (den som bygger repoet)

1. Clone repoet fersk → install → dev fungerer uten feil
2. Enhetstester kjører og passer: `npm test` (minus planlagte feil på egne brancher)
3. CLAUDE.md gir Claude Code riktig kontekst (test med oppgave 3)
4. Claude skriver nye tester som matcher eksisterende mønster (test med oppgave 5)
5. GitHub Actions fungerer ved push
6. Alle 7 oppgaver er gjennomførbare

---

## Plassering

Lokal plan: `Claude work/Internt/Agentiske verktøy i Computas/Kurshelg/`

Selve repoet: eget Git-repo på GitHub, deles med deltakerne.
