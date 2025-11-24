import { FAQAccordion } from '@/components/pages';

export default function FAQPage() {
  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
      <div className="w-full max-w-screen-lg">
        <h1 className="text-5xl font-bold mb-4">FAQ</h1>
        <p className="text-lg text-color-secondary mb-6 line-height-3">
          Find answers to commonly asked questions about support requests, case information, and settlement processes. 
          If you don't find what you're looking for, please submit a support request and our team will assist you.
        </p>
        <FAQAccordion />
      </div>
    </div>
  );
}

