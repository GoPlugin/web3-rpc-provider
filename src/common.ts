import { Page } from "puppeteer-core";

export interface Endpoint {
  chainId: number
  url: string
  apiKey: string
}

export interface Picker {
  pick(chainIds: number[]): Promise<Endpoint[]>;
}

export interface PickerClass {
  new(page: Page): Picker;

}
