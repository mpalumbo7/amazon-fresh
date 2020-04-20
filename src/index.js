import webdriver from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import chromedriver from "chromedriver";
import moment from "moment";

import checkDeliverySlots from "./checkDeliverySlots";
import { sleep } from "sleep";

// create chrome driver
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
const driver = new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

const url =
  "https://www.amazon.com/gp/buy/shipoptionselect/handlers/display.html?hasWorkingJavascript=1";

// Determine the slots to check
const dtFormat = "YYYYMMDD";
const slots = [moment(), moment().add(1, 'days'), moment().add(2, 'days')].map(s => s.format(dtFormat));

// the main function
(async () =>
{
  // open browser
  await driver.get(url);

  // wait for user to complete login, and navigate to delivery slots page
  sleep(60);

  // refresh and check every 10 seconds
  const interval = 30;

  // Loop forever
  while (true)
  {
    sleep(interval);
    await checkDeliverySlots(driver, slots);
  }

  //await driver.quit();
})();
