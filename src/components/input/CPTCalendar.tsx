'use client';

import { Calendar, CalendarProps } from 'primereact/calendar';

export interface CPTCalendarProps extends CalendarProps {}

export const CPTCalendar = (props: CPTCalendarProps) => {
  return <Calendar {...props} />;
};

