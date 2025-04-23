import express, {Express, Request, Response} from 'express';
import puppeteer, {Browser} from 'puppeteer-core';
import { PickerClass } from "./common"
import { Garden } from './garden';
import * as pickers from './pickers';
import cors from 'cors';
import { config } from './config';

async function bootstrap() {
  const app: Express = express();
  const browser: Browser = await puppeteer.launch({
      headless: true,
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      args: ['--no-sandbox', '--disabled-setupid-sandbox'],
  });
  
  const map = new Map<string, PickerClass>();
  Object.entries(pickers).forEach(([key, value]) => {
    // Convert key to lowercase for case-insensitive matching
    const normalizedKey = key.toLowerCase();
    map.set(normalizedKey, value);
    console.log(`Loaded picker - Key: ${normalizedKey}, Value:`, value);
  });
  const garden = new Garden(browser, map);

  app.use(cors({
    origin: config.urls.frontend,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
  }));

  app.get('/endpoints', async (req: Request<unknown, unknown, unknown,{ sources: string[], chains: number[] }>, res: Response) => {
    res.header('Access-Control-Allow-Origin', config.urls.frontend);
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (!req.query.sources || !req.query.chains) {
      res.send([]);
      return;
    }
    try {
      const result = await garden.collect(req.query.sources, req.query.chains.map(Number));
      res.send(result);
    } catch (error) {
      console.error('Error collecting endpoints:', error);
      res.status(500).send({ error: 'Failed to collect endpoints' });
    }
  });

  app.get('/:chain/endpoints', async (req: Request<{ chain: string }, unknown, unknown,{ sources: string[] }>, res: Response) => {
    if (!req.query.sources || !req.params.chain) {
      res.send([]);
      return;
    }
    const result = await garden.collect(req.query.sources, [Number(req.params.chain)])
    res.send(result);
  });

  app.listen(config.ports.provider, () => {
    console.log(`Provider service running on port ${config.ports.provider}`);
    console.log(`Connected to backend at ${config.urls.backend}`);
  });
}

void bootstrap();

