---
id: CD-SOL-20260101-01
title: Forms fail silently when the CSRF token is missing after a deploy split
date: 2026-01-01
areas: [forms, deploy]
concepts: [csrf, session, token]
applies_to: Any form posting to an origin served by a different deploy than the one that rendered it.
signals: ["InvalidAuthenticityToken", "csrf_token", "422 Unprocessable"]
supersedes: null
status: active
---

FIXTURE — not a real learning.

Expected: the form posts and the user sees a confirmation. Observed: the request returned 422 and the interface showed nothing at all, because the error branch rendered an empty string.

Mechanism: splitting the deploy put the rendering origin and the posting origin on different sessions, so the token no longer matched. The silent part was a separate defect — an unhandled error state — and it is what made the first one expensive to find.

Next time: check the error branch renders something before assuming the request succeeded, and treat a token mismatch across origins as the first hypothesis when a form does nothing.
