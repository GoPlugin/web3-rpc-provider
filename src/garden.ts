import { Browser } from 'puppeteer-core';
import { PickerClass, Endpoint } from './common';
import { RestAPI } from './pickers/restapi';

export class Garden {
  constructor(
    private browser: Browser,
    private pickers: Map<string, PickerClass>
  ) {}

  async collect(sources: string[], chains: number[]): Promise<Endpoint[]> {
    const results: Endpoint[] = [];

    for (const source of sources) {
      const Picker = this.pickers.get(source);
      if (!Picker) {
        console.warn(`Unknown source: ${source}`);
        continue;
      }

      try {
        let endpoints: Endpoint[] = [];
        if (source === 'restapi') {
          // For RestAPI, don't need a browser page
          const picker = new Picker();
          endpoints = await picker.pick(chains);
        } else {
          // For other pickers that need browser (like Chainlist)
          const page = await this.browser.newPage();
          try {
            const picker = new Picker(page);
            endpoints = await picker.pick(chains);
          } finally {
            await page.close();
          }
        }
        results.push(...endpoints);
      } catch (error) {
        console.error(`Error collecting from ${source}:`, error);
      }
    }

    // Remove duplicates based on URL
    const uniqueEndpoints = results.filter((endpoint, index, self) =>
      index === self.findIndex((e) => e.url === endpoint.url)
    );

    return uniqueEndpoints;
  }
}
