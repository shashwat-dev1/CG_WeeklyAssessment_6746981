import { test, expect } from '@playwright/test';

test('Question_4', async ({ page }) => {
  await page.goto('https://olympics.com/en/olympic-games/tokyo-2020/medals');
  await page.mouse.wheel(0, 3000);
  const silverMedal = await page.locator("(//span[@class='OcsText-styles__StyledText-sc-bf256156-0 cjPVFu text--sm-body'])[6]").textContent();
  console.log("Silver medals of Armenia:", silverMedal);
  await page.screenshot({path:"screenshot/question_4_"+Date.now()+".png"});
});