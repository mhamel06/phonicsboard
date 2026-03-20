# Claude Code Configuration - PhonicsBoard

## Project Overview

Free, cross-platform phonics blending board web app for educators. Competitive alternative to Blend Reading ($10/mo) — free for teachers.

- **Stack**: Expo (React Native + Web), TypeScript, react-native-svg, Redux Toolkit
- **Design**: pencil.dev for mockups
- **Linear Project**: PhonicsBoard (ModestMind team)
- **Issue Prefix**: MOD-
- **Platforms**: Web (primary), iOS, Android (via Expo)
- **Architecture**: See `/docs/ARCHITECTURE.md`
- **Production URL**: https://phonics.staylo.io
- **Competitor**: Blend Reading — https://blendreading.com (library at /library)
- **Repo**: https://github.com/mhamel06/phonicsboard

### Deployment

- **Host**: DigitalOcean Droplet (nginx serving static files)
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) — auto-deploys on push to `main`
- **Pipeline**: `npm ci` → `npm test` → `npx expo export --platform web` → `rsync dist/` to Droplet
- **Domain**: `phonics.staylo.io` (SSL via certbot)
- **Static files**: `/var/www/phonicsboard/` on the Droplet

### Preset Data Architecture

- Preset playlists/decks are defined in code (`src/data/playlists/`, `src/data/presets/`)
- Code is **authoritative** for presets — AsyncStorage and Supabase cloud sync never overwrite preset data
- User-created playlists ARE persisted to AsyncStorage and synced to Supabase
- When updating preset word lists, the changes take effect on next app load (no migration needed)

### Release Phases

| Phase | What | Status |
|-------|------|--------|
| **Phase 1** | Core blending board (MVP) — decks + basic playlists | **Active** |
| **Phase 2** | Full feature parity — word mats, editors, all presets | Next |
| **Phase 3** | Differentiation — audio, progress tracking, gamification | Future |
| **Phase 4** | Advanced — AI word chains, adaptive, multi-student | Future |

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/src/engine` for pure TypeScript game logic (ZERO React dependencies)
- Use `/src/components` for React Native UI components
- Use `/src/hooks` for custom React hooks
- Use `/src/store` for Redux Toolkit slices
- Use `/src/data` for preset JSON data (decks, playlists, word mats)
- Use `/app` for Expo Router file-based routes
- Use `/__tests__` for test files (mirror src/ structure)
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/assets` for images, fonts, sounds
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Project Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

## Build & Test

```bash
# Dev server
npx expo start              # All platforms
npx expo start --web        # Web only

# Build
npx expo export --platform web   # Web build

# Test
npm test                    # All tests (Vitest)
npm run test:watch          # Watch mode

# Lint & Type check
npm run lint
npm run typecheck
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing
- Game engine tests (Vitest) must cover ALL edge cases
- Engine tests in `/__tests__/engine/`, component tests in `/__tests__/components/`

## Design Workflow

1. Create mockups in pencil.dev before writing UI code
2. Export design assets to `/assets/`
3. Implement components to match mockups
4. Validate visually with pencil screenshots

## Linear Issue Workflow

- All issues assigned to the **PhonicsBoard** project in Linear
- Reference issues in commits: `MOD-XXX`
- Update issue status: Backlog → In Progress → Done
- Every feature must have tests before marking as Done

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
- Run `npx @claude-flow/cli@latest security scan` after security-related changes

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use Claude Code's Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
- Never use CLI tools alone for execution — Task tool agents do the actual work
- MUST call CLI tools AND Task tool in ONE message for complex work

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) — Skip LLM |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity (<30%) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]`

## Swarm Configuration & Anti-Drift

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

## Swarm Execution Rules

- ALWAYS use `run_in_background: true` for all agent Task calls
- ALWAYS put ALL agent Task calls in ONE message for parallel execution
- After spawning, STOP — do NOT add more tool calls or check status
- Never poll TaskOutput or check swarm status — trust agents to return
- When agent results arrive, review ALL results before proceeding

## V3 CLI Commands

### Core Commands

| Command | Subcommands | Description |
|---------|-------------|-------------|
| `init` | 4 | Project initialization |
| `agent` | 8 | Agent lifecycle management |
| `swarm` | 6 | Multi-agent swarm coordination |
| `memory` | 11 | AgentDB memory with HNSW search |
| `task` | 6 | Task creation and lifecycle |
| `session` | 7 | Session state management |
| `hooks` | 17 | Self-learning hooks + 12 workers |
| `hive-mind` | 6 | Byzantine fault-tolerant consensus |

### Quick CLI Examples

```bash
npx @claude-flow/cli@latest init --wizard
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest doctor --fix
```

## Available Agents (60+ Types)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub & Repository
`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`

## Memory Commands Reference

```bash
# Store (REQUIRED: --key, --value; OPTIONAL: --namespace, --ttl, --tags)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns

# Search (REQUIRED: --query; OPTIONAL: --namespace, --limit, --threshold)
npx @claude-flow/cli@latest memory search --query "authentication patterns"

# List (OPTIONAL: --namespace, --limit)
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Retrieve (REQUIRED: --key; OPTIONAL: --namespace)
npx @claude-flow/cli@latest memory retrieve --key "pattern-auth" --namespace patterns
```

## Quick Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

## Claude Code vs CLI Tools

- Claude Code's Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues
