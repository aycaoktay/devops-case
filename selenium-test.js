const { Builder, By, until, Capabilities } = require('selenium-webdriver');
require('chromedriver');

(async function example() {
  // Chrome için opsiyonları ayarla
  let chromeCapabilities = Capabilities.chrome();
  let options = chromeCapabilities.set('chromeOptions', {
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  // WebDriver'ı başlat
  let driver = await new Builder()
    .forBrowser('chrome')
    .withCapabilities(options)
    .build();

  try {
    console.log('Navigating to the application...');
    await driver.get('http://74.248.83.42/aycaoktay/devops-case');

    console.log('Searching for city input...');
    let cityInput = await driver.findElement(By.className('cityInput'));
    await cityInput.sendKeys('Mersin');

    console.log('Clicking the search icon...');
    let searchIcon = await driver.findElement(By.className('search-icon'));
    await searchIcon.click();

    console.log('Waiting for weather location to be located...');
    await driver.wait(until.elementLocated(By.className('weather-location')), 10000);

    console.log('Fetching weather location text...');
    let locationText = await driver.findElement(By.className('weather-location')).getText();
    console.log('Bulunan Konum:', locationText);

    let temperatureText = await driver.findElement(By.className('weather-temp')).getText();
    console.log('Sıcaklık:', temperatureText);

    let humidityText = await driver.findElement(By.className('humidity-percent')).getText();
    console.log('Nem Oranı:', humidityText);

    let windSpeedText = await driver.findElement(By.className('wind-rate')).getText();
    console.log('Rüzgar Hızı:', windSpeedText);

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await driver.quit();
  }
})();
