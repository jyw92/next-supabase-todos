'use client';

import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import styles from './label-calendar.module.scss';
import {Button} from '@/components/ui/button';
import {CalendarIcon, ChevronDownIcon} from 'lucide-react';
import {Calendar} from '@/components/ui/calendar';
import {useState} from 'react';
import {format} from 'date-fns';

interface Props {
  label: string;
  readonly?: boolean;
}

function LabelCalendar({label, readonly}: Props) {
  const [date, setDate] = useState<Date>();

  return (
    <div className={styles.inner__container}>
      <span className={styles.inner__conainer__label}>{label}</span>
      {/* Shadcn UI - Calendar */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="w-[200px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </div>
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export default LabelCalendar;
