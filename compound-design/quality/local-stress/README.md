# Local Stress Lane

This lane is optional and zero-API-cost when a compatible local model is already available.

It is useful for finding prompt fragility, routing mistakes, obvious regressions and overfitting before paid/controlled E2 runs.

It does **not** promote a Claude/Codex/OpenAI/Anthropic-targeted resource to E2 because the runtime is different.

Label results as `LOCAL-STRESS`, record model/version/hardware, and keep CEL unchanged unless the formal CEL requirements are independently met.

Suggested harness: Promptfoo with an Ollama or llama.cpp provider, cache disabled for repeated behavior checks.
