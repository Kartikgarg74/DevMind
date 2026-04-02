# DevMind

**AI-powered developer assistant — debug, review, and commit with intelligence.**

DevMind is a VS Code extension backed by an AI-powered FastAPI server that helps developers debug code, review changes, and generate commit messages using LLMs (Groq/Llama 3.1 70B).

## Features

- **AI Debugging** — Paste code + error, get root cause analysis and fix suggestions
- **Code Review** — Submit diffs for security, performance, and quality review
- **Commit Messages** — Auto-generate conventional commit messages from staged changes
- **VS Code Integration** — Status bar, quick pick menu, webview panels
- **Git-Aware** — Reads your repo's diff, log, and commit history for context

## Architecture

```
packages/
├── api-server/          # FastAPI backend (Groq LLM + GitPython)
├── vscode-extension/    # VS Code extension (TypeScript)
└── web-dashboard/       # Analytics dashboard (Next.js + Supabase)
```

## Quick Start

### 1. Backend

```bash
cd packages/api-server

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure
export GROQ_API_KEY=your_groq_api_key
export SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")

# Run
uvicorn app.main:app --reload --port 8000
```

### 2. VS Code Extension

```bash
cd packages/vscode-extension

# Install and build
npm install
npm run compile

# Launch in VS Code
# Press F5 to open Extension Development Host
```

### 3. Use It

1. Open Command Palette (`Cmd+Shift+P`)
2. Type "DevMind" to see available commands:
   - `DevMind: Generate Commit Message`
   - `DevMind: Ask for Debug Help`
   - `DevMind: Request Code Review`
   - `DevMind: Open Settings`

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | FastAPI + Python 3.10+ |
| LLM | Groq API (Llama 3.1 70B Versatile) |
| Vector Store | ChromaDB + sentence-transformers |
| Git | GitPython |
| Extension | TypeScript + VS Code API |
| Auth | JWT + GitHub OAuth |
| Dashboard | Next.js 15 + Supabase |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Get from https://console.groq.com |
| `SECRET_KEY` | Yes | JWT signing key (generate with `python -c "import secrets; print(secrets.token_hex(32))"`) |
| `CORS_ORIGINS` | No | Allowed origins (default: `http://localhost:3000`) |
| `GITHUB_CLIENT_ID` | No | For GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | No | For GitHub OAuth |
| `DEBUG` | No | Enable debug mode (default: `false`) |

## License

MIT
