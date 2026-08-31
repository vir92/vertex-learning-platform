---
name: clerk-testing
description: E2E testing for Clerk apps. Use with Playwright or Cypress for auth flow
  tests.
allowed-tools: WebFetch
license: MIT
metadata:
  author: clerk
  version: 1.2.0
compatibility: Requires CLERK_TESTING_TOKEN from Clerk dashboard
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
- `storageState` persists auth between tests for speed

## Workflow

1. Identify test framework (Playwright or Cypress)
2. WebFetch the appropriate URL from decision tree above
3. Follow official setup instructions
4. Use `pk_test_*` and `sk_test_*` keys only

## Best Practices

- Use `setupClerkTestingToken()` before navigating to auth pages
- Use test API keys: `pk_test_xxx`, `sk_test_xxx`
- Save auth state with `storageState` for faster tests
- Use `page.waitForSelector('[data-clerk-component]')` for Clerk UI

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Production keys in tests | Security risk | Use `pk_test_*` keys |
| No `setupClerkTestingToken()` | Auth fails | Call before navigation |
| UI-based sign-in every test | Slow tests | Use `storageState` |

## Framework-Specific

**Playwright**: Use a project-based setup (not a function-based `globalSetup` — env vars set by `clerkSetup()` don't propagate from a separate process):

```typescript
// playwright.config.ts
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  {
    name: 'e2e',
    use: { ...devices['Desktop Chrome'] },
    dependencies: ['setup'],
    // storageState file is created by the setup project before it's loaded here
    // storageState: 'playwright/.auth/user.json',
  },
]
```

```typescript
// e2e/auth.setup.ts — runs first, creates the storageState file
import { clerk, clerkSetup } from '@clerk/testing/playwright'
import { test as setup } from '@playwright/test'

setup.describe.configure({ mode: 'serial' })

setup('authenticate', async ({ page }) => {
  await clerkSetup()
  await clerk.signIn({ page, emailAddress: process.env.E2E_CLERK_USER_EMAIL! })
  await page.context().storageState({ path: 'playwright/.auth/user.json' })
})
```

Only set `storageState` in the config after the setup project writes the file (or remove it until the setup exists).

**Cypress**: Global setup in `cypress.config.ts` — `clerkSetup` retrieves the Testing Token before suites start, so `addClerkCommands` and session-based auth can use it:

```typescript
// cypress.config.ts
import { clerkSetup } from '@clerk/testing/cypress'
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return clerkSetup({ config })
    },
    baseUrl: 'http://localhost:3000',
  },
})
```

Then register commands and inject the Testing Token by importing and calling the functions directly (no `cy.` command variant exists):

```typescript
// cypress/support/e2e.ts
import { addClerkCommands, setupClerkTestingToken } from '@clerk/testing/cypress'

addClerkCommands({ Cypress, cy })

// in a test, before cy.visit():
setupClerkTestingToken()
```

## See Also

- `clerk-setup` - Install Clerk before adding tests
- `clerk-nextjs-patterns` - Next.js patterns being tested
- [Demo Repo](https://github.com/clerk/clerk-playwright-nextjs/tree/main/e2e)
