---
name: clerk-testing
description: E2E testing for Clerk apps. Use with Playwright or Cypress for auth flow
  tests.
allowed-tools: WebFetch
license: MIT
metadata:
  author: clerk
  version: 1.2.0
compatibility: Requires CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY for clerkSetup() automatic setup. CLERK_TESTING_TOKEN is optional — clerkSetup() can generate it, or you can inject it manually via setupClerkTestingToken().
---

# Testing

## Decision Tree

| Framework | Documentation |
|-----------|---------------|
| Overview | https://clerk.com/docs/guides/development/testing/overview |
| Playwright | https://clerk.com/docs/guides/development/testing/playwright/overview |
| Cypress | https://clerk.com/docs/guides/development/testing/cypress/overview |

## Mental Model

Test auth = isolated session state. Each test needs fresh auth context.
- `clerkSetup()` initializes test environment
- `setupClerkTestingToken()` bypasses bot detection
- `storageState` (Playwright) persists auth between tests for speed

> **Security:** Never commit `storageState` files. Save them in a dedicated directory (e.g. `e2e/.auth/`) and add that directory to `.gitignore`. Ensure CI workflows do not publish auth state as artifacts.

## Workflow

1. Identify test framework (Playwright or Cypress)
2. WebFetch the appropriate URL from decision tree above
3. Follow official setup instructions
4. Use `pk_test_*` and `sk_test_*` keys only

## Best Practices

- Use `setupClerkTestingToken()` before navigating to auth pages
- Use test API keys: `pk_test_xxx`, `sk_test_xxx`
- Save auth state with `storageState` (Playwright) for faster tests — never commit it
- Use `page.waitForSelector('[data-clerk-component]')` for Clerk UI

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Production keys in tests | Security risk | Use `pk_test_*` keys |
| No `setupClerkTestingToken()` | Auth fails | Call before navigation |
| UI-based sign-in every test | Slow tests | Use `storageState` (Playwright) or `cy.session()` (Cypress) |

## Framework-Specific

**Playwright**: Use a serial setup project in `global.setup.ts` so `clerkSetup()` environment variables reach test workers. Configure test projects to depend on this setup project, then use `setupClerkTestingToken()` in tests.

```typescript
// global.setup.ts
import { clerkSetup } from '@clerk/testing/playwright'
import { test as setup } from '@playwright/test'

setup('clerk', async () => {
  await clerkSetup()
})
```

```typescript
// playwright.config.ts (relevant excerpt)
projects: [
  { name: 'setup', testMatch: /global\.setup\.ts/ },
  {
    name: 'e2e',
    dependencies: ['setup'],
    use: { storageState: 'e2e/.auth/user.json' },
  },
]
```

**Cypress**: Use `@clerk/testing/cypress` helpers and Testing Tokens with `cy.session()` for auth state management.

```typescript
// cypress/support/e2e.ts
import { addClerkCommands } from '@clerk/testing/cypress'
addClerkCommands({ Cypress, cy })
```

```typescript
// In tests, use setupClerkTestingToken() before visiting pages
cy.setupClerkTestingToken()
cy.visit('/dashboard')
```

## See Also

- `clerk-setup` - Install Clerk before adding tests
- `clerk-nextjs-patterns` - Next.js patterns being tested
- [Demo Repo](https://github.com/clerk/clerk-playwright-nextjs/tree/main/e2e)
