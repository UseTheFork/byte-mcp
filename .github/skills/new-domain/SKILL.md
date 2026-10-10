---
name: new-domain
description: 'Create and structure a new domain in byte-mcp (DDD layout under src/domains). Use when adding a new domain, a new MCP tool, a port/adapter, per-domain config, or asking where code belongs (domain, application, infrastructure, mcp).'
argument-hint: 'Domain name and first tool, e.g. "github, create_issue"'
---

# New Domain

Each domain lives in `src/domains/<name>/` and follows the same layout as `src/domains/git/`, which is the reference implementation.

## Layout

```
src/domains/<name>/
  config.ts          # zod schema + get<Name>Config()
  index.ts           # public API: adapters + register<Name>Tools only
  domain/            # entities, value objects, domain errors. No I/O, no zod, no MCP.
  application/       # use cases + ports.ts (interfaces). Depends on domain/ only.
  infrastructure/    # adapters implementing ports (CLI, HTTP, fs)
  mcp/
    register.ts      # register<Name>Tools(server, deps)
    tools/<tool>.ts  # one file per tool
```

## Dependency Rules

- `mcp` -> `application` -> `domain`. `infrastructure` implements `application/ports.ts`.
- `domain/` never imports MCP, zod, node I/O, or other domains.
- Domains never import each other. Share code through `src/shared/` only.
- Tools are thin adapters: validate input with zod, call a use case, map the result or `DomainError` to MCP `content`.
- Run external processes through `@/shared/exec.ts` (no shell). Never build command strings from tool input.
- Use the `@/` alias for cross-folder imports and `.js` extensions on all relative imports (Node16 resolution).

## Procedure

1. **Domain layer**: add entities/value objects in `domain/` and errors in `domain/errors.ts`. Errors extend `DomainError` from `@/shared/errors.ts`. Validate invariants in value-object factories (see `CommitMessage.create`).
2. **Port**: declare what the use case needs from the outside world in `application/ports.ts`.
3. **Use case**: one class per use case in `application/`, constructor takes the port, `execute(input)` returns domain types.
4. **Adapter**: implement the port in `infrastructure/`.
5. **Config** (if the domain has settings): create `config.ts` with a zod schema where every field has a `.default()` and `.describe()`. Export `get<Name>Config()` that calls `getDomainConfig("<name>", schema)` from `@/shared/config.ts`. Users set it under the `<name>` key of `<workspace>/.github/.byte.config.json`. Use the workspace path from `getConfig().workspaceDir`; never add a path input to a tool unless it is truly needed.
6. **Tool**: create `mcp/tools/<tool>.ts` exporting `register<Tool>Tool(server, useCase, config)`. Use snake_case tool and input names. Catch `DomainError` and return `{ isError: true, content: [...] }`; rethrow anything else.
   - If config toggles inputs, declare the full zod schema, `.omit()` disabled fields, and cast back to the full type (see `git-commit.ts`). Conditional spreads make handler fields `unknown`.
7. **Register**: in `mcp/register.ts`, load the config (so an invalid config fails at startup), build use cases, and register each tool.
8. **Public API**: `index.ts` exports only the adapter(s) and `register<Name>Tools`.
9. **Composition root**: in `src/server.ts`, instantiate the adapter and call `register<Name>Tools(server, adapter)`.
10. **Verify**: run `pnpm exec tsc --noEmit`, then `pnpm run build` (runs `tsc-alias` to rewrite `@/` paths).

## Checklist

- [ ] No `domain/` file imports zod, MCP, or `node:*`
- [ ] No imports between domains
- [ ] Use case depends on a port, not an adapter
- [ ] Config schema has defaults for every field, and a missing config file works
- [ ] `register<Name>Tools` is the only thing `server.ts` needs from the domain
- [ ] Type-check and build pass
