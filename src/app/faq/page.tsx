import { FAQAccordion } from '@/components/pages';

export default function FAQPage() {
  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen p-4">
      <div className="w-full max-w-screen-lg">
        <h1 className="text-5xl font-bold mb-4">FAQ</h1>
        <FAQAccordion />
      </div>
    </div>
  );
}

