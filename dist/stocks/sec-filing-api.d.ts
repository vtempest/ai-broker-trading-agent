import { FilingMetadata, RequestedFilings, CompanyAndAccessionNumber, FilingOptions } from './types';
export declare class Downloader {
    private companyName;
    private emailAddress;
    private _tickerToCikMapping;
    private _initPromise;
    constructor(companyName: string, emailAddress: string);
    get userAgent(): string;
    init(): Promise<void>;
    private _loadTickerToCikMapping;
    getFilingMetadatas(query: string | RequestedFilings | CompanyAndAccessionNumber, options?: FilingOptions): Promise<FilingMetadata[]>;
    downloadFiling({ url }: {
        url: string;
    }): Promise<Buffer>;
    getFilingHtml(options?: {
        query?: string;
        ticker?: string;
        form?: string;
    }): Promise<Buffer>;
}
export declare class RequestedFilingsClass implements RequestedFilings {
    tickerOrCik: string;
    formType: string;
    limit: number | null;
    constructor(tickerOrCik: string, formType: string, limit?: number | null);
    static fromString(queryString: string): RequestedFilingsClass;
}
export declare class CompanyAndAccessionNumberClass implements CompanyAndAccessionNumber {
    tickerOrCik: string;
    accessionNumber: string;
    constructor(tickerOrCik: string, accessionNumber: string);
    static fromString(queryString: string, mustMatch?: boolean): CompanyAndAccessionNumberClass | null;
}
export default Downloader;
