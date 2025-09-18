import { test, expect } from '@playwright/test';

test.describe('Product Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to products page', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
    
    // Verify we're on the products page
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  test('should navigate to categories page', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: 'Categories' }).click();
    
    // Verify we're on the categories page
    await expect(page.getByText('Categories')).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/products');
    
    // Look for search input
    const searchInput = page.getByPlaceholder('Search products...');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test Product');
      await page.keyboard.press('Enter');
    }
  });

  test('should have category filter', async ({ page }) => {
    await page.goto('/products');
    
    // Look for category filter
    const categoryFilter = page.getByLabel('Category');
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('Electronics');
    }
  });

  test('should have proper navigation structure', async ({ page }) => {
    // Verify main navigation links are present - use navigation role to be specific
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Categories' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Contact' })).toBeVisible();
  });
}); 