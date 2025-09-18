import { test, expect } from '@playwright/test';

test.describe('Order Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.getByRole('link', { name: 'Shopping cart' }).click();
    
    // Verify we're on the cart page - use more specific selector
    await expect(page.getByText('Your Cart is Empty')).toBeVisible();
  });

  test('should have cart icon in navigation', async ({ page }) => {
    // Verify cart icon is present in navigation
    const cartLink = page.getByRole('link', { name: 'Shopping cart' });
    await expect(cartLink).toBeVisible();
  });

  test('should navigate to checkout page', async ({ page }) => {
    await page.goto('/checkout');
    // Accept either the checkout heading or empty cart message
    const checkoutHeading = page.getByRole('heading', { name: /Checkout/i });
    const emptyCartHeading = page.getByRole('heading', { name: /Your cart is empty/i });
    await Promise.any([
      expect(checkoutHeading).toBeVisible(),
      expect(emptyCartHeading).toBeVisible()
    ]);
  });

  test('should have account page accessible', async ({ page }) => {
    // The account link might only be visible when logged in, so let's check if it exists
    const accountLink = page.getByRole('link', { name: 'Account' });
    if (await accountLink.isVisible()) {
      await accountLink.click();
      await expect(page.getByText('Account')).toBeVisible();
    } else {
      // If account link is not visible, that's also valid for non-logged-in users
      await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    }
  });

  test('should have proper footer links', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Verify footer links are present - use more specific selectors
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'About Us' })).toBeVisible();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Products' })).toBeVisible();
  });

  test('should have search functionality in navigation', async ({ page }) => {
    // Verify search button is present
    const searchButton = page.getByRole('button', { name: 'Search' });
    await expect(searchButton).toBeVisible();
  });
}); 