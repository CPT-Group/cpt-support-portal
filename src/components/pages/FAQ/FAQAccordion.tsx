'use client';

import { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { FAQ_DATA } from '@/constants';
import type { FAQItem } from '@/constants/faqData';

export const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState<number | number[] | null>(null);

  const handleTabChange = (e: { index: number | number[] | null }) => {
    setActiveIndex(e.index);
  };

  if (!FAQ_DATA || FAQ_DATA.length === 0) {
    return <div>No FAQ data available</div>;
  }

  return (
    <div className="w-full">
      <Accordion activeIndex={activeIndex} onTabChange={handleTabChange}>
        {FAQ_DATA.map((item: FAQItem) => (
          <AccordionTab 
            key={item.id} 
            header={item.question}
            contentClassName="line-height-2"
            className="font-inter"
            headerClassName="font-inter"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            headerStyle={{ fontFamily: 'var(--font-inter), sans-serif' }}
            contentStyle={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <div 
              className="m-0" 
              style={{ lineHeight: '1.35', fontSize: '1rem', fontFamily: 'var(--font-inter), sans-serif' }}
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

