# Fantasi LEGO Nettbutikk — Claude Code Workshop Demo

En full-stack nettbutikk-app bygget som eksempel for Claude Code-workshopen om **context engineering**.

---

## Kom i gang

### Installer og start

```bash
# Installer alle avhengigheter
npm install

# Start backend (port 3001) og frontend (port 5173) samtidig
npm run dev
```

Åpne http://localhost:5173 i nettleseren.

> **Merk:** Applikasjonen starter med en bevisst feil — produktene vil ikke lastes inn. Se «Kjente bugs» nedenfor.

### Andre nyttige kommandoer

```bash
npm run test          # Kjør alle enhetstester (Vitest)
npm run typecheck     # TypeScript-sjekk av hele prosjektet
npm run lint          # ESLint-sjekk
npm run build         # Produksjonsbygg (frontend + backend)
npm run test:e2e      # Playwright E2E-tester
```

---

## Funksjonalitet som er levert

### Kundesiden

| Funksjon | Beskrivelse |
|----------|-------------|
| **Produktliste** | Viser alle 50 fantasy LEGO-sett med bilde, navn, pris og antall brikker |
| **Filtrering** | Filtrer etter kategori, søk på navn, sett min/maks pris |
| **Produktdetalj** | Fullstendig produktside med beskrivelse og «Legg i handlekurv»-knapp |
| **Handlekurv** | Client-side handlekurv med antallsjustering og fjerning av produkter |
| **Checkout** | Skjema for leveringsadresse og fakturaadresse (kan settes til samme) |
| **Betaling** | Simulert betalingsprosess (1 sekunds forsinkelse, returnerer alltid suksess) |
| **Ordrebekreftelse** | Bekreftelsesskjerm med ordrenummer og oppsummering |

### Admin-seksjonen (`/admin`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Produktliste** | Tabell over alle produkter med redigering og sletting |
| **Opprett produkt** | Skjema for å legge til nye produkter |
| **Rediger produkt** | Oppdater eksisterende produkter |
| **Slett produkt** | Fjern produkter fra katalogen |
| **Dashboard** | *(Bevisst ikke implementert — se bugs nedenfor)* |

### Teknisk infrastruktur

| Komponent | Detaljer |
|-----------|----------|
| **Frontend** | React 18 + Vite + TypeScript, port 5173 |
| **Backend** | Express + TypeScript, port 3001 |
| **Database** | SQLite in-memory (better-sqlite3), initialiseres fra `seed.sql` ved oppstart |
| **Logging** | Winston → `logs/backend.log` |
| **Enhetstester** | 34 Vitest-tester (19 backend, 15 frontend) |
| **E2E-tester** | Playwright (produktliste, checkout, admin) |
| **CI/CD** | GitHub Actions: 3 parallelle jobber (lint, typecheck, unit-tests) |
| **Slash commands** | `/fix-ci`, `/add-feature`, `/write-test` |

### Produktdata

50 fantasy LEGO-sett fordelt på 5 kategorier, priser fra 129 til 2 999 NOK:

| Kategori | Antall | Prisintervall |
|----------|--------|---------------|
| Festninger og borger | 10 | 249–2 499 NOK |
| Romfart og galakser | 10 | 149–2 999 NOK |
| Hav og undervannsverdener | 10 | 179–1 999 NOK |
| Skog og naturmagi | 10 | 129–1 499 NOK |
| Fabeldyr og drager | 10 | 299–2 799 NOK |

---

## Kjente bugs (bevisste — brukes i workshop-øvelser)

### Bug 1 — Feil API-port (Øvelse 2: Warmup)

**Fil:** `frontend/src/api/client.ts`, linje 2

**Symptom:** Produktene lastes ikke inn. Konsollfeil: `net::ERR_CONNECTION_REFUSED`

**Årsak:** API-klienten peker på port `3002` i stedet for `3001`

```typescript
// FEIL:
const BASE_URL = 'http://localhost:3002/api';

// RETT:
const BASE_URL = 'http://localhost:3001/api';
```

---

