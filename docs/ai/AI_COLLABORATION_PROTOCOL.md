# AI Collaboration Protocol

This project uses two AI systems:

- ChatGPT (architecture reasoning)
- GitHub Copilot Chat (repository-aware analysis)

A human mediator transfers information between them.

---

# Roles

ChatGPT

- architecture reasoning
- system design validation
- documentation consistency

GitHub Copilot Chat

- repository inspection
- code analysis
- implementation assistance

---

# Standard Response Format

All AI responses should follow this structure:

PROJECT_CONTEXT
(files, structure, relevant code)

ANALYSIS
(explain how the current implementation works)

ISSUES
(potential problems)

RECOMMENDATIONS
(proposed improvements)

PATCH_PLAN
(files to change or create)

---

# Architecture Authority

When making decisions, the following documents override AI suggestions:

1. [AI_CONTEXT.md](AI_CONTEXT.md)
2. [../ARCHITECTURE_LOCK.md](../ARCHITECTURE_LOCK.md)
3. [../SPEC_SYNC_RULES.md](../SPEC_SYNC_RULES.md)
4. [../DOCS_INDEX.md](../DOCS_INDEX.md)

These documents define the authoritative architecture.

---

# Collaboration Workflow

1. ChatGPT generates a prompt for Copilot.
2. Copilot analyzes the repository.
3. The mediator transfers the Copilot output to ChatGPT.
4. ChatGPT reviews and refines the solution.

This loop may repeat until the solution is validated.
