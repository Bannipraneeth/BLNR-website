# E-commerce Application Test Suite

This directory contains end-to-end tests for the e-commerce application using Playwright.

## Test Structure

- `auth.spec.ts`: Authentication tests (login, register, logout)
- `products.spec.ts`: Product management tests (CRUD operations)
- `orders.spec.ts`: Order management tests (cart, checkout, order history)
- `utils/test-utils.ts`: Common test utilities and helper functions
- `fixtures/test-data.ts`: Test data and fixtures

## Prerequisites

1. Node.js (v14 or higher)
2. npm or yarn
3. Playwright browsers installed

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

1. Start the development server:
```bash
npm run dev
```

2. In a separate terminal, run the tests:
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test auth.spec.ts
```

## Test Data

Test data is managed in `fixtures/test-data.ts`. This includes:
- Test user credentials
- Test product data
- Test shipping information
- Test payment information

## Writing New Tests

1. Create a new test file in the `tests` directory
2. Import necessary utilities from `utils/test-utils.ts`
3. Use test data from `fixtures/test-data.ts`
4. Follow the existing test patterns

Example:
```typescript
import { test, expect } from '@playwright/test';
import { loginAsCustomer } from './utils/test-utils';
import { testProducts } from './fixtures/test-data';

test.describe('New Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test('should perform new feature action', async ({ page }) => {
    // Test implementation
  });
});
```

## Best Practices

1. Use test utilities for common operations
2. Keep tests independent and isolated
3. Use meaningful test descriptions
4. Clean up test data after tests
5. Use appropriate assertions
6. Handle async operations properly

## Debugging Tests

1. Use the Playwright Inspector:
```bash
PWDEBUG=1 npm test
```

2. Use the UI mode:
```bash
npm run test:ui
```

3. Use debug mode:
```bash
npm run test:debug
```

## Continuous Integration

Tests are automatically run in CI/CD pipeline. Make sure all tests pass before merging changes.

## Troubleshooting

1. If tests fail due to browser issues:
```bash
npx playwright install --force
```

2. If tests are flaky:
- Add appropriate wait conditions
- Use more reliable selectors
- Check for race conditions

3. If tests are slow:
- Use appropriate test isolation
- Optimize test data setup
- Use parallel test execution where possible 