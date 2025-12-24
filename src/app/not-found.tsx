'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { CPTButton, CPTDialog, CPTInputText, CPTInputTextarea, CPTMessage } from '@cpt-group/cpt-prime-react';
import { confirmDialog } from 'primereact/confirmdialog';
import { sendErrorReportWebhook } from '@/utils/webhooks';

export default function NotFound() {
  const pathname = usePathname();
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSendError = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sendErrorReportWebhook({
        errorType: '404 - Page Not Found',
        errorPath: pathname || '/unknown',
        timestamp: new Date().toISOString(),
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        additionalInfo: additionalInfo.trim() || undefined,
      });

      setSubmitSuccess(true);
      // Reset form after a moment
      setTimeout(() => {
        setName('');
        setEmail('');
        setAdditionalInfo('');
        setSubmitSuccess(false);
        setErrorDialogVisible(false);
      }, 2000);
    } catch (error) {
      setSubmitError('Failed to send error report. Please try again.');
      console.error('Error sending error report:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, email, additionalInfo, pathname]);

  const handleCptGroupClick = useCallback(() => {
    confirmDialog({
      message: 'Would you like to leave CPT Support and navigate to CPT Corporate?',
      header: 'Navigate to CPT Corporate',
      icon: 'pi pi-external-link',
      accept: () => {
        window.location.href = 'https://cptgroup.com';
      },
    });
  }, []);

  return (
    <>
      <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 5rem)', padding: '3rem 1rem' }}>
        <div className="flex flex-column align-items-center gap-4" style={{ maxWidth: '600px', width: '100%' }}>
          {/* 404 Icon */}
          <i className="pi pi-exclamation-triangle text-9xl text-primary" style={{ opacity: 0.8 }} />
          
          {/* Title */}
          <h1 className="text-6xl font-bold m-0 text-center">404</h1>
          
          {/* Subtitle */}
          <h2 className="text-3xl font-semibold m-0 text-center">Page Not Found</h2>
          
          {/* Description */}
          <p className="text-color-secondary text-center line-height-3" style={{ fontSize: '1.1rem' }}>
            The page you're looking for doesn't exist or has been moved.
            <br />
            We're sorry for the inconvenience.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-content-center flex-wrap mt-3">
            <CPTButton
              label="Back to Home"
              icon="pi pi-home"
              iconPos="left"
              onClick={() => window.location.href = '/'}
              className="p-button-primary"
            />
            <CPTButton
              label="CPT Corporate"
              icon="pi pi-external-link"
              iconPos="left"
              onClick={handleCptGroupClick}
              className="p-button-outlined"
            />
            <CPTButton
              label="Report This Error"
              icon="pi pi-send"
              iconPos="left"
              onClick={() => setErrorDialogVisible(true)}
              className="p-button-text"
            />
          </div>
        </div>
      </div>

      {/* Error Report Dialog */}
      <CPTDialog
        header="Report Error to CPT Support"
        visible={errorDialogVisible}
        onHide={() => {
          if (!isSubmitting) {
            setErrorDialogVisible(false);
            setSubmitError(null);
            setSubmitSuccess(false);
            // Reset form when closing
            if (!submitSuccess) {
              setName('');
              setEmail('');
              setAdditionalInfo('');
            }
          }
        }}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '640px': '90vw' }}
        modal
        dismissableMask={!isSubmitting}
      >
        {submitSuccess ? (
          <div className="flex flex-column gap-4 align-items-center">
            <i className="pi pi-check-circle text-6xl text-primary" />
            <h3 className="m-0 font-semibold text-center">Thank You!</h3>
            <p className="text-color-secondary line-height-3 text-center">
              Your error report has been submitted. We appreciate you helping us improve!
            </p>
          </div>
        ) : (
          <div className="flex flex-column gap-4">
            <p className="text-color-secondary line-height-3 m-0">
              Would you like to send this error to CPT Support? All fields are optional, but providing your information helps us contact you if we need more details.
            </p>

            <div className="flex flex-column gap-3">
              <div className="flex flex-column gap-2">
                <label htmlFor="error-name" className="font-semibold">
                  Name
                </label>
                <CPTInputText
                  id="error-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-column gap-2">
                <label htmlFor="error-email" className="font-semibold">
                  Email
                </label>
                <CPTInputText
                  id="error-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com (optional)"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-column gap-2">
                <label htmlFor="error-info" className="font-semibold">
                  Additional Information
                </label>
                <CPTInputTextarea
                  id="error-info"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Please describe what you were trying to do when you encountered this error (optional)"
                  rows={5}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {submitError && (
              <CPTMessage severity="error" text={submitError} />
            )}

            <div className="flex justify-content-end gap-2 mt-2">
              <CPTButton
                label="Cancel"
                icon="pi pi-times"
                onClick={() => {
                  setErrorDialogVisible(false);
                  setSubmitError(null);
                  setName('');
                  setEmail('');
                  setAdditionalInfo('');
                }}
                className="p-button-text"
                disabled={isSubmitting}
              />
              <CPTButton
                label="Send"
                icon="pi pi-send"
                onClick={handleSendError}
                className="p-button-primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}
      </CPTDialog>
    </>
  );
}

