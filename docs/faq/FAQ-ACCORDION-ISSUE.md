# FAQ Accordion CPT Wrapper Issue Investigation

## Problem
The `CPTAccordion` and `CPTAccordionTab` components from `@cpt-group/cpt-prime-react` are not rendering properly, while the direct PrimeReact `Accordion` and `AccordionTab` components work correctly.

## CPT Wrapper Implementation

### CPTAccordion.tsx
```typescript
import { Accordion, AccordionProps } from 'primereact/accordion';

export type CPTAccordionProps = AccordionProps;

export const CPTAccordion = (props: CPTAccordionProps) => {
  return <Accordion {...props} />;
};
```

### CPTAccordionTab.tsx
```typescript
import { AccordionTab, AccordionTabProps } from 'primereact/accordion';

export type CPTAccordionTabProps = AccordionTabProps;

export const CPTAccordionTab = (props: CPTAccordionTabProps) => {
  return <AccordionTab {...props} />;
};
```

## Working Implementation (Direct PrimeReact)
```typescript
import { Accordion, AccordionTab } from 'primereact/accordion';

<Accordion activeIndex={activeIndex} onTabChange={handleTabChange}>
  {FAQ_DATA.map((item: FAQItem) => (
    <AccordionTab key={item.id} header={item.question}>
      <p className="m-0">{item.answer}</p>
    </AccordionTab>
  ))}
</Accordion>
```

## Non-Working Implementation (CPT Wrapper)
```typescript
import { CPTAccordion, CPTAccordionTab } from '@cpt-group/cpt-prime-react';

<CPTAccordion activeIndex={activeIndex} onTabChange={handleTabChange}>
  {FAQ_DATA.map((item: FAQItem) => (
    <CPTAccordionTab key={item.id} header={item.question}>
      <p className="m-0">{item.answer}</p>
    </CPTAccordionTab>
  ))}
</CPTAccordion>
```

## Possible Causes

1. **React Context Issue**: PrimeReact's `Accordion` uses React Context to communicate with `AccordionTab` children. The wrapper function component might be interfering with React's ability to recognize the parent-child relationship.

2. **Build/Export Issue**: The CPT library version being used (1.0.0) might not have properly built/exported the Accordion components.

3. **React 19 Compatibility**: The project uses React 19.2.0, which might handle component children/context differently than previous versions.

4. **TypeScript/Module Resolution**: There might be an issue with how the CPT library exports are being resolved.

## Next Steps

1. Check if the CPT library needs to be rebuilt
2. Verify the Accordion components are properly exported in the built library
3. Test if other CPT components that use parent-child relationships (like Steps) work correctly
4. Consider using `React.forwardRef` or `React.memo` in the wrapper if needed
5. Check if there's a version mismatch between the library source and the installed package

