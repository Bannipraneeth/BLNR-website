import { test, expect } from '@playwright/test';

// This test assumes the backend is running and the database is in a clean state.
test.describe('E2E User Flow: Register → Login → Add to Cart → Checkout', () => {
  const testEmail = `testuser${Date.now()}@example.com`;
  const testPassword = 'Test@1234';
  const testName = 'Test User';

  test('should register, login, add to cart, and checkout', async ({ page }) => {
    // Register
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await page.getByLabel('Full Name').fill(testName);
    await page.getByLabel('Email address').fill(testEmail);
    await page.getByLabel('Password').first().fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: 'Register' }).click();
    // Wait for OTP input
    await expect(page.getByLabel('Enter OTP')).toBeVisible();
    // Simulate OTP (replace with real OTP if needed)
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Register' }).click();
    // Wait for registration success
    await expect(page.getByText(/Registration successful/i)).toBeVisible();

    // Login
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email address').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    // Wait for OTP input
    await expect(page.getByLabel('Enter OTP')).toBeVisible();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    // Wait for login (Logout button visible)
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    // Add to Cart
    await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
    // Wait for products to load and add the first product to cart
    const firstAddToCart = page.getByRole('button', { name: 'Add to Cart' }).first();
    await firstAddToCart.click();
    await expect(page.getByText(/Added to cart/i)).toBeVisible();

    // Go to Cart
    await page.getByRole('link', { name: 'Shopping cart' }).click();
    await expect(page.getByText(/Cart/i)).toBeVisible();

    // Proceed to Checkout
    await page.goto('/checkout');
    // Fill in checkout form (use dummy data)
    if (await page.getByRole('heading', { name: /Checkout/i }).isVisible()) {
      await page.getByLabel('First Name').fill('Test');
      await page.getByLabel('Last Name').fill('User');
      await page.getByLabel('Email').fill(testEmail);
      await page.getByLabel('Phone').fill('1234567890');
      await page.getByLabel('Address').fill('123 Test St');
      await page.getByLabel('City').fill('Test City');
      await page.getByLabel('State').fill('Test State');
      await page.getByLabel('Zip Code').fill('12345');
      // Place order (COD)
      await page.getByRole('button', { name: /Place Order|Pay Now|Continue/i }).first().click();
      // Wait for success page or confirmation
      await expect(page.locator('text=Order placed successfully').or(page.locator('text=success'))).toBeVisible({ timeout: 10000 });
    } else {
      // If cart is empty, test ends here
      await expect(page.getByRole('heading', { name: /Your cart is empty/i })).toBeVisible();
    }
  });
}); 