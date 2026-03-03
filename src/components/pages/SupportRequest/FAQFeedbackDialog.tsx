'use client';

import { AppDialog } from '@/components/common';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import type { FAQItem } from '@/constants/faqData';

export type FAQDialogView = 'faq' | 'rating' | 'confirmation';

interface FAQFeedbackDialogProps {
  visible: boolean;
  selectedFaq: FAQItem | null;
  view: FAQDialogView;
  rating: number;
  comments: string;
  feedbackError: string | null;
  isSubmittingFeedback: boolean;
  onHide: () => void;
  onThumbsDown: () => void;
  onThumbsUp: () => void;
  onRatingChange: (value: number) => void;
  onCommentsChange: (value: string) => void;
  onCloseWithoutFeedback: () => void;
  onSubmitFeedback: () => void;
  onBackToHome: () => void;
  onViewFaq: () => void;
}

const DIALOG_HEADER_MAP: Record<FAQDialogView, string> = {
  faq: 'FAQ',
  rating: 'Share Your Feedback',
  confirmation: 'Thank You!',
};

export const FAQFeedbackDialog = ({
  visible,
  selectedFaq,
  view,
  rating,
  comments,
  feedbackError,
  isSubmittingFeedback,
  onHide,
  onThumbsDown,
  onThumbsUp,
  onRatingChange,
  onCommentsChange,
  onCloseWithoutFeedback,
  onSubmitFeedback,
  onBackToHome,
  onViewFaq,
}: FAQFeedbackDialogProps) => {
  const headerText =
    view === 'faq' ? selectedFaq?.question || DIALOG_HEADER_MAP.faq : DIALOG_HEADER_MAP[view];

  return (
    <AppDialog header={headerText} visible={visible} onHide={onHide}>
      {selectedFaq && (
        <>
          {view === 'faq' && (
            <FAQContentView
              selectedFaq={selectedFaq}
              onThumbsDown={onThumbsDown}
              onThumbsUp={onThumbsUp}
            />
          )}
          {view === 'rating' && (
            <FAQRatingView
              rating={rating}
              comments={comments}
              feedbackError={feedbackError}
              isSubmittingFeedback={isSubmittingFeedback}
              onRatingChange={onRatingChange}
              onCommentsChange={onCommentsChange}
              onCloseWithoutFeedback={onCloseWithoutFeedback}
              onSubmitFeedback={onSubmitFeedback}
            />
          )}
          {view === 'confirmation' && (
            <FAQConfirmationView onBackToHome={onBackToHome} onViewFaq={onViewFaq} />
          )}
        </>
      )}
    </AppDialog>
  );
};

interface FAQContentViewProps {
  selectedFaq: FAQItem;
  onThumbsDown: () => void;
  onThumbsUp: () => void;
}

const FAQContentView = ({ selectedFaq, onThumbsDown, onThumbsUp }: FAQContentViewProps) => (
  <div className="flex flex-column gap-3">
    <div className="w-full">
      <div
        className="m-0 line-height-3 text-color-secondary"
        style={{ textAlign: 'left' }}
        dangerouslySetInnerHTML={{ __html: selectedFaq.answer }}
      />
    </div>
    <div className="mt-2 w-full" style={{ textAlign: 'center' }}>
      <h2 className="m-0 font-semibold" style={{ marginBottom: '0.5rem' }}>Was this helpful?</h2>
      <div className="flex justify-content-center align-items-center gap-2">
        <Button
          icon="pi pi-thumbs-down"
          onClick={onThumbsDown}
          className="p-button-primary p-button-rounded"
          tooltip="No - Continue to form"
          tooltipOptions={{ position: 'top' }}
          aria-label="No - Continue to form"
          style={{ width: '3rem', height: '3rem' }}
        />
        <Button
          icon="pi pi-thumbs-up"
          onClick={onThumbsUp}
          className="p-button-secondary p-button-rounded"
          tooltip="Yes - Share feedback"
          tooltipOptions={{ position: 'top' }}
          aria-label="Yes - Share feedback"
          style={{ width: '3rem', height: '3rem' }}
        />
      </div>
    </div>
  </div>
);

interface FAQRatingViewProps {
  rating: number;
  comments: string;
  feedbackError: string | null;
  isSubmittingFeedback: boolean;
  onRatingChange: (value: number) => void;
  onCommentsChange: (value: string) => void;
  onCloseWithoutFeedback: () => void;
  onSubmitFeedback: () => void;
}

const FAQRatingView = ({
  rating,
  comments,
  feedbackError,
  isSubmittingFeedback,
  onRatingChange,
  onCommentsChange,
  onCloseWithoutFeedback,
  onSubmitFeedback,
}: FAQRatingViewProps) => (
  <div className="flex flex-column gap-3">
    <div className="flex flex-column gap-2">
      <label htmlFor="faq-rating" className="font-semibold">
        How would you rate our support?
        <span className="text-red-500"> *</span>
      </label>
      <div className="flex align-items-center gap-2">
        <Rating
          id="faq-rating"
          value={rating}
          onChange={(e) => onRatingChange(e.value ?? 0)}
          stars={5}
          cancel={false}
          className="text-4xl"
        />
        {rating > 0 && (
          <span className="text-color-secondary ml-2">
            ({rating} {rating === 1 ? 'star' : 'stars'})
          </span>
        )}
      </div>
    </div>
    <div className="flex flex-column gap-2">
      <label htmlFor="faq-comments" className="font-semibold">
        Additional Comments or Suggestions
      </label>
      <InputTextarea
        id="faq-comments"
        value={comments}
        onChange={(e) => onCommentsChange(e.target.value)}
        rows={4}
        autoResize
        placeholder="Please share any additional comments, suggestions, or feedback about our support..."
        className="w-full"
      />
      <small className="text-color-secondary">Optional: Help us improve by sharing your thoughts</small>
    </div>
    {feedbackError && (
      <Message severity="error" text={feedbackError} className="w-full" />
    )}
    <div className="flex justify-content-end gap-2 mt-2">
      <Button
        label="Close"
        icon="pi pi-times"
        iconPos="left"
        onClick={onCloseWithoutFeedback}
        className="p-button-secondary"
        disabled={isSubmittingFeedback}
      />
      <Button
        label="Submit Feedback"
        icon="pi pi-check"
        iconPos="right"
        onClick={onSubmitFeedback}
        className="p-button-primary"
        loading={isSubmittingFeedback}
        disabled={isSubmittingFeedback || rating === 0}
      />
    </div>
  </div>
);

interface FAQConfirmationViewProps {
  onBackToHome: () => void;
  onViewFaq: () => void;
}

const FAQConfirmationView = ({ onBackToHome, onViewFaq }: FAQConfirmationViewProps) => (
  <div className="flex flex-column gap-3 align-items-center">
    <i className="pi pi-check-circle text-6xl text-primary" />
    <h2 className="m-0 font-semibold text-center">Thank You!</h2>
    <p className="text-color-secondary line-height-3 text-center">
      Your feedback has been submitted. We appreciate you taking the time to help us improve!
    </p>
    <div className="flex gap-2 justify-content-center flex-wrap">
      <Button
        label="Back to Home"
        icon="pi pi-home"
        iconPos="left"
        onClick={onBackToHome}
        className="p-button-primary"
      />
      <Button
        label="View FAQ"
        icon="pi pi-question-circle"
        iconPos="left"
        onClick={onViewFaq}
        className="p-button-outlined"
      />
    </div>
  </div>
);
