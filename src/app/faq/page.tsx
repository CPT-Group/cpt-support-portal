'use client';

import { FAQAccordion } from '@/components/pages';

export default function FAQPage() {
  return (
    <div className="flex flex-column align-items-center flex-1 page-responsive-padding" style={{ paddingTop: '2.5rem', paddingLeft: '8.5rem', paddingRight: '8.5rem' }}>
        <div className="w-full max-w-screen-lg">
          <div className="flex justify-content-between align-items-center mb-4">
            <h1 className="text-5xl font-bold m-0">FAQ</h1>
          </div>
        <p className="text-lg text-color-secondary mb-3 line-height-3">
          Find answers to commonly asked questions about support requests, case information, and settlement processes. 
          If you don't find what you're looking for, please submit a support request and our team will assist you.
        </p>
        <FAQAccordion />
      </div>
    </div>
  );
}

