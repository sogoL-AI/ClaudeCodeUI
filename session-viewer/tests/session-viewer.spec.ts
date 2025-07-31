import { test, expect } from '@playwright/test';

test.describe('Session Viewer', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('http://localhost:3002');
  });

  test('should load and display session data', async ({ page }) => {
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Claude Code Session Viewer');
    
    // Check if session metadata is displayed
    await expect(page.locator('text=Session ID:')).toBeVisible();
    await expect(page.locator('text=Messages:')).toBeVisible();
    await expect(page.locator('text=Extracted:')).toBeVisible();
  });

  test('should display main conversation', async ({ page }) => {
    // Check if main conversation section is visible
    await expect(page.locator('text=Main Conversation')).toBeVisible();
    
    // Check for message components
    const messageElements = page.locator('[data-testid="message"]').or(page.locator('.whitespace-pre-wrap'));
    await expect(messageElements.first()).toBeVisible();
  });

  test('should allow toggling subagent conversations', async ({ page }) => {
    // Check if the subagent toggle is present
    const toggleCheckbox = page.locator('input[type="checkbox"]');
    await expect(toggleCheckbox).toBeVisible();
    
    // Test toggling
    const isChecked = await toggleCheckbox.isChecked();
    await toggleCheckbox.click();
    await expect(toggleCheckbox).toBeChecked(!isChecked);
  });

  test('should handle expandable message details', async ({ page }) => {
    // Look for "Details" buttons
    const detailsButtons = page.locator('button:has-text("Details")');
    
    if (await detailsButtons.count() > 0) {
      const firstDetailsButton = detailsButtons.first();
      await firstDetailsButton.click();
      
      // Check if details section expands
      await expect(page.locator('text=Usage Statistics').or(page.locator('text=Thinking'))).toBeVisible();
    }
  });

  test('should display user and assistant messages differently', async ({ page }) => {
    // Check for user avatars
    const userElements = page.locator('text=User').or(page.locator('[class*="blue"]'));
    
    // Check for assistant avatars  
    const assistantElements = page.locator('text=Claude').or(page.locator('text=Subagent')).or(page.locator('[class*="purple"]'));
    
    // At least one of each should be visible
    await expect(userElements.first()).toBeVisible();
    await expect(assistantElements.first()).toBeVisible();
  });

  test('should not show loading spinner after data loads', async ({ page }) => {
    // Wait a moment for loading to complete
    await page.waitForTimeout(2000);
    
    // Loading spinner should not be visible
    await expect(page.locator('.animate-spin')).not.toBeVisible();
  });

  test('should display timestamps', async ({ page }) => {
    // Look for timestamp elements
    const timestamps = page.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}/');
    await expect(timestamps.first()).toBeVisible();
  });
});