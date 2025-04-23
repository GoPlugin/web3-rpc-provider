import { Page } from "puppeteer-core";
import { Picker, Endpoint } from "../common";

export class ChainList implements Picker {
  constructor(private page: Page) {}

  async pick(chainIds: number[]): Promise<Endpoint[]> {
    if (!this.page) {
      throw new Error("must setup page!");
    }

    const url = 'https://chainlist.org/';
    if (this.page.url() !== url) {
      await this.page.goto(url, {
          // timeout: 30 * 1000,
          waitUntil: [
              'load', 
              'domcontentloaded', 
              // 'networkidle0',
              'networkidle2', 
          ],
      });
    }

    const selector = '#__NEXT_DATA__'
    const elementHandle = await this.page.waitForSelector(selector);
    if (!elementHandle) {
      console.warn(`cannot found '${selector}' element!`)
      return [];
    }
    const content = await this.page.evaluate(e => e.textContent, elementHandle);
    if (!content) {
      console.warn(`cannot extracted content:`, content);
      return [];
    }
    const data = JSON.parse(content);

    const endpoints: Endpoint[] = [];
    for (let i = 0; i < data.props.pageProps.chains.length; i++) {
      if (chainIds.includes(data.props.pageProps.chains[i].chainId)) {
        for (let j = 0; j < data.props.pageProps.chains[i].rpc.length; j++) {
          endpoints.push({
            chainId: data.props.pageProps.chains[i].chainId,
            url: data.props.pageProps.chains[i].rpc[j].url,
          });
        }
      }
    }
    console.log("endpoints::::",endpoints)
    return endpoints;
  }
}
