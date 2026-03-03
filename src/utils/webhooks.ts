/**
 * Webhook utility functions for sending data to external services
 */

interface SupportSubmissionWebhookData {
  firstName: string;
  lastName: string;
  caseName: string;
  requestTypes: string;
}

/**
 * Fire-and-forget: sends a support submission notification to a Teams webhook.
 * Only call from server (e.g. API route). Never throws; failures are logged and swallowed.
 */
export function notifySupportSubmissionTeams(
  webhookUrl: string,
  data: SupportSubmissionWebhookData
): void {
  const text =
    `**New Support Submission**\n\n` +
    `**Name:** ${data.firstName} ${data.lastName}\n` +
    `**Case:** ${data.caseName}\n` +
    `**Request type(s):** ${data.requestTypes}`;
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }).catch((err) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[support-submission webhook]', err);
    }
  });
}

export interface FAQFeedbackWebhookData {
  faqId: string;
  faqQuestion: string;
  timestamp: string;
  rating?: number;
  comments?: string;
}

/**
 * Sends FAQ feedback data to webhook endpoint
 * @param data - FAQ feedback data to send
 * @returns Promise that resolves when webhook is sent
 */
export async function sendFAQFeedbackWebhook(
  data: FAQFeedbackWebhookData
): Promise<void> {
  // Use Next.js API route to proxy the webhook request (avoids CORS issues)
  try {
    const response = await fetch('/api/webhooks/faq-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    // Log error but don't throw - we don't want to break the user experience
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.warn('FAQ Feedback Webhook: Network error. This may be a connectivity issue.');
      // In development, still log the data that would have been sent
      if (process.env.NODE_ENV === 'development') {
        console.log('FAQ Feedback Webhook (would send):', data);
      }
    } else {
      console.error('Failed to send FAQ feedback webhook:', error);
    }
  }
}

/**
 * Sends initial FAQ helpful feedback (thumbs up click)
 * @param faqId - FAQ item ID
 * @param faqQuestion - FAQ question text
 */
export async function sendFAQHelpfulWebhook(
  faqId: string,
  faqQuestion: string
): Promise<void> {
  await sendFAQFeedbackWebhook({
    faqId,
    faqQuestion,
    timestamp: new Date().toISOString(),
  });
}

export interface ErrorReportWebhookData {
  errorType: string;
  errorPath: string;
  timestamp: string;
  name?: string;
  email?: string;
  additionalInfo?: string;
}

/**
 * Sends error report data to webhook endpoint
 * @param data - Error report data to send
 * @returns Promise that resolves when webhook is sent
 */
export async function sendErrorReportWebhook(
  data: ErrorReportWebhookData
): Promise<void> {
  // Use Next.js API route to proxy the webhook request (avoids CORS issues)
  try {
    const response = await fetch('/api/webhooks/error-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    // Log error but don't throw - we don't want to break the user experience
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.warn('Error Report Webhook: Network error. This may be a connectivity issue.');
      // In development, still log the data that would have been sent
      if (process.env.NODE_ENV === 'development') {
        console.log('Error Report Webhook (would send):', data);
      }
    } else {
      console.error('Failed to send error report webhook:', error);
    }
  }
}

