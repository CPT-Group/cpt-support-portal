export interface FAQItem {
  id: string; // UUID
  question: string;
  answer: string;
}

// FAQ data from Support Portal - FAQ-CONTENT.csv
// Ordered by sort order (1-15)
export const FAQ_DATA: FAQItem[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    question: 'What is a Class Action Lawsuit?',
    answer:
      'In a class action lawsuit, one or more people called "Class Representatives" sue on behalf of other people who have similar claims because they allege they have been harmed in the same way. The people together are a "class" or individually "class members." The individual who brings a lawsuit is called a Plaintiff, and the company sued is called the Defendant. In a class action, one court resolves the issues for everyone in the class—except for those people who choose to exclude themselves from the class.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    question: 'How do I Know if I\'m Included in the Settlement?',
    answer:
      'Please refer to your Notice (e.g., letter, postcard, email, text) for the class or case description to determine if you are eligible. If your Notice includes a website, you can also visit that site for more information about eligibility.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    question: 'What is the Settlement About?',
    answer:
      'Please refer to your Notice (e.g., letter, postcard, email, text) for a description of the case.  If your Notice includes a website, you can also visit that site for more details on the reason for the settlement.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    question: 'What is my Settlement Amount?',
    answer:
      'Your estimated settlement amount may be listed on your Notice. Amounts are subject to change and are dependent on receiving Final Approval from the Court, as applicable. Amounts can differ based on the final awarded settlement amount and the type of case.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    question: 'What Does it Mean to Exclude Myself or Opt-Out of the Settlement?',
    answer:
      'If you opt out, you will not have any rights as a member of the Settlement Class. You will not receive a payment or benefits as part of the Settlement. You will not be bound by the Settlement, releases, or by any further orders or judgments in this case. You will keep the right, if any, to sue on the claims alleged in the Action at your own expense.\n\nEach case has specific criteria to submit a valid request for exclusion or "Opt-Out". Additionally, not all cases accept exclusions. Review your Notice (e.g., letter, postcard, email, text) for instructions to Object to the case.  If your Notice includes a website, you can also visit that site for more details on how to exclude yourself.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    question: 'What Does it Mean to Object to the Settlement?',
    answer:
      'If you are a Settlement Class Member and you do not opt out of the Settlement, you can object to the Settlement if you do not think it is fair, reasonable, or adequate. You can give reasons why you think the Court should not approve it. You cannot ask the Court to change or order a different settlement; the Court can only approve or deny this Settlement. If the Court denies approval, no settlement payments will be sent out and the Action will continue. If that is what you want to happen, you must object.\n\nEach case has specific criteria to submit a valid objection. Additionally, not all cases accept objections. Review your Notice (e.g., letter, postcard, email, text) for instructions to object to the case.  If your Notice includes a website, you can also visit that site for more details on how to object.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    question: 'Can I Opt-Out and Object to the Settlement?',
    answer:
      ' If you opt out of the Settlement you cannot file an objection because the Settlement no longer affects you. If you object to the Settlement and request to exclude yourself, your objection will be voided, and you will be deemed to have excluded yourself.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    question: 'What if I Disagree with my Settlement Amount?',
    answer:
      'If you believe your estimated settlement amount is incorrect and/or the criteria to calculate that amount (e.g., Workweeks, shifts) is not accurate, you have the option to submit a dispute. If your case allows disputes, instructions are provided in the Notice you received. Typically, you must inform CPT (the Settlement Administrator) about the discrepancy, provide your believed correct information and submit supporting documentation.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    question: 'How do I Submit a Claim?',
    answer:
      'If your case is claim based, review your Notice (e.g., letter, postcard, email, text) for instructions on how to submit a claim.  If your Notice includes a website, you can also visit that site for more details on how to submit a claim.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    question: 'What is my ID and/or Passcode?',
    answer:
      'If your case has an interactive web portal for submissions, you may be asked for an ID and/or Passcode to log into the form. Your ID and/or Passcode are located on the Notice that you received directing you to the website. If you received a letter or email, this information is typically in the upper right corner. If you received a postcard, it is typically above your name and address.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    question: 'Did you Receive my Response?',
    answer:
      'Depending on your case, you can submit responses through mail, email or online via an interactive web portal. \n•\tIf you submitted via email, a confirmation email will be sent within 7 business days.\n•\tIf you submitted via mail, it could take up to 30 days from the postmark date to be processed. You will not receive receipt confirmation. We will only contact you if we need additional information or have questions about your response. \n•\tIf you submitted online, you received a confirmation number on the confirmation page after you click submit. Additionally, an email was sent with the confirmation details. \n\nIf you are still unsure if your response was received, you can send an inquiry to our team.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    question: 'Did you Receive my Supporting Documents?',
    answer:
      'If you received a request for supporting documents based on your initial submission, your response options are typically via email or mail. \n\n•\tIf you submitted your supporting documents via email, a confirmation email will be sent within 7 business days.\n•\tIf you submitted via mail, it could take up to 30 days from the postmark date to be processed. You will not receive receipt confirmation. We will only contact you if we need additional information or have questions about your supporting information.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    question: 'When Will I Receive my Settlement Payment',
    answer:
      'Disbursement of individual payments occurs based on the case and court type. Some courts have longer appeal periods than others, which extends the length of time between the Court granting Final Approval (e.g., 30 days or 60 days after) and disbursement.  Review the case website (if applicable) for disbursement updates.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    question: 'What is a Final Approval Hearing?',
    answer:
      'The Court holds a Final Approval Hearing (also called the Fairness Hearing) to consider whether the Settlement is fair, reasonable, and adequate; Class Counsel\'s application for attorneys\' fees, costs, and expenses; and whether to approve Service Awards to the Class Representatives (if applicable).\n\nIf there are objections, the Court will consider them. The Court may choose to hear from people who have asked to speak at the hearing. At or after the hearing, the Court will decide whether to approve the Settlement. There is no deadline by which the Court must make its decision.\n\nYou do not need to attend the Final Approval Hearing as Class Counsel will answer any questions from the Court. You may attend at your own expense if you wish.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440015',
    question: 'What if I Did Not Receive my Payment?',
    answer:
      'Payments can take between 10-14 business days to arrive. Therefore, please allow that amount of time from the disbursement date to receive your payment. If you are a participating Class Member or Claimant and have not received your payment after 14 business days, you can request a reissue.',
  },
];

