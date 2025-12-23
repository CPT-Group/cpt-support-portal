'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Rating } from 'primereact/rating';
import { CPTCard, CPTButton, CPTProgressSpinner, CPTInputTextarea, CPTMessage } from '@cpt-group/cpt-prime-react';
import { FAQ_DATA } from '@/constants/faqData';
import { sendFAQFeedbackWebhook } from '@/utils/webhooks';

interface FeedbackData {
  rating: number;
  comments: string;
}

const CongratulationsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const faqId = searchParams.get('faqId') || '';
  const faq = FAQ_DATA.find((f) => f.id === faqId);

  // Get a user-friendly topic from the FAQ question
  const getFaqTopic = (question: string): string => {
    // Extract key topic from question (e.g., "address change", "passcode", etc.)
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('address')) return 'address change';
    if (lowerQuestion.includes('passcode') || lowerQuestion.includes('id')) return 'ID and Passcode';
    if (lowerQuestion.includes('payment')) return 'payment';
    if (lowerQuestion.includes('settlement')) return 'settlement';
    if (lowerQuestion.includes('response')) return 'response';
    if (lowerQuestion.includes('supporting document')) return 'supporting documents';
    // Default: use first few words of question
    return question.split(' ').slice(0, 4).join(' ');
  };

  const faqTopic = faq ? getFaqTopic(faq.question) : 'FAQ';

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const feedbackData = {
        faqId: faqId,
        faqQuestion: faq?.question || '',
        timestamp: new Date().toISOString(),
        rating: rating,
        comments: comments.trim() || undefined,
      };

      // Send webhook
      await sendFAQFeedbackWebhook(feedbackData);

      // Show success state
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const feedbackData = {
      faqId: faqId,
      faqQuestion: faq?.question || '',
      timestamp: new Date().toISOString(),
      rating: rating,
      comments: comments.trim() || undefined,
    };

    try {
      const jsonString = JSON.stringify(feedbackData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (!faq) {
    return (
      <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
        <CPTCard className="text-center">
          <div className="flex flex-column align-items-center gap-4">
            <i className="pi pi-exclamation-triangle text-6xl text-orange-500" />
            <h1 className="text-4xl font-bold">FAQ Not Found</h1>
            <p className="text-xl text-color-secondary line-height-3">
              The FAQ you're looking for could not be found.
            </p>
            <CPTButton
              label="Back to Home"
              icon="pi pi-home"
              iconPos="left"
              onClick={handleBackToHome}
              className="p-button-primary"
            />
          </div>
        </CPTCard>
      </div>
    );
  }

  if (submitted) {
    const feedbackData = {
      faqId: faqId,
      faqQuestion: faq.question,
      timestamp: new Date().toISOString(),
      rating: rating,
      comments: comments.trim() || undefined,
    };

    return (
      <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
        <div className="w-full max-w-screen-md">
          <CPTCard className="text-center">
            <div className="flex flex-column align-items-center gap-4">
              <i className="pi pi-check-circle text-6xl text-primary" />
              <h1 className="text-4xl font-bold">Thank You!</h1>
              <p className="text-xl text-color-secondary line-height-3">
                Your feedback has been submitted. We appreciate you taking the time to help us improve!
              </p>
              <div className="flex gap-3 justify-content-center flex-wrap mt-4">
                <CPTButton
                  label="Back to Home"
                  icon="pi pi-home"
                  iconPos="left"
                  onClick={handleBackToHome}
                  className="p-button-primary"
                />
              </div>
            </div>
          </CPTCard>

          <CPTCard className="mt-4">
            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between align-items-center">
                <h2 className="text-2xl font-bold m-0">Feedback Data (Prototype)</h2>
                <CPTButton
                  label={copied ? 'Copied!' : 'Copy JSON'}
                  icon={copied ? 'pi pi-check' : 'pi pi-copy'}
                  iconPos="left"
                  onClick={handleCopyToClipboard}
                  className={copied ? 'p-button-success' : 'p-button-secondary'}
                  size="small"
                />
              </div>
              <pre className="p-3 border-round surface-ground text-color overflow-auto text-sm line-height-3" style={{ maxHeight: '500px' }}>
                {JSON.stringify(feedbackData, null, 2)}
              </pre>
            </div>
          </CPTCard>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
      <div className="w-full max-w-screen-md">
        <CPTCard className="text-center">
          <div className="flex flex-column align-items-center gap-4">
            <i className="pi pi-thumbs-up text-6xl text-primary" />
            <h1 className="text-4xl font-bold">
              We're glad our {faqTopic} FAQ helped you!
            </h1>
            <p className="text-xl text-color-secondary line-height-3">
              Your feedback helps us improve our support resources. Please take a moment to rate your experience and share any additional comments or suggestions.
            </p>
          </div>
        </CPTCard>

        <CPTCard className="mt-4">
          <div className="flex flex-column gap-4">
            <div className="flex flex-column gap-2">
              <label htmlFor="rating" className="font-semibold text-lg">
                How would you rate our support?
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex align-items-center gap-2">
                <Rating
                  id="rating"
                  value={rating}
                  onChange={(e) => {
                    setRating(e.value || 0);
                    setError(null);
                  }}
                  stars={5}
                  cancel={false}
                  className="text-2xl"
                />
                {rating > 0 && (
                  <span className="text-color-secondary ml-2">
                    ({rating} {rating === 1 ? 'star' : 'stars'})
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="comments" className="font-semibold">
                Additional Comments or Suggestions
              </label>
              <CPTInputTextarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={5}
                autoResize
                placeholder="Please share any additional comments, suggestions, or feedback about our support..."
                className="w-full"
              />
              <small className="text-color-secondary">
                Optional: Help us improve by sharing your thoughts
              </small>
            </div>

            {error && (
              <CPTMessage
                severity="error"
                text={error}
                className="w-full"
              />
            )}

            <div className="flex justify-content-end gap-2 mt-2">
              <CPTButton
                label="Cancel"
                icon="pi pi-times"
                iconPos="left"
                onClick={handleBackToHome}
                className="p-button-secondary"
                disabled={isSubmitting}
              />
              <CPTButton
                label="Submit Feedback"
                icon="pi pi-check"
                iconPos="right"
                onClick={handleSubmit}
                className="p-button-primary"
                loading={isSubmitting}
                disabled={isSubmitting || rating === 0}
              />
            </div>
          </div>
        </CPTCard>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="flex flex-column align-items-center justify-content-center min-h-screen">
    <CPTProgressSpinner />
  </div>
);

export default function CongratulationsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CongratulationsContent />
    </Suspense>
  );
}

