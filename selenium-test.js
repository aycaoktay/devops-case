const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // WeatherApp sayfasını aç
    await driver.get('http://localhost:3000/aycaoktay/devops-case');
    
    // Şehir arama kutusunu bul ve 'Mersin' kelimesini yaz
    await driver.findElement(By.className('cityInput')).sendKeys('Mersin');
    
    // Arama ikonuna tıkla
    await driver.findElement(By.className('search-icon')).click();
    
    // Verilerin yüklenmesi için bekle
    await driver.wait(until.elementLocated(By.className('weather-location')), 5000);

    // Sonuçları kontrol et
    let locationText = await driver.findElement(By.className('weather-location')).getText();
    console.log('Bulunan Konum:', locationText);

    let temperatureText = await driver.findElement(By.className('weather-temp')).getText();
    console.log('Sıcaklık:', temperatureText);

    let humidityText = await driver.findElement(By.className('humidity-percent')).getText();
    console.log('Nem Oranı:', humidityText);

    let windSpeedText = await driver.findElement(By.className('wind-rate')).getText();
    console.log('Rüzgar Hızı:', windSpeedText);

  } finally {
    await driver.quit();
  }
})();