### Bug 2 — Type-feil som knekker CI (Øvelse 4: Fix CI)

**Branch:** `workshop/broken-ci`

**Fil:** `backend/src/services/orderService.ts`

**Symptom:** `typecheck`-jobben i GitHub Actions feiler med TypeScript-feil

**Årsak:** En `number` sammenlignes med en streng-literal

```typescript
// FEIL — TypeScript-feil: Operator '>' cannot be applied to types 'number' and 'string'
if (item.unit_price > "500") { ... }

// RETT:
if (item.unit_price > 500) { ... }
```

**Slik diagnostiserer du:**
```bash
git checkout workshop/broken-ci
gh run list --branch workshop/broken-ci
gh run view <run-id> --log-failed
```

---

### Bug 3 — Manglende enhetstester (Øvelse 4–5)

**Fil:** `backend/tests/services/cartService.test.ts`

**Symptom:** Testdekning er ufullstendig — bare «happy path» er testet

**Mangler:**
- Test for fjerning av varer fra handlekurv
- Test for oppdatering av antall
- Test for tom handlekurv ved checkout
- Test for ugyldig produkt-ID

---

### Bug 4 — Tom placeholder-komponent (Øvelse 5: Full feature)

**Fil:** `frontend/src/components/admin/Dashboard.tsx`

**Symptom:** Admin-dashbordet på `/admin` viser bare teksten «TODO: Dashboard»

**Årsak:** Komponenten er bevisst ikke implementert:

```typescript
export function Dashboard() {
  // TODO: Implement admin dashboard with order statistics and product counts
  return <div>TODO: Dashboard</div>;
}
```

---

### Bug 5 — Race condition i E2E-test (Bonusoppgave: Playwright MCP)

**Fil:** `e2e/checkout.spec.ts`

**Symptom:** Testen er flaky — den passerer på raske maskiner men feiler i CI

**Årsak:** Testen sjekker handlekurv-teller uten å vente på at tilstanden er oppdatert:

```typescript
// FEIL — mangler waitForSelector:
await page.locator('[data-testid="add-to-cart-button"]').first().click();
const cartCount = page.locator('[data-testid="cart-count"]');
await expect(cartCount).toHaveText('1');

// RETT:
await page.locator('[data-testid="add-to-cart-button"]').first().click();
await page.waitForSelector('[data-testid="cart-count"]');
const cartCount = page.locator('[data-testid="cart-count"]');
await expect(cartCount).toHaveText('1');
```

---

### Bug 6 — SQL injection (Bonusfunn for skarpe deltakere)

**Fil:** `backend/src/routes/products.ts`

**Symptom:** Søkeparameteren brukes direkte i SQL-spørringen uten parameterisering

**Årsak:**

```typescript
// SÅRBAR — SQL injection:
const rows = db.prepare(
  `SELECT * FROM products WHERE name LIKE '%${filters.search}%'`
).all();

// TRYGT — parameterisert:
const rows = db.prepare(
  'SELECT * FROM products WHERE name LIKE ?'
).all(`%${filters.search}%`);
```

---

## Prosjektstruktur

```
├── CLAUDE.md                    # Kontekst for Claude Code (les denne!)
├── README.md                    # Denne filen
├── package.json                 # Monorepo-rot med alle npm-scripts
├── shared/src/types.ts          # Delte TypeScript-typer (FE + BE)
├── backend/
│   ├── src/database/seed.sql    # 50 fantasy LEGO-produkter
│   ├── src/services/            # Forretningslogikk (tykke services)
│   ├── src/routes/              # API-endepunkter (tynne routes)
│   └── tests/                   # Vitest enhetstester
├── frontend/
│   ├── src/api/client.ts        # ← Bug 1 er her
│   ├── src/hooks/useCart.ts     # Handlekurv-kontekst (localStorage)
│   ├── src/components/          # React-komponenter
│   └── tests/                   # Vitest komponent- og hook-tester
├── e2e/                         # Playwright E2E-tester
└── .claude/commands/            # Slash commands: /fix-ci, /add-feature, /write-test
```
