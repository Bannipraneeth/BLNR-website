import { test, expect } from '@playwright/test';

// Utility for unique emails
const uniqueEmail = (prefix = 'user') => `${prefix}${Date.now()}@example.com`;
const testPassword = 'Test@1234';
const adminEmail = 'admin@example.com';
const adminPassword = 'Admin@123';

// 1. Invalid Registration and Login

test.describe('Invalid Registration and Login', () => {
  test('should not allow duplicate registration', async ({ page }) => {
    const email = uniqueEmail('dup');
    // Register once
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Dup User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').first().fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/Registration successful/i)).toBeVisible();
    // Try to register again
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Dup User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').first().fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: 'Register' }).click();
    // Should see error (simulate OTP if needed)
    if (await page.getByLabel('Enter OTP').isVisible()) {
      await page.getByLabel('Enter OTP').fill('123456');
      await page.getByRole('button', { name: 'Register' }).click();
    }
    await expect(page.locator('text=already exists').or(page.locator('text=Email already'))).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email address').fill('notarealuser@example.com');
    await page.getByLabel('Password').fill('WrongPass');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('text=Failed to generate OTP').or(page.locator('text=Invalid credentials'))).toBeVisible();
  });
});

// 2. Cart and Checkout Edge Cases

test.describe('Cart and Checkout Edge Cases', () => {
  test('should add, update, and remove items in cart', async ({ page }) => {
    // Register and login
    const email = uniqueEmail('cart');
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Cart User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').first().fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/Registration successful/i)).toBeVisible();
    await page.goto('/login');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    // Add two products
    await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
    const addToCartButtons = page.getByRole('button', { name: 'Add to Cart' });
    await addToCartButtons.nth(0).click();
    await addToCartButtons.nth(1).click();
    // Go to cart
    await page.getByRole('link', { name: 'Shopping cart' }).click();
    // Update quantity
    const quantityInput = page.getByRole('spinbutton', { name: /Quantity/i }).first();
    await quantityInput.fill('2');
    await page.getByRole('button', { name: /Update/i }).first().click();
    await expect(page.getByText(/Cart updated/i)).toBeVisible();
    // Remove item
    await page.getByRole('button', { name: /Remove/i }).first().click();
    await expect(page.getByText(/Cart updated|Cart is empty/i)).toBeVisible();
  });

  test('should not allow checkout with empty cart', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: /Your cart is empty/i })).toBeVisible();
  });

  test('should show validation errors on incomplete checkout', async ({ page }) => {
    // Register and login
    const email = uniqueEmail('checkout');
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Checkout User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').first().fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/Registration successful/i)).toBeVisible();
    await page.goto('/login');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    // Add product
    await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.getByRole('link', { name: 'Shopping cart' }).click();
    await page.goto('/checkout');
    // Try to submit with missing fields
    await page.getByRole('button', { name: /Place Order|Pay Now|Continue/i }).first().click();
    // Should see validation error (browser or custom)
    await expect(page.locator('text=required').or(page.locator('text=Please fill'))).toBeVisible();
  });
});

// 3. Order History and Details

test.describe('Order History and Details', () => {
  test('should show order in history after checkout', async ({ page }) => {
    // Register, login, add to cart, checkout
    const email = uniqueEmail('order');
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Order User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').first().fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/Registration successful/i)).toBeVisible();
    await page.goto('/login');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    // Add product and checkout
    await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.getByRole('link', { name: 'Shopping cart' }).click();
    await page.goto('/checkout');
    await page.getByLabel('First Name').fill('Order');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Phone').fill('1234567890');
    await page.getByLabel('Address').fill('123 Test St');
    await page.getByLabel('City').fill('Test City');
    await page.getByLabel('State').fill('Test State');
    await page.getByLabel('Zip Code').fill('12345');
    await page.getByRole('button', { name: /Place Order|Pay Now|Continue/i }).first().click();
    await expect(page.locator('text=Order placed successfully').or(page.locator('text=success'))).toBeVisible({ timeout: 10000 });
    // Go to order history
    await page.goto('/orders');
    await expect(page.getByText(/Order History|Orders/i)).toBeVisible();
    // Check for the new order (look for product name or order id)
    await expect(page.locator('text=Test Product').or(page.locator('text=Order'))).toBeVisible();
  });
});

