import { expect, test } from '@playwright/test';

///Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests

// Login 3 times sucessfully
test('Login multiple times sucessfully @c1', async ({ page }) => {

  await page.goto('/');
  await page.locator(`//*[@href='/challenge1.html']`).click();
  
  // Login multiple times
  for (let i = 1; i <= 3; i++) {

    await page.locator('#email').fill(`test${i}@example.com`);
    await page.locator('#password').fill(`password${i}`);
    
    await page.locator('#submitButton').click();
    
    // Wait for the success message to appear by checking for the 'show' class
    await expect(page.locator('#successMessage.show')).toBeVisible();
    
    // Verify the success message contains the correct information
    await expect(page.locator('#emailDisplay')).toContainText(`Email: test${i}@example.com`);
    await expect(page.locator('#passwordDisplay')).toContainText(`Password: password${i}`);
    
    // Wait for the success message to disappear
    await expect(page.locator('#successMessage.show')).toBeHidden();
    
    // If this isn't the last iteration, wait for the form to be reset and ready
    if (i < 3) {
      // Wait for the form to be reset (fields empty)
      await expect(page.locator('#email')).toHaveValue('');
      
      // Wait for the submit button to be ready again (not in loading state)
      await expect(page.locator('#submitButton.loading')).toBeHidden();
      await expect(page.locator('#submitButton')).toBeEnabled();
    }
  }
});

// Login and logout successfully with animated form and delayed loading
test('Login animated form and logout sucessfully @c2', async ({ page }) => {

  await page.goto('/');
  await page.locator(`//*[@href='/challenge2.html']`).click();
  
  // Wait for the form to be visible before proceeding
  await expect(page.locator('#mainForm')).toBeVisible();
  
  await page.locator('#email').fill('test1@example.com');
  await page.locator('#password').fill('password1');
  
  // Handle the animated button by using the Enter key to submit the form
  await page.locator('#password').press('Enter');
  
  // Assert that button becomes disabled after submission
  await expect(page.locator('#submitButton')).toBeDisabled();
  
  // Assert that dashboard appears after login (delayed loading)
  await expect(page.locator('#dashboard')).toBeVisible();
  
  // Assert that user email is displayed correctly
  await expect(page.locator('#userEmail')).toContainText('test1@example.com');
  
  // Wait for menu button to be clickable (handles delayed initialization)
  await expect(page.locator('#menuButton[data-initialized="true"]')).toBeVisible();
  
  // Open menu and verify it appears
  await page.locator('#menuButton').click();
  await expect(page.locator('#accountMenu.show')).toBeVisible();
  
  // Click logout option
  await page.locator('#logoutOption').click();
  
  // Assert we're back at the login form
  await expect(page.locator('#loginForm')).toBeVisible();
  await expect(page.locator('#dashboard')).toBeHidden();
  
  // Assert that the button is re-enabled after logout
  await expect(page.locator('#submitButton')).toBeEnabled();
});

// Fix the Forgot password test and add proper assertions
test('Forgot password @c3', async ({ page }) => {

  await page.goto('/');
  await page.locator(`//*[@href='/challenge3.html']`).click();
  
  // Verify initial login form is visible
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  
  // Click on Forgot Password link
  await page.getByRole('button', { name: 'Forgot Password?' }).click();
  
  // Wait for the reset password form to appear
  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  
  // Verify we're on the forgot password form by checking for specific elements
  await expect(page.getByRole('button', { name: 'Reset Password' })).toBeVisible();
  await expect(page.locator('.back-to-login')).toBeVisible();
  
  // Fill in the email field
  await page.locator('#email').fill('test@example.com');
  
  // Click on Reset Password button
  await page.getByRole('button', { name: 'Reset Password' }).click();
  
  // Verify the success message appears
  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible();
  
  // Verify specific success message for password reset
  await expect(page.locator('.success-message')).toContainText('Password reset link sent!');
  
  // Verify the email is displayed in the success message
  await expect(page.locator('.success-message')).toContainText('Email: test@example.com');
  
  // Click the Close button to return to login
  await page.getByRole('button', { name: 'Close' }).click();
  
  // Verify we're back at the login form
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

//Fix the login test. Hint: There is a global variable that you can use to check if the app is in ready state
test('Login and logout @c4', async ({ page }) => {
  // Navigate to the challenge page
  await page.goto('/');
  await page.locator(`//*[@href='/challenge4.html']`).click();
  
  // Wait for the app to be ready by checking the global variable
  // Use casting to tell TypeScript about our custom property
  await page.waitForFunction(() => {
    return (window as any).isAppReady === true;
  });
  
  // Verify login form is visible
  await expect(page.locator('#loginForm')).toBeVisible();
  
  // Fill in login credentials
  await page.locator('#email').fill('test@example.com');
  await page.locator('#password').fill('password');
  
  // Submit the form
  await page.locator('#submitButton').click();
  
  // Verify login was successful - user profile is visible
  await expect(page.locator('#userProfile')).toBeVisible();
  
  // Verify the email is displayed correctly in the profile
  await expect(page.locator('#userEmail')).toContainText('test@example.com');
  
  // Open the profile menu
  await page.locator('#profileButton').click();
  
  // Verify dropdown menu appears
  await expect(page.locator('#profileMenu.show')).toBeVisible();
  
  // Click logout
  await page.getByText('Logout').click();
  
  // After logout, the app reinitializes - wait for it to be ready again
  await page.waitForFunction(() => {
    return (window as any).isAppReady === true;
  });
  
  // Verify we're back at login form
  await expect(page.locator('#loginForm')).toBeVisible();
  
  // Verify user profile is hidden
  await expect(page.locator('#userProfile')).toBeHidden();
});
