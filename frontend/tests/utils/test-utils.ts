import { Page } from '@playwright/test';
import { testUsers } from '../fixtures/test-data';

export async function loginAsUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Wait for OTP input and verify
  await page.waitForSelector('label:has-text("Enter OTP")');
  await page.getByLabel('Enter OTP').fill('123456');
  await page.getByRole('button', { name: 'Verify OTP' }).click();
  
  // Wait for login to complete
  await page.waitForSelector('button:has-text("Logout")');
}

export async function loginAsAdmin(page: Page) {
  await loginAsUser(page, testUsers.admin.email, testUsers.admin.password);
}

export async function loginAsCustomer(page: Page) {
  await loginAsUser(page, testUsers.customer.email, testUsers.customer.password);
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForSelector('a:has-text("Login")');
}

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/${name}.png` });
}

export async function addProductToCart(page: Page, productName: string) {
  await page.goto('/products');
  await page.getByText(productName).first().click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
}

export async function fillShippingInfo(page: Page, info: {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}) {
  await page.getByLabel('Full Name').fill(info.fullName);
  await page.getByLabel('Address').fill(info.address);
  await page.getByLabel('City').fill(info.city);
  await page.getByLabel('Postal Code').fill(info.postalCode);
  await page.getByLabel('Country').selectOption(info.country);
}

export async function fillPaymentInfo(page: Page, info: {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}) {
  await page.getByLabel('Card Number').fill(info.cardNumber);
  await page.getByLabel('Expiry Date').fill(info.expiryDate);
  await page.getByLabel('CVC').fill(info.cvc);
}

export async function createTestProduct(page: Page, product: {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
}) {
  await page.goto('/admin/products/new');
  await page.getByLabel('Product Name').fill(product.name);
  await page.getByLabel('Description').fill(product.description);
  await page.getByLabel('Price').fill(product.price);
  await page.getByLabel('Category').selectOption(product.category);
  await page.getByLabel('Stock').fill(product.stock);
  await page.getByRole('button', { name: 'Create Product' }).click();
} 