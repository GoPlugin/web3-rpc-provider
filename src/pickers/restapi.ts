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
        console.log("Response data:", data);

        // Check if data is an array, if not, wrap it in an array
        const dataArray = Array.isArray(data) ? data : [data];
        
        // Filter out any null or undefined items
        const validData = dataArray.filter(item => item && item.chainId && item.url);
        
        endpoints.push(...validData.map((item: any) => ({
          chainId: item.chainId,
          url: item.url,
          apiKey: item.apiKey || "",
        })));
      }

      console.log("Processed endpoints:", endpoints);
      return endpoints;
    } catch (error) {
      console.error("RestAPI picker error:", error);
      return [];
    }
  }
}