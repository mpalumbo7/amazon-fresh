import { By } from "selenium-webdriver";
import { sleep } from "sleep";
import moment from "moment";
import colors from "colors";

import notifier from "node-notifier";

export default async (
  driver,
  slots,
  sleepPageLoad = 10
) => {
  
  console.log(`Refreshing the page at: ${moment().toISOString()}`);
  await driver.navigate().refresh();
    
  // wait for the page to fully load
  sleep(sleepPageLoad);

  // loop until page is available

  // Check the slots
  for (let slot of slots) {
    const slotElement = await driver.findElement(By.id(slot));
    const slotAvailable = await isSlotAvailable(slotElement);
    if (slotAvailable) {
      notifyOS(slot);
      return true;
    }
    console.log(`Slot '${slot}' is unavailable`);
  }
  return false;
};

const isSlotAvailable = async (element) => 
{
  const classes = await element.getAttribute("class");

  // console.log(`Slot: '${slot}' => [${classes}]\n`);
  const classList = classes.split(' ');

  for (const cls of classList)
  {
    if (cls.trim() == 'ufss-unavailable')
    {
      return false;
    }
  }

  return true;
}

const notifyOS = (slot) => 
{
    console.log(colors.inverse(`Slot '${slot}' is available!`));
    notifier.notify({
      title: "Amazon Fresh Available!",
      message: `A slot on ${slot} is available`,
    });
}