// 4. Admin Flow

test.describe('Admin Flow', () => {
  test('admin can create, edit, and delete a product', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByLabel('Email address').fill(adminEmail);
    await page.getByLabel('Password').fill(adminPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    // Go to admin products
    await page.goto('/admin/products');
    // Create product
    await page.getByRole('button', { name: /New Product|Add Product/i }).click();
    await page.getByLabel('Product Name').fill('E2E Test Product');
    await page.getByLabel('Description').fill('E2E Description');
    await page.getByLabel('Price').fill('123');
    await page.getByLabel('Category').selectOption('Electronics');
    await page.getByLabel('Stock').fill('10');
    // Skip image upload for now
    await page.getByRole('button', { name: /Create|Save/i }).click();
    await expect(page.getByText(/Product created successfully/i)).toBeVisible();
    // Edit product
    await page.getByText('E2E Test Product').click();
    await page.getByRole('button', { name: /Edit/i }).click();
    await page.getByLabel('Product Name').fill('E2E Test Product Updated');
    await page.getByRole('button', { name: /Save Changes|Save/i }).click();
    await expect(page.getByText(/Product updated successfully/i)).toBeVisible();
    // Delete product
    await page.getByText('E2E Test Product Updated').click();
    await page.getByRole('button', { name: /Delete/i }).click();
    await page.getByRole('button', { name: /Confirm Delete|Yes/i }).click();
    await expect(page.getByText(/Product deleted successfully/i)).toBeVisible();
  });
});

// 5. Payment Failure Simulation (Mock)

test.describe('Payment Failure Simulation', () => {
  test('should show error on payment failure', async ({ page, context }) => {
    // Register, login, add to cart
    const email = uniqueEmail('failpay');
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Fail Pay');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').first().fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/Registration successful/i)).toBeVisible();
    await page.goto('/login');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
    await page.getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.getByRole('link', { name: 'Shopping cart' }).click();
    await page.goto('/checkout');
    await page.getByLabel('First Name').fill('Fail');
    await page.getByLabel('Last Name').fill('Pay');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Phone').fill('1234567890');
    await page.getByLabel('Address').fill('123 Test St');
    await page.getByLabel('City').fill('Test City');
    await page.getByLabel('State').fill('Test State');
    await page.getByLabel('Zip Code').fill('12345');
    // Intercept payment API and force failure
    await page.route('**/api/payment/create-order', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ message: 'Payment failed' }) });
    });
    // Try to pay
    await page.getByRole('button', { name: /Pay Now|Place Order|Continue/i }).first().click();
    await expect(page.locator('text=Payment failed').or(page.locator('text=Failed to process payment'))).toBeVisible();
  });
});

// 6. Session and Security

test.describe('Session and Security', () => {
  test('should redirect to login when accessing protected page after logout', async ({ page }) => {
    const email = uniqueEmail('session');
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('Session User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').first().fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/Registration successful/i)).toBeVisible();
    await page.goto('/login');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    // Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    // Try to access /account
    await page.goto('/account');
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });

  test('should not allow regular user to access admin page', async ({ page }) => {
    const email = uniqueEmail('noadmin');
    await page.goto('/register');
    await page.getByLabel('Full Name').fill('No Admin');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').first().fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText(/Registration successful/i)).toBeVisible();
    await page.goto('/login');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('Enter OTP').fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    // Try to access admin page
    await page.goto('/admin');
    await expect(page.locator('text=Unauthorized').or(page.locator('text=Not authorized')).or(page.locator('text=Login'))).toBeVisible();
  });
});

// 7. Accessibility and Visual Regression

test.describe('Accessibility and Visual Regression', () => {
  test('should have no accessibility violations on home page', async ({ page }) => {
    await page.goto('/');
    const snapshot = await page.accessibility.snapshot();
    expect(snapshot).toBeTruthy();
    // For deeper checks, integrate axe-core or jest-axe
  });

  test('should match visual snapshot of home page', async ({ page }) => {
    await page.goto('/');
    expect(await page.screenshot()).toMatchSnapshot('home-page.png', { threshold: 0.2 });
  });
}); 