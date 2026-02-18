const { chromium } = require('playwright');

(async () => {
  console.log('Starting Aiven database setup...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to Aiven login page
    console.log('Navigating to Aiven login page...');
    await page.goto('https://console.aiven.io/login');
    
    // Wait for login form to appear
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Enter email
    console.log('Entering email...');
    await page.fill('input[type="email"]', 'gowthamnaidu979@gmail.com');
    
    // Enter password
    console.log('Entering password...');
    await page.fill('input[type="password"]', 'Gowtha0987@');
    
    // Click login button
    console.log('Clicking login button...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to console
    await page.waitForURL('https://console.aiven.io/account/*', { timeout: 30000 });
    console.log('Login successful!');
    
    // Navigate to the project
    console.log('Navigating to project...');
    await page.goto('https://console.aiven.io/account/a595a6228864/project/gowthamnaidu979-d4f5/services');
    await page.waitForLoadState('networkidle');
    
    // Check if service already exists
    const existingService = await page.locator('text=netflix-bot-db').count();
    
    if (existingService === 0) {
      console.log('Creating new PostgreSQL service...');
      
      // Click "Add service" or "Create service" button
      await page.click('button:has-text("Add service"), button:has-text("Create service")');
      
      // Wait for service type selection
      await page.waitForSelector('[data-testid="service-type-option"], .service-type-option', { timeout: 10000 });
      
      // Select PostgreSQL
      console.log('Selecting PostgreSQL...');
      await page.click('text=PostgreSQL');
      
      // Wait for next step
      await page.waitForTimeout(2000);
      
      // Fill in service details
      console.log('Filling service details...');
      
      // Service name
      await page.fill('input[name="service_name"], input[placeholder*="name"], input[placeholder*="Service"]', 'netflix-bot-db');
      
      // Select region (us-east-1 if available)
      try {
        const regionSelect = await page.waitForSelector('select[name="region"], .region-select', { timeout: 5000 });
        await regionSelect.selectOption('us-east-1');
      } catch (e) {
        console.log('Region selection not found or default selected');
      }
      
      // Select plan (free tier if available)
      try {
        const planSelect = await page.waitForSelector('select[name="plan"], .plan-select', { timeout: 5000 });
        // Try to select the first free/development plan
        const freePlans = ['free', 'startup', 'hobby', 'development'];
        let planSelected = false;
        
        for (const plan of freePlans) {
          try {
            await planSelect.selectOption(plan);
            planSelected = true;
            console.log(`Selected plan: ${plan}`);
            break;
          } catch (e) {
            // Continue to next plan
          }
        }
        
        if (!planSelected) {
          // Try any available plan
          const options = await planSelect.locator('option').all();
          if (options.length > 1) {
            await planSelect.selectOption({ index: 1 });
            console.log('Selected first available plan');
          }
        }
      } catch (e) {
        console.log('Plan selection not found or using default');
      }
      
      // Create service
      console.log('Creating service...');
      await page.click('button:has-text("Create service"), button[type="submit"]');
      
      // Wait for service to be created (may take a few minutes)
      console.log('Waiting for service to be created (this may take 2-3 minutes)...');
      await page.waitForSelector('text=netflix-bot-db', { timeout: 300000 }); // 5 minutes timeout
      
      console.log('Service created successfully!');
    } else {
      console.log('Service netflix-bot-db already exists, using it.');
    }
    
    // Wait for service to be ready
    console.log('Waiting for service to be ready...');
    await page.waitForFunction(
      () => {
        const statusText = document.querySelector('text=netflix-bot-db')?.parentElement?.textContent?.toLowerCase() || '';
        return statusText.includes('running') || statusText.includes('online') || statusText.includes('healthy');
      },
      { timeout: 300000 }
    );
    
    console.log('Service is ready!');
    
    // Get service credentials
    console.log('Getting service credentials...');
    
    // Click on the service to view details
    await page.click('text=netflix-bot-db');
    
    // Wait for service page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Get connection details
    const credentials = {
      host: null,
      port: null,
      database: null,
      username: null,
      password: null,
    };
    
    // Try to find connection info
    try {
      const hostEl = await page.waitForSelector('text=Host, text=hostname', { timeout: 10000 });
      credentials.host = await page.locator('text=Host, text=hostname').first().textContent();
    } catch (e) {
      console.log('Could not find host automatically');
    }
    
    try {
      const portEl = await page.waitForSelector('text=Port', { timeout: 5000 });
      credentials.port = await page.locator('text=Port').first().textContent();
    } catch (e) {
      console.log('Could not find port automatically');
    }
    
    try {
      const dbEl = await page.waitForSelector('text=Database', { timeout: 5000 });
      credentials.database = await page.locator('text=Database').first().textContent();
    } catch (e) {
      console.log('Could not find database name automatically');
    }
    
    try {
      const userEl = await page.waitForSelector('text=Username, text=User', { timeout: 5000 });
      credentials.username = await page.locator('text=Username, text=User').first().textContent();
    } catch (e) {
      console.log('Could not find username automatically');
    }
    
    // Download CA certificate
    try {
      console.log('Downloading CA certificate...');
      await page.click('text=CA certificate, text=SSL certificate, text=Download');
      console.log('Certificate download initiated');
    } catch (e) {
      console.log('Could not download certificate automatically');
    }
    
    console.log('\n=== Aiven Database Credentials ===');
    console.log('Please manually collect the following information from the Aiven console:');
    console.log('1. Host: Found in Connection Info section');
    console.log('2. Port: Found in Connection Info section (usually 5432 for PostgreSQL)');
    console.log('3. Database name: Found in Connection Info section (usually "defaultdb")');
    console.log('4. Username: Found in Connection Info section');
    console.log('5. Password: Found in Connection Info section (click "Generate" if needed)');
    console.log('6. Download CA certificate from the SSL section\n');
    console.log('Keep this browser open to collect the credentials!');
    
  } catch (error) {
    console.error('Error during setup:', error);
    console.log('\nPlease manually complete the database setup at:');
    console.log('https://console.aiven.io/account/a595a6228864/project/gowthamnaidu979-d4f5/services');
  }
})();