import { UniversalBetSlip } from '../services/converter/taxonomy';
import { extractSlipViaAiFallback } from '../services/converter/extractors/aiFallback';
import { generateUniversalCartLink, DeepLinkResult } from '../services/converter/injectors/deepLinker';

/**
 * BULLMQ CONVERSION DISPATCHER WORKER
 * Handles heavy conversions, AI OCR, and multi-sport normalization off the main thread.
 */

export interface ConversionJobData {
  jobId: string;
  rawText?: string;
  screenshotBase64?: string;
  sourceBookmaker?: string;
  targetBookmaker: string;
  bookingCode?: string;
}

export interface ConversionProgressUpdate {
  jobId: string;
  step: 'SCANNING' | 'NORMALIZING' | 'MATCHING' | 'GENERATING' | 'COMPLETED';
  progressPercent: number;
  statusMessage: string;
  result?: DeepLinkResult;
}

export class ConversionDispatcherWorker {
  private isProcessing = false;

  /**
   * Dispatches a conversion job through progressive pipeline milestones.
   */
  public async processConversionJob(
    job: ConversionJobData,
    onProgress?: (update: ConversionProgressUpdate) => void
  ): Promise<DeepLinkResult> {
    this.isProcessing = true;

    // Milestone 1: 10% - Scanning & Extracting Slip
    onProgress?.({
      jobId: job.jobId,
      step: 'SCANNING',
      progressPercent: 10,
      statusMessage: `Scanning slip from ${job.sourceBookmaker || 'Origin Bookmaker'}...`,
    });
    await new Promise(r => setTimeout(r, 400));

    // Extract via AI or API
    const canonicalSlip: UniversalBetSlip = await extractSlipViaAiFallback({
      raw_text: job.rawText || job.bookingCode,
      screenshot_base64: job.screenshotBase64,
      source_hint: job.sourceBookmaker,
    });

    // Milestone 2: 40% - Normalizing Multi-Sport Taxonomy
    onProgress?.({
      jobId: job.jobId,
      step: 'NORMALIZING',
      progressPercent: 40,
      statusMessage: `Normalizing ${canonicalSlip.legs_count} selections across Universal Multi-Sport Schema...`,
    });
    await new Promise(r => setTimeout(r, 500));

    // Milestone 3: 75% - Fuzzy Matching & Liquidity Resolution
    onProgress?.({
      jobId: job.jobId,
      step: 'MATCHING',
      progressPercent: 75,
      statusMessage: `Matching fixtures & odds liquidity on ${job.targetBookmaker}...`,
    });
    await new Promise(r => setTimeout(r, 500));

    // Milestone 4: 100% - Injecting into Destination Cart
    const result = generateUniversalCartLink(canonicalSlip, job.targetBookmaker);

    onProgress?.({
      jobId: job.jobId,
      step: 'COMPLETED',
      progressPercent: 100,
      statusMessage: `Booking code ${result.bookingCode} generated with affiliate token!`,
      result,
    });

    this.isProcessing = false;
    return result;
  }
}

export const conversionWorker = new ConversionDispatcherWorker();
