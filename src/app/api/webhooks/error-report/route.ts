import { NextRequest, NextResponse } from 'next/server';

// Enable runtime config for Netlify serverless functions
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.NEXT_PUBLIC_ERROR_REPORT_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl.trim() === '') {
      console.error('Error Report Webhook: URL not configured');
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    // Format data for Office 365 Teams webhook
    // Teams webhooks accept simple text format: { "text": "message" }
    let teamsMessage: string;
    
    if (body.name || body.email || body.additionalInfo) {
      // User provided feedback
      teamsMessage = `**Error Report Received**\n\n` +
        `**Error Type:** ${body.errorType}\n` +
        `**Error Path:** ${body.errorPath}\n` +
        (body.name ? `**Name:** ${body.name}\n` : '') +
        (body.email ? `**Email:** ${body.email}\n` : '') +
        (body.additionalInfo ? `**Additional Info:** ${body.additionalInfo}\n` : '') +
        `**Timestamp:** ${new Date(body.timestamp).toLocaleString()}`;
    } else {
      // No feedback given
      teamsMessage = `**Error Report**\n\n` +
        `**Error Type:** ${body.errorType}\n` +
        `**Error Path:** ${body.errorPath}\n` +
        `**Feedback:** No feedback given\n` +
        `**Timestamp:** ${new Date(body.timestamp).toLocaleString()}`;
    }

    // Office 365 Teams webhook format - simple text format
    const teamsPayload = {
      text: teamsMessage,
    };

    // Forward the request to the webhook URL (server-side, no CORS issues)
    // This works in both local development and Netlify serverless functions
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamsPayload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      console.error('Webhook request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        webhookUrl: webhookUrl.substring(0, 50) + '...', // Log partial URL for debugging
      });
      return NextResponse.json(
        { error: `Webhook request failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Log success in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Error Report Webhook sent successfully:', {
        errorType: body.errorType,
        errorPath: body.errorPath,
        hasFeedback: !!(body.name || body.email || body.additionalInfo),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send webhook:', error);
    // Return a generic error to client (don't expose internal details)
    return NextResponse.json(
      { error: 'Failed to send webhook request' },
      { status: 500 }
    );
  }
}

