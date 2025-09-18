import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign Up' }).click();
    
    // Verify we're on the registration page
    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password').first()).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    
    // Verify we're on the login page
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should show login form with proper fields', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    
    // Fill in the form fields
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('Test@123');
    
    // Verify the form is filled correctly
    await expect(page.getByLabel('Email address')).toHaveValue('test@example.com');
    await expect(page.getByLabel('Password')).toHaveValue('Test@123');
  });

  test('should show registration form with proper fields', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign Up' }).click();
    
    // Fill in the form fields
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').first().fill('Test@123');
    await page.getByLabel('Confirm Password').fill('Test@123');
    
    // Verify the form is filled correctly
    await expect(page.getByLabel('Full Name')).toHaveValue('Test User');
    await expect(page.getByLabel('Email address')).toHaveValue('test@example.com');
    await expect(page.getByLabel('Password').first()).toHaveValue('Test@123');
    await expect(page.getByLabel('Confirm Password')).toHaveValue('Test@123');
  });

  test('should have proper navigation links', async ({ page }) => {
    // Verify Login link is visible
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    
    // Verify Sign Up link is visible
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });
}); 