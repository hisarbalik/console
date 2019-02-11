import config from '../config';
import kymaConsole from '../commands/console';
import common from '../commands/common';
import logOnEvents from '../utils/logging';
import { describeIf } from '../utils/skip';
import dex from '../utils/dex';
import logsCommands from '../commands/log-ui';

let browser, page;
let token = '';

describeIf(dex.isStaticUser(), 'Log UI tests', () => {
  beforeAll(async () => {
    const data = await common.beforeAll();
    browser = data.browser;
    page = data.page;
    logOnEvents(page, t => (token = t));
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Check Log UI', async () => {
    const contentHeader = '.fd-side-nav__group';

    // go to Logs view
    await page.waitForSelector(contentHeader);
    const navItem = 'a.fd-side-nav__link';
    await page.$$eval(navItem, item =>
      item.find(text => text.innerText.includes('Logs')).click()
    );
    await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });

    // check labels available
    const frame = await kymaConsole.getFrame(page);
    const logsUIPanel = '.panel-body';
    await frame.waitForSelector(logsUIPanel);
    const currentLabels = await logsCommands.getLabels(frame);
    expect(currentLabels.length).toBeGreaterThan(2);

    // select label namespace
    const labelSelectBox = '#label';
    await frame.select(labelSelectBox, 'namespace');

    // wait until values for namespace loaded
    const currentLabelValues = await logsCommands.getLabelValues(frame);
    expect(currentLabelValues.length).toBeGreaterThan(1);

    //select namespace kyma-system
    const labelValuesSelectBox = '#labelValue';
    await frame.select(labelValuesSelectBox, 'kyma-system');

    // search for logs
    const form = await frame.$('.fd-button');
    await form.click();
    await frame.waitFor(1000);

    //check log search result
    const frame2 = await kymaConsole.getFrame(page);
    const tables = await logsCommands.getSearchResult(frame2);
    expect(tables.length).toBeGreaterThan(1);
  });
});
