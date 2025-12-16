import { default as Alpaca } from '@alpacahq/alpaca-trade-api';
export interface AlpacaConfig {
    keyId: string;
    secretKey: string;
    paper?: boolean;
}
export declare function createAlpacaClient(config: AlpacaConfig): Alpaca;
export type { Alpaca };
