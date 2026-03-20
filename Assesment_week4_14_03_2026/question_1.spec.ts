import {test} from '@playwright/test';
test('icc_women_odi_rankings', async ({ page }) => {
    test.slow();
    await page.goto('https://www.icc-cricket.com/rankings/batting/womens/odi');
    const info = page.locator(
        '//tbody/descendant::span[@class=" font-h4 pr-4 font-extrabold uppercase text-primary "] | //tbody/descendant::span[@class="font-h4-upper font-extrabold leading-140 uppercase text-primary tracking-wide"] | (//tbody/descendant::span[@class="text-xs leading-140 font-medium capitalize text-primary"])[1] | //tbody/descendant::span[@class="text-sm lg:text-2xl leading-140 uppercase font-extrabold text-primary tracking-wide"] | //tbody/descendant::span[@class="font-h4 leading-140 font-extrabold uppercase text-blue-950"]'             
    );
    const allTexts = await info.allInnerTexts();
    for (let i = 0; i < allTexts.length; i += 4) {
        const position = allTexts[i] || '';
        const country = allTexts[i + 1] || '';
        const first_name = allTexts[i + 2] || '';
        const last_name =allTexts[i+3] || '';
        const rating = allTexts[i + 4] || '';
        if (position && first_name) {
            console.log(`${position} ${country} ${first_name} ${last_name} ${rating}`);
        }
    }
    await page.screenshot({path: `tests/date_07_03_26/screenshot/question_1_${Date.now()}.png`})
})