import axios from 'axios';

function isAxiosError(error: any): error is { isAxiosError: boolean; response?: any; message?: string } {
  return error && typeof error === 'object' && error.isAxiosError === true;
}

import { UrlScanRequest, UrlScanResult, UrlScanSubmitResponse } from '../types';

/**
 * Service for scanning URLs and checking if they are safe or malicious
 * using the urlscan.io API
 */
export class UrlScanService {
  private apiKey: string;
  private baseUrl = 'https://urlscan.io/api/v1';
  private pollingInterval = 5000; // 5 seconds
  private maxRetries = 12; // Wait up to 1 minute (12 * 5 seconds)

  /**
   * Creates a new UrlScanService instance
   * @param apiKey - The urlscan.io API key
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('urlscan.io API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Submits a URL for scanning
   * @param url - The URL to scan
   * @param visibility - The visibility of the scan (public, unlisted, private)
   * @returns Promise resolving to the scan submission result
   */
  async submitUrl(url: string, visibility: 'public' | 'unlisted' | 'private' = 'private'): Promise<UrlScanSubmitResponse> {
    try {
      const requestData: UrlScanRequest = {
        url,
        visibility
      };

      const response = await axios.post(
        `${this.baseUrl}/scan/`,
        requestData,
        {
          headers: {
            'API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data as UrlScanSubmitResponse;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new Error(`URL scan submission failed: ${error.response?.data?.message || error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`URL scan submission failed: ${error.message}`);
      }
      throw new Error('URL scan submission failed: Unknown error');
    }
  }

  /**
   * Retrieves scan results by UUID
   * @param uuid - The UUID of the scan
   * @returns Promise resolving to the scan results
   */
  async getScanResult(uuid: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/result/${uuid}`,
        {
          headers: {
            'API-Key': this.apiKey
          }
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        // Results are not yet ready
        return null;
      }
      if (isAxiosError(error)) {
        throw new Error(`Failed to retrieve scan results: ${error.response?.data?.message || error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve scan results: ${error.message}`);
      }
      throw new Error('Failed to retrieve scan results: Unknown error');
    }
  }

  /**
   * Waits for scan results to be ready and returns them
   * @param uuid - The UUID of the scan
   * @returns Promise resolving to the processed scan results
   */
  async waitForResults(uuid: string): Promise<UrlScanResult> {
    let retries = 0;

    while (retries < this.maxRetries) {
      const rawResult = await this.getScanResult(uuid);

      if (rawResult) {
        return this.processResults(rawResult);
      }

      // Wait before trying again
      await new Promise(resolve => setTimeout(resolve, this.pollingInterval));
      retries++;
    }

    throw new Error('Scan timed out. Results not available within the allocated time.');
  }

  /**
   * Processes raw scan results into a standardized format
   * @param rawResult - The raw scan results from urlscan.io
   * @returns Processed scan results
   */
  private processResults(rawResult: any): UrlScanResult {
    // Extract threat indicators from the page verdicts
    const verdicts = rawResult.verdicts || {};
    const pageScore = verdicts.overall?.score || 0;
    const isMalicious = pageScore >= 80; // Consider scores >= 80 as malicious

    // Extract category information
    const page = rawResult.page || {};
    let primaryCategory = 'uncategorized';
    let secondaryCategories: string[] = [];

    if (page.categories && page.categories.length > 0) {
      primaryCategory = page.categories[0];
      secondaryCategories = page.categories.slice(1);
    }

    // Extract all engines results
    const engines: { [key: string]: { result: 'clean' | 'malicious' | 'suspicious', confidence?: number } } = {};
    if (verdicts.engines) {
      Object.entries(verdicts.engines).forEach(([name, data]: [string, any]) => {
        engines[name] = {
          result: data.malicious ? 'malicious' : (data.suspicious ? 'suspicious' : 'clean'),
          confidence: data.confidence
        };
      });
    }

    // Construct the final result
    const result: UrlScanResult = {
      url: rawResult.task?.url || '',
      finalUrl: page.url || rawResult.task?.url || '',
      status: 'completed',
      categories: {
        primary: primaryCategory,
        secondary: secondaryCategories
      },
      threat: {
        score: pageScore,
        malicious: isMalicious,
        engines
      },
      summary: {
        isSafe: !isMalicious,
        category: primaryCategory,
        score: pageScore
      }
    };

    // Add screenshot URL if available
    if (rawResult.task?.screenshotURL) {
      result.screenshot = rawResult.task.screenshotURL;
    }

    return result;
  }

  /**
   * Scans a URL and returns information about whether it's safe and its category
   * @param url - The URL to scan
   * @returns Promise resolving to the URL scan results
   */
  async scanUrl(url: string): Promise<UrlScanResult> {
    try {
      // Submit the URL for scanning
      const submission = await this.submitUrl(url);
      // Wait for and process results
      const results = await this.waitForResults(submission.uuid);
      return results;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error scanning URL: ${error.message}`);
      }
      throw new Error('Error scanning URL: Unknown error');
    }
  }
}
