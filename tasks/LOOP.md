# LOOP.md — the Strudel Flow agent loop

You are an autonomous coding agent working on **Strudel Flow**. Run the loop below **one
iteration at a time**. Each iteration completes exactly one atomic task and produces exactly one
commit. If anything is risky, ambiguous, or destructive, **stop and ask a human**.

## Before you start

- Read [`../ROADMAP.md`](../ROADMAP.md) (vision + phases) and
  [`README.md`](./README.md) (task schema + lifecycle).
- Obey repo conventions in [`../CLAUDE.md`](../CLAUDE.md) and
  [`../ARCHITECTURE.md`](../ARCHITECTURE.md). Honor the decisions in
  [`../docs/decisions/`](../docs/decisions/).

## The loop

1. **Scan.** Read [`STATUS.md`](./STATUS.md) and the `tasks/*.md` frontmatter.

2. **Select the next task.** From all tasks where `status: todo` **and** every `depends_on` task
   is `done`, choose the one with the **lowest `priority`**, breaking ties by **lowest ID**
   (e.g. `P1-001` before `P1-002`). If no task is eligible, **stop and report** (nothing to do,
   or everything remaining is blocked).

3. **Claim it.** Set the task's `status: doing` in its file and update [`STATUS.md`](./STATUS.md).

4. **Implement — in scope only.** Do exactly what the task's *Why* / *Acceptance Criteria*
   describe. Reuse existing utilities (see *Implementation Notes*). No scope creep, no drive-by
   refactors, no unrelated "improvements".

5. **Run the gate.** Run `pnpm verify`
   (`tsc --noEmit && pnpm lint && pnpm test:run && pnpm build`).
   - If it fails, fix **within the task's scope** and re-run.
   - If you cannot make it pass within scope, set `status: blocked`, append a `## Blocked` note
     explaining why, update `STATUS.md`, and go back to step 2 to pick another task.
   - **Never** weaken, skip, or comment out checks to make the gate pass.

6. **Finish.** When `pnpm verify` is green **and** every acceptance-criteria checkbox is ticked:
   - Set `status: done` and tick the criteria in the task file.
   - Update `STATUS.md`.
   - Append a one-line progress entry (date + task ID + title) to the progress log at the bottom
     of `STATUS.md`.
   - If the change is architectural, update `ARCHITECTURE.md` / `README.md` and add/adjust an ADR
     in `docs/decisions/`.

7. **Commit (one task = one commit).** Stage the task file changes **and** the code together and
   commit with a message like `P1-001: <title>`. Then push with the repo workflow
   (`git` + `jf submit`). **Stop and ask a human** before any destructive or hard-to-reverse git
   action.

8. **Repeat** from step 1.

## Guardrails (always)

- Stay strictly within the selected task's scope.
- Never weaken `pnpm verify` to make it pass.
- Prefer reusing existing utilities over writing new ones.
- One task per commit; keep tasks atomic and reviewable.
- Stop for human input on anything risky, ambiguous, or destructive.
