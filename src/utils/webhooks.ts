/**
 * Webhook utility functions for sending data to external services
 */

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
  const webhookUrl = process.env.NEXT_PUBLIC_FAQ_FEEDBACK_WEBHOOK_URL;

  if (!webhookUrl) {
    // In development, log to console instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log('FAQ Feedback Webhook (would send):', data);
      return;
    }
    // In production, silently fail if webhook URL is not configured
    console.warn('FAQ Feedback Webhook URL not configured');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    // Log error but don't throw - we don't want to break the user experience
    console.error('Failed to send FAQ feedback webhook:', error);
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

