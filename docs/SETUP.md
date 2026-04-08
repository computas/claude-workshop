# Oppsett før kurshelgen — Claude Code Workshop

> Send denne guiden til deltakerne **minst én uke før kurset**.
> Estimert tid: 15–30 min (avhengig av plattform).

## Forutsetninger (alle plattformer)

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)
- **GitHub-konto** med tilgang til kursrepoet
- **GitHub CLI (`gh`)** — [cli.github.com](https://cli.github.com)
- **Claude Code** — krever en API-nøkkel eller Max-abonnement
- **VS Code** (anbefalt, men valgfritt)

## macOS

1. Installer Node.js (om du ikke har det):
   ```bash
   brew install node
   ```

2. Installer GitHub CLI:
   ```bash
   brew install gh
   gh auth login
   ```

3. Installer Claude Code:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

4. Klon repoet og test:
   ```bash
   git clone <REPO_URL>
   cd <repo-navn>
   npm install
   npm run dev
   ```

5. Verifiser Claude Code:
   ```bash
   claude --version
   ```

Du er klar!

## Linux (Ubuntu/Debian)

1. Installer Node.js 18+ (via NodeSource):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. Installer GitHub CLI:
   ```bash
   sudo apt install gh
   gh auth login
   ```

3. Installer Claude Code:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

4. Installer Playwright-avhengigheter (trengs til oppgave 5):
   ```bash
   npx playwright install-deps
   ```

5. Klon repoet og test:
   ```bash
   git clone <REPO_URL>
   cd <repo-navn>
   npm install
   npm run dev
   ```

## Windows

> Claude Code kjører **ikke nativt på Windows**. Du må bruke WSL2 (Windows Subsystem for Linux). Alt arbeid under kurset skjer inne i WSL2.

### Steg 1: Installer WSL2

Åpne PowerShell som administrator:
```powershell
wsl --install
```

Start maskinen på nytt. Ved første oppstart av WSL blir du bedt om å lage et Linux-brukernavn og passord.

### Steg 2: Sett opp utviklingsmiljøet i WSL2

Åpne WSL-terminalen (søk etter "Ubuntu" i startmenyen):

```bash
# Oppdater pakker
sudo apt update && sudo apt upgrade -y

# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer GitHub CLI
sudo apt install gh
gh auth login

# Installer Claude Code
npm install -g @anthropic-ai/claude-code

# Installer Playwright-avhengigheter
npx playwright install-deps
```

### Steg 3: Klon og test

```bash
git clone <REPO_URL>
cd <repo-navn>
npm install
npm run dev
```

### Steg 4: VS Code med WSL (anbefalt)

Installer "WSL"-utvidelsen i VS Code. Deretter kan du åpne prosjektet fra WSL:
```bash
code .
```

VS Code kobler seg automatisk til WSL-miljøet.

### Vanlige Windows-problemer

| Problem | Løsning |
|---------|---------|
| `wsl --install` feiler | Sjekk at virtualisering er aktivert i BIOS |
| Node finnes ikke etter install | Lukk og åpne WSL-terminalen på nytt |
| Playwright browser-feil | Kjør `npx playwright install-deps` og `npx playwright install` |
| Git CRLF-advarsler | Kjør `git config --global core.autocrlf input` inne i WSL |
| Treg filaksess | Jobb i WSL-filsystemet (`~/`), ikke i `/mnt/c/` |

## Verifiseringssjekkliste

Kjør disse kommandoene og sjekk at alt fungerer:

```bash
node --version        # Skal vise v18+ 
npm --version         # Skal vise 9+
git --version         # Skal vise 2.x
gh --version          # Skal vise 2.x
claude --version      # Skal vise en versjon
```

## Problemer?

Ta kontakt med Simon på Slack i forkant, så fikser vi det før kursdagen.
