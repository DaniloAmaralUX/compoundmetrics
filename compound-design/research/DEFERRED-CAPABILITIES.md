# Deferred capabilities

Capabilities considered for `v0.3.0-alpha.1` and deliberately **not** built. Each entry records what it would do, why it waits, and the condition that would justify building it. Catalogue size is not a goal: a skill exists when a procedure has a consumer.

## Deferred for v0.3.0-alpha.1

| Capability | What it would do | Why deferred | Build when |
| --- | --- | --- | --- |
| Full-pipeline autorunner | Chain Frame → Model → Build → Verify → Polish → Compound in one unattended run | The individual procedures have no runtime evidence yet. Chaining unproven steps multiplies unproven behaviour and hides where a failure happened. | The core six have been used on real work and their handoffs are stable |
| Product pulse | Read analytics, tracing and payment sources into a recurring product-health report | Needs external data sources and credentials this project does not have, and it is product analytics rather than design engineering | A real product with instrumented metrics is being run through the loop |
| Feedback sweep | Turn external feedback (issues, chat, email) into planned work | Requires connectors, durable state and a lease protocol; no consumer today | Compound Design is used on a project with inbound external feedback |
| Debug | Structured reproduction-first defect investigation | The host's own debugging is adequate; a wrapper here would be ceremony | A reproducible class of design-engineering defect recurs and a procedure would prevent rediscovery |
| Prototype | Build several genuinely different versions behind a picker | Overlaps Model and Polish; the boundary is not yet clear enough to test | Model has run enough times to show where option generation is actually missing |
| Bake-off / cross-model comparison | Run the same task on several models and compare | It spends model budget by construction, and the E2 pilot already owns controlled comparison | Paid runtime is authorised and the E2 harness has run once |
| Doc review | Review documentation with the reviewer roster | Verify already covers the artifacts this project writes | Documentation becomes a deliverable with its own quality bar |
| Ideation | Generate and rank product ideas upstream of Frame | Strategy plus Frame covers the current need | Frame runs repeatedly with nothing upstream to ground it |
| PR babysitting / CI autofix | Watch a pull request and drive it to green | Host-level capability, not a design-engineering procedure | Never, unless the loop itself needs it |
| Additional plugin hosts | OpenCode, Kimi, Grok, Devin, Antigravity, Pi and others | Three hosts are first class; more manifests without a user is maintenance without a consumer | A user asks for that host |
| Trigger evaluation | Measure whether a skill is invoked when it should be | It requires model runtime, and the tooling for it has known measurement-integrity issues | Paid runtime is authorised, after the E2 pilot |
| Construction audit automation | Score CDQI mechanically | CDQI is a judged construction score; automating it would invent precision | Never, unless the rubric becomes mechanically checkable |

## Rejected outright

| Capability | Why |
| --- | --- |
| Plugin format converter | All three supported hosts read the same canonical `skills/` directory through their own manifest. A converter would have no target. |
| Skill-count parity with any upstream | A catalogue is not capability. Every skill added without a consumer is maintenance and routing noise. |
| Decorative persona agents | An agent that only renames a procedure adds routing cost and no specialisation. |

## Rule

Adding any capability above requires the same discipline as any other Compound Design change: a reproduced need, an explicit contract, deterministic tests, and an entry in the registry starting at `E0`.
