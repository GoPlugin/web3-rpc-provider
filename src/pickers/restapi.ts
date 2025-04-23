import { Picker, Endpoint } from "../common";
import { config } from "../config";

export class RestApi implements Picker {
  constructor() {}

  async pick(chainIds: number[]): Promise<Endpoint[]> {
    try {
      const endpoints: Endpoint[] = [];
      
      for (const chainId of chainIds) {
        const response = await fetch(`${config.urls.backend}/endpoints/search?chainId=${chainId}`);
        if (!response.ok) continue;
        
        const data = await response.json();
        endpoints.push(...data.map((item: any) => ({
          chainId: item.chainId,
          url: item.url
        })));
      }

      return endpoints;
    } catch (error) {
      console.error("RestAPI picker error:", error);
      return [];
    }
  }
}