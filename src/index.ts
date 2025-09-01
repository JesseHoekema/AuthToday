import puppeteer from 'puppeteer';
import fastify from 'fastify';

const app = fastify();

app.post('/get-token', async (req, res) => {
  const { organisatie, username, password } = req.body;

  if (!organisatie || !username || !password) {
    return res.status(400).send({ error: 'Missing required parameters' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://inloggen.somtoday.nl');
    await page.waitForSelector('#organisatieSearchField');
    await page.type('#organisatieSearchField', organisatie);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await page.waitForSelector('#tenantdropdownwrapper li');
    await page.click('#tenantdropdownwrapper li:first-child');
    await page.waitForSelector('.button-bar a');
    await page.click('.button-bar a');
    await page.waitForSelector('#usernameField');
    await page.type('#usernameField', username);
    await page.waitForSelector('.button-bar a');
    await page.click('.button-bar a');
    await page.waitForNavigation();

    const currentUrl = page.url();

    if (currentUrl.startsWith('https://login.microsoftonline.com/')) {
      await page.waitForSelector('#i0118');
      await page.type('#i0118', password);
      await page.waitForSelector('#idSIButton9');
      await page.click('#idSIButton9');
      await page.waitForNavigation();

      const wrongpass = await page.$('#passwordError');
      if (wrongpass) {
        const passtext = await wrongpass.evaluate((el) => el.textContent);
        await browser.close();
        return res.status(401).send({ error: `Password error: ${passtext}` });
      }

      await page.waitForSelector('#heading');
      const headingText = await page.$eval('#heading', el => el.textContent?.trim() || '');
      
      if (headingText === "Laten we uw account veilig houden") {
        await page.waitForSelector('#idSubmit_ProofUp_Redirect');
        await page.click('#idSubmit_ProofUp_Redirect');
        await page.waitForSelector('button.L0g5CbGcDigQv3yxT1b_');
        await page.click('button.L0g5CbGcDigQv3yxT1b_');
        await page.waitForNavigation();
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const accessToken = await page.evaluate(() => {
          return Object.keys(localStorage)
            .filter(key => key.includes('CapacitorStorage'))
            .map(key => {
              try {
                const data = JSON.parse(localStorage.getItem(key) || '');
                return data?.access_token || null;
              } catch {
                return null;
              }
            })
            .find(token => token !== null) || null;
        });

        await browser.close();
        return res.send({ accessToken });
      } else {
        await browser.close();
        return res.status(401).send({ error: 'This step is not supported and added yet' });
      }
    } else {
      await browser.close();
      return res.status(401).send({ error: 'This step is not supported and added yet' });
    }

  } catch (error) {
    if (browser) await browser.close();
    return res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on ${address}`);
});