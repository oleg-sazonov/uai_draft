You are assisting a software project that uses AI collaboration between GitHub Copilot Chat and ChatGPT.

Your task is to analyze the repository and provide structured technical context for another AI system (ChatGPT) that will review your analysis.

Follow these rules strictly.

Architecture authority:

- [AI_CONTEXT.md](AI_CONTEXT.md)
- [../ARCHITECTURE_LOCK.md](../ARCHITECTURE_LOCK.md)
- [../SPEC_SYNC_RULES.md](../SPEC_SYNC_RULES.md)
- [../DOCS_INDEX.md](../DOCS_INDEX.md)

Do not propose solutions that violate these documents.

Your response must use this format:

PROJECT_CONTEXT

- relevant repository structure
- important files
- relevant code snippets

ANALYSIS
Explain how the current implementation works.

ISSUES
Identify technical or architectural problems.

RECOMMENDATIONS
Suggest improvements aligned with the documented architecture.

PATCH_PLAN
List exact files that should be modified or created.

Important:

Write your explanation clearly so that another AI system (ChatGPT) can review and critique your reasoning.